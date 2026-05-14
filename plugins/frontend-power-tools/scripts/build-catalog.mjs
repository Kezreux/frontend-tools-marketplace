#!/usr/bin/env node
/**
 * build-catalog.mjs
 *
 * Scans plugins/frontend-power-tools/components/<category>/*.tsx and
 * produces plugins/frontend-power-tools/components/catalog.json.
 *
 * Every component file must have:
 *   1. Five metadata header tags (@component, @category, @description,
 *      @keywords, @complexity).
 *   2. An `export const demos: Record<string, <Name>Props> = { ... };`.
 *
 * Missing either fails the build with a clear error and a non-zero exit.
 *
 * Env vars:
 *   CATALOG_REPO    — "owner/repo" for the sourceUrl. Default Kezreux/frontend-tools-marketplace.
 *   CATALOG_BRANCH  — branch name. Default main.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve, relative, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname    = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT  = resolve(__dirname, "..");
const COMPONENTS   = resolve(PLUGIN_ROOT, "components");
const REPO_ROOT    = resolve(PLUGIN_ROOT, "..", "..");

const [repoOwner = "Kezreux", repoName = "frontend-tools-marketplace"] =
  (process.env.CATALOG_REPO || "").split("/").filter(Boolean).length === 2
    ? process.env.CATALOG_REPO.split("/")
    : ["Kezreux", "frontend-tools-marketplace"];
const BRANCH = process.env.CATALOG_BRANCH || "main";

const CATEGORY_LABELS = {
  navbar:    "Navigation",
  hero:      "Hero sections",
  form:      "Forms",
  data:      "Data display",
  feedback:  "Feedback",
  layout:    "Layout",
  marketing: "Marketing",
};

const REQUIRED_TAGS = ["component", "category", "description", "keywords", "complexity"];
const errors = [];
const components = [];

// ---- main ----

if (!existsSync(COMPONENTS)) {
  console.error(`build-catalog: components/ directory not found at ${COMPONENTS}`);
  process.exit(1);
}

for (const entry of readdirSync(COMPONENTS)) {
  const dir = join(COMPONENTS, entry);
  if (!statSync(dir).isDirectory() || entry.startsWith("_")) continue;
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".tsx") || file.startsWith("_")) continue;
    processComponent(join(dir, file));
  }
}

if (errors.length > 0) {
  console.error("Catalog build failed:");
  for (const e of errors) console.error("  -", e);
  process.exit(1);
}

const categoryIds = [...new Set(components.map(c => c.category))].sort();
const categories  = categoryIds.map(id => ({
  id,
  label: CATEGORY_LABELS[id] || id.charAt(0).toUpperCase() + id.slice(1),
  count: components.filter(c => c.category === id).length,
}));

components.sort((a, b) =>
  a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
);

const now = new Date();
now.setMilliseconds(0);

const catalog = {
  version: "1",
  generatedAt: now.toISOString(),
  categories,
  components,
};

const outPath = join(COMPONENTS, "catalog.json");
writeFileSync(outPath, JSON.stringify(catalog, null, 2) + "\n");

console.log(
  `✓ Wrote ${components.length} components across ${categories.length} categories to ${relative(REPO_ROOT, outPath)}`
);

// ---- helpers ----

function processComponent(filePath) {
  const source  = readFileSync(filePath, "utf-8");
  const relPath = relative(REPO_ROOT, filePath).replace(/\\/g, "/");

  const meta = {};
  for (const tag of REQUIRED_TAGS) {
    const re = new RegExp(`^//\\s*@${tag}:\\s*(.+?)\\s*$`, "m");
    const m  = source.match(re);
    if (!m) {
      errors.push(`${relPath}: missing @${tag} header`);
      meta[tag] = null;
    } else {
      meta[tag] = m[1];
    }
  }
  if (REQUIRED_TAGS.some(t => !meta[t])) return;

  const demoKeys = parseDemos(source, relPath);
  if (demoKeys === null) return;

  components.push({
    name:        meta.component,
    category:    meta.category,
    description: meta.description,
    keywords:    meta.keywords.split(",").map(k => k.trim()).filter(Boolean),
    complexity:  meta.complexity,
    filePath:    relPath,
    sourceUrl:   `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${BRANCH}/${relPath}`,
    lines:       source.split("\n").length,
    demos:       demoKeys,
  });
}

/**
 * Parse `export const demos = { key1: ..., "key two": ..., }` and return
 * the top-level keys. Brace-depth and string-aware. Returns null and
 * pushes to errors on failure.
 */
function parseDemos(source, relPath) {
  const decl = source.match(/export\s+const\s+demos\s*(?::[^=]*)?=\s*\{/);
  if (!decl) {
    errors.push(`${relPath}: missing 'export const demos' — components must export demos: Record<string, Props>`);
    return null;
  }
  const startIdx = decl.index + decl[0].length;

  // 1. Find matching closing `}` for the demos object.
  let depth = 1;
  let i = startIdx;
  let inStr = null;
  while (i < source.length && depth > 0) {
    const c = source[i];
    if (inStr) {
      if (c === "\\") { i += 2; continue; }
      if (c === inStr) inStr = null;
      i++; continue;
    }
    if (c === '"' || c === "'" || c === "`") { inStr = c; i++; continue; }
    if (c === "/" && source[i + 1] === "/") {
      const nl = source.indexOf("\n", i);
      i = nl === -1 ? source.length : nl + 1;
      continue;
    }
    if (c === "/" && source[i + 1] === "*") {
      const end = source.indexOf("*/", i + 2);
      i = end === -1 ? source.length : end + 2;
      continue;
    }
    if (c === "{" || c === "[") depth++;
    else if (c === "}" || c === "]") depth--;
    i++;
  }
  if (depth !== 0) {
    errors.push(`${relPath}: unmatched braces in demos object literal`);
    return null;
  }
  const content = source.substring(startIdx, i - 1);

  // 2. Walk content collecting top-level keys.
  const keys = [];
  let scanDepth = 0;
  let scanInStr = null;
  let j = 0;
  let atStart = true;

  while (j < content.length) {
    const c = content[j];

    if (scanInStr) {
      if (c === "\\") { j += 2; continue; }
      if (c === scanInStr) scanInStr = null;
      j++; continue;
    }

    if (c === "/" && content[j + 1] === "/") {
      const nl = content.indexOf("\n", j);
      j = nl === -1 ? content.length : nl + 1;
      continue;
    }
    if (c === "/" && content[j + 1] === "*") {
      const end = content.indexOf("*/", j + 2);
      j = end === -1 ? content.length : end + 2;
      continue;
    }

    if (scanDepth === 0 && atStart) {
      if (/\s/.test(c)) { j++; continue; }
      const rest = content.substring(j);
      const m = rest.match(/^(?:"([^"]+)"|'([^']+)'|([a-zA-Z_$][\w$]*))\s*:/);
      if (m) {
        keys.push(m[1] ?? m[2] ?? m[3]);
        j += m[0].length;
        atStart = false;
        continue;
      }
    }

    if (c === '"' || c === "'" || c === "`") { scanInStr = c; j++; continue; }
    if (c === "{" || c === "[") scanDepth++;
    else if (c === "}" || c === "]") scanDepth--;
    else if (c === "," && scanDepth === 0) atStart = true;
    j++;
  }

  if (keys.length === 0) {
    errors.push(`${relPath}: demos export has no top-level keys — must have at least one (e.g. "default")`);
    return null;
  }
  return keys;
}
