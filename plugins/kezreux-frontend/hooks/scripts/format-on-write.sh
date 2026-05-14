#!/usr/bin/env bash
# format-on-write.sh
# PostToolUse hook (Write|Edit|MultiEdit).
# Runs prettier --write and eslint --fix on the changed file when the host
# project has them. Silently no-ops when:
#   - the file isn't a frontend source type
#   - there's no package.json above it
#   - prettier/eslint aren't installed (we never auto-install)
# Always exits 0 — formatting is non-blocking.

set -uo pipefail

INPUT=$(cat)

# Extract the edited file path from the hook input JSON.
FILE_PATH=$(printf '%s' "$INPUT" | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('file_path', ''))
except Exception:
    pass
" 2>/dev/null || true)

[ -n "$FILE_PATH" ] || exit 0

# Only handle frontend source types.
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.css|*.scss|*.json|*.md|*.html|*.vue|*.svelte) ;;
  *) exit 0 ;;
esac

[ -f "$FILE_PATH" ] || exit 0

# Walk upward to the nearest package.json (= project root).
DIR=$(dirname "$FILE_PATH")
PROJECT_ROOT=""
while [ "$DIR" != "/" ] && [ "$DIR" != "." ]; do
  if [ -f "$DIR/package.json" ]; then
    PROJECT_ROOT="$DIR"
    break
  fi
  DIR=$(dirname "$DIR")
done

[ -n "$PROJECT_ROOT" ] || exit 0

cd "$PROJECT_ROOT"

# Prettier: prefer the locally-installed binary; fall back to npx --no-install.
if [ -x "node_modules/.bin/prettier" ]; then
  node_modules/.bin/prettier --write "$FILE_PATH" >/dev/null 2>&1 || true
elif command -v npx >/dev/null 2>&1; then
  npx --no-install prettier --write "$FILE_PATH" >/dev/null 2>&1 || true
fi

# ESLint: same pattern. --fix is best-effort; we never block on lint issues.
if [ -x "node_modules/.bin/eslint" ]; then
  node_modules/.bin/eslint --fix "$FILE_PATH" >/dev/null 2>&1 || true
elif command -v npx >/dev/null 2>&1; then
  npx --no-install eslint --fix "$FILE_PATH" >/dev/null 2>&1 || true
fi

exit 0
