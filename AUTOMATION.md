# Automation: catalog regeneration + website wiki updates

This repo includes a GitHub Action (`.github/workflows/build-catalog.yml`)
that runs on every push to `main` that touches a component or the
generator script. It does three things:

1. Regenerates `plugins/kezreux-frontend/components/catalog.json`.
2. Commits the regenerated catalog if it changed (skipping if unchanged).
3. POSTs to your website's deploy hook so the wiki rebuilds.

After the one-time setup below, **the entire flow is hands-off**: edit a
component on `main` → push → catalog updates → wiki redeploys with the
new content.

## One-time setup

### 1. Create a deploy hook on your hosting provider

A "deploy hook" is a webhook URL that triggers a fresh deploy when called.
Every modern static-hosting provider has them.

**Cloudflare Pages** (the recommended path for this project):
1. Cloudflare dashboard → Workers & Pages → your project.
2. **Settings** → **Builds & deployments** → **Deploy hooks** section.
3. **Add deploy hook**. Name it `plugin-catalog-update`, target the
   production branch (usually `main`).
4. Copy the URL Cloudflare gives you. It looks like:
   `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/<uuid>`

If your wiki sits behind Cloudflare Access (auth-gated public URL), the
deploy hook itself is unaffected — it's an API endpoint, not a page view.
You can keep the deployed site behind Access and the automation still
fires correctly.

**Vercel:**
1. Open your website project in the Vercel dashboard.
2. Settings → Git → Deploy Hooks.
3. Click **Create Hook**. Name it `plugin-catalog-update`, target the
   `main` branch.
4. URL looks like: `https://api.vercel.com/v1/integrations/deploy/prj_abc.../xyz`.

**Netlify:**
1. Open your site in the Netlify dashboard.
2. Site configuration → Build & deploy → Build hooks.
3. Add build hook, name `plugin-catalog-update`, branch `main`.
4. URL: `https://api.netlify.com/build_hooks/<hash>`.

**Render, Railway, self-hosted with a build server:** same pattern —
provider's settings → deploy hook / build hook → create → copy URL.

### 2. Store the hook URL as a repo secret

In the plugin repo (`Kezreux/frontend-tools-marketplace`):

1. Settings → Secrets and variables → Actions.
2. **New repository secret**:
   - Name: `WEBSITE_DEPLOY_HOOK`
   - Value: paste the URL from step 1
3. Save.

That's the only secret needed. The Action's `GITHUB_TOKEN` (auto-provided
by GitHub) handles the catalog commit.

### 3. Make your website read the catalog at build time

The catalog is just a JSON file served by GitHub. Your website fetches it
during its build and bakes the data into the static output. The deploy
hook triggers that build.

**Next.js (App Router):**

```ts
// app/lib/catalog.ts
const CATALOG_URL =
  "https://raw.githubusercontent.com/Kezreux/frontend-tools-marketplace/main/plugins/kezreux-frontend/components/catalog.json";

export interface CatalogComponent {
  name: string;
  category: string;
  description: string;
  keywords: string[];
  complexity: "simple" | "medium" | "complex";
  filePath: string;
  sourceUrl: string;
  lines: number;
  demos: string[];
}

export interface Catalog {
  version: string;
  generatedAt: string;
  categories: { id: string; label: string; count: number }[];
  components: CatalogComponent[];
}

export async function getCatalog(): Promise<Catalog> {
  // `no-store` ensures the build always fetches fresh; or use ISR with
  // `revalidate: 0` for on-demand refetching at the edge.
  const res = await fetch(CATALOG_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Catalog fetch failed: ${res.status}`);
  return res.json();
}
```

Then in a page:

```tsx
// app/components/page.tsx
import { getCatalog } from "@/lib/catalog";

