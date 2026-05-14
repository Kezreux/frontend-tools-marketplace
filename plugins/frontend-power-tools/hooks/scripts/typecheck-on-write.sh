#!/usr/bin/env bash
# typecheck-on-write.sh
# PostToolUse hook (Write|Edit|MultiEdit).
# Runs `tsc --noEmit` on the host project when a .ts/.tsx file is edited.
# Surfaces only the errors that mention the edited file back to Claude
# (exit 2 + stderr) so the model can self-correct.
# Silently no-ops when:
#   - the file isn't TypeScript
#   - the project has no tsconfig.json
#   - tsc isn't installed
#   - the typecheck times out (30s budget)

set -uo pipefail

INPUT=$(cat)

FILE_PATH=$(printf '%s' "$INPUT" | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('file_path', ''))
except Exception:
    pass
" 2>/dev/null || true)

[ -n "$FILE_PATH" ] || exit 0

# TypeScript only.
case "$FILE_PATH" in
  *.ts|*.tsx) ;;
  *) exit 0 ;;
esac

[ -f "$FILE_PATH" ] || exit 0

# Walk to the nearest dir that has BOTH package.json and tsconfig.json.
DIR=$(dirname "$FILE_PATH")
PROJECT_ROOT=""
while [ "$DIR" != "/" ] && [ "$DIR" != "." ]; do
  if [ -f "$DIR/package.json" ] && [ -f "$DIR/tsconfig.json" ]; then
    PROJECT_ROOT="$DIR"
    break
  fi
  DIR=$(dirname "$DIR")
done

[ -n "$PROJECT_ROOT" ] || exit 0

cd "$PROJECT_ROOT"

# Resolve a tsc binary. Local install wins.
TSC_CMD=""
if [ -x "node_modules/.bin/tsc" ]; then
  TSC_CMD="node_modules/.bin/tsc"
elif command -v npx >/dev/null 2>&1; then
  if npx --no-install tsc --version >/dev/null 2>&1; then
    TSC_CMD="npx --no-install tsc"
  fi
fi

[ -n "$TSC_CMD" ] || exit 0

# Run with a 30s budget. --incremental reuses tsBuildInfoFile across runs.
TSC_OUTPUT=$(timeout 30 $TSC_CMD --noEmit --pretty false --incremental 2>&1)
TSC_EXIT=$?

# Timeout (124) or signal-killed (>128) → skip silently rather than nag.
if [ "$TSC_EXIT" -eq 124 ] || [ "$TSC_EXIT" -gt 128 ]; then
  exit 0
fi

# Compute the edited file path relative to the project root.
REL_PATH=$(python3 -c "
import os, sys
print(os.path.relpath('$FILE_PATH', '$PROJECT_ROOT'))
" 2>/dev/null || echo "$FILE_PATH")

# Filter tsc's full output to lines that mention the file we just touched.
ERRORS=$(printf '%s\n' "$TSC_OUTPUT" | grep -F "$REL_PATH" || true)

# Nothing about our file → clean exit even if other files have errors.
[ -n "$ERRORS" ] || exit 0

# Surface to Claude via stderr + exit 2 (PostToolUse "feedback to agent").
{
  echo "tsc reported errors in $REL_PATH after edit:"
  printf '%s\n' "$ERRORS"
} >&2
exit 2