export default async function ComponentsPage() {
  const { components, categories } = await getCatalog();
  return (
    <div>
      {categories.map((c) => (
        <section key={c.id}>
          <h2>{c.label} ({c.count})</h2>
          <ul>
            {components.filter((x) => x.category === c.id).map((x) => (
              <li key={x.name}>
                <strong>{x.name}</strong> — {x.description}
                <br />
                <small>demos: {x.demos.join(", ")}</small>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
```

**Astro:**

```astro
---
const catalog = await fetch(
  "https://raw.githubusercontent.com/Kezreux/frontend-tools-marketplace/main/plugins/kezreux-frontend/components/catalog.json"
).then((r) => r.json());
---
{catalog.components.map((c) => <p>{c.name} — {c.description}</p>)}
```

**Vite / plain React (CSR):**

Fetch inside a `useEffect` at app startup, or pre-fetch at build time via
a `vite.config.ts` plugin that bakes the JSON into a generated TS module.
Easiest for static sites: switch to one of the SSG frameworks above.

### 4. Render live previews

For each component, the catalog tells you `demos: ["default"]` (or
`["signed in", "signed out"]` etc.) but **not** the actual prop values —
those live in the component's `demos` export. To render live previews,
your website needs the component module itself, not just the catalog.

Two ways to give the website access:

**Git submodule** (simplest):

```bash
# In the website repo
git submodule add https://github.com/Kezreux/frontend-tools-marketplace plugin
git config -f .gitmodules submodule.plugin.branch main
```

Then import from the submodule path:

```tsx
import { TopNavWithAuth, demos as authDemos } from "../plugin/plugins/kezreux-frontend/components/navbar/TopNavWithAuth";

{Object.entries(authDemos).map(([label, props]) => (
  <figure key={label}>
    <TopNavWithAuth {...props} />
    <figcaption>{label}</figcaption>
  </figure>
))}
```

The submodule's pin stays at the latest commit on `main` once the website
runs `git submodule update --remote` during its build (most CI setups
support this with a flag in the checkout step).

**Bundled copy** (alternative):

Copy the `plugins/kezreux-frontend/components/` directory into your
website repo as a build step. Pros: tighter dependency on a known
revision. Cons: needs a manual sync mechanism.

## How the flow runs end to end

```
You commit a component change to main
   │
   ▼
Push triggers .github/workflows/build-catalog.yml
   │
   ├── node build-catalog.mjs  →  catalog.json updated
   │
   ├── git commit + push catalog.json (if changed)
   │
   └── curl -X POST $WEBSITE_DEPLOY_HOOK
          │
          ▼
Vercel/Netlify rebuilds the website
   │
   └── Website's build fetches catalog.json
       Website renders the gallery with the new data
   │
   ▼
Live at https://your-wiki.example.com
```

## Architecture note: wiki on Cloudflare Pages + backend on your own server

The automation in this file only cares about *the wiki redeploying*. If
your stack is:

- **Wiki frontend** on Cloudflare Pages (static, builds from a Git repo)
- **Backend API** on your own server (handles auth, premium content,
  Stripe, etc.)

then this file's contents covers the wiki side completely. The backend
runs independently — your wiki can call it for authenticated features
(account, premium component fetches, payment flows), but the catalog
itself stays public (just JSON on GitHub) so the wiki's free tier renders
without backend availability concerns.

If you later split the backend into per-service VMs, none of this
changes. The wiki keeps pointing at the public catalog URL; the backend
moves around as needed.

## Verifying it works

After completing the setup above, push any change touching a component
file. Within 1–2 minutes:

1. Open `https://github.com/Kezreux/frontend-tools-marketplace/actions` —
   the workflow should be running or just completed.
2. Check the Action log for the `Notify website to redeploy` step — it
   should say `✓ Notified website to redeploy.`
3. Open your hosting provider's deploys list — a new deploy should be
   in progress.

If the notify step says `WEBSITE_DEPLOY_HOOK secret not set — skipping
notify`, you skipped step 2 above.

## Manual trigger

To force a regen + redeploy without changing a component (e.g., after
editing the generator script): GitHub → Actions → "Build catalog +
notify website" → **Run workflow**.

## What runs locally vs. in CI

| Action | Local | CI |
| --- | --- | --- |
| `npm run build:catalog` | Yes — for testing | Yes — on every relevant push |
| Commit `catalog.json` | Optional — CI will fix if you forget | Always (if changed) |
| Trigger website redeploy | No — only CI does this | Yes — on every workflow run |

So you can keep working locally without running the script; CI will
catch up. The local script is still useful for verifying changes before
pushing.
