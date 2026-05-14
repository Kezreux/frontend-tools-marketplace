#!/usr/bin/env bash
# design-lint-on-write.sh
# PostToolUse hook (Write|Edit|MultiEdit) on UI markup files.
# Cheap, deterministic scan for design-token violations:
#   - Hardcoded hex / rgb() / hsl() colors
#   - Tailwind arbitrary px values for spacing/dimensions
#   - Literal bg-white / bg-black / text-white / text-black (dark-mode breakers)
#   - Magic z-index values
#   - Static inline styles with literal color/dimension values
#
# No LLM — pure grep. Heavy LLM-driven checks (design-review, a11y) belong
# off the hook path inside /build, /design-review, /a11y.
#
# If violations are found: exit 2 with stderr → Claude self-corrects in turn.
# No violations: exit 0 silently.

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

# UI markup files only — .css is excluded because token files legitimately
# contain hex / hsl values
case "$FILE_PATH" in
  *.tsx|*.jsx|*.vue|*.svelte) ;;
  *) exit 0 ;;
esac

[ -f "$FILE_PATH" ] || exit 0

# Skip the project's own theme/token files (they legitimately define colors)
case "$FILE_PATH" in
  */styles/theme.ts*|*/styles/tokens.*|*/src/tokens.*|*/src/styles/tokens.*) exit 0 ;;
esac

FINDINGS=""

# Helper: strip comment-only lines from a grep output (best-effort —
# matches lines whose content portion starts with // or *).
strip_comments() {
  grep -vE ':[[:space:]]*(\/\/|\*)' || true
}

# 1. Hardcoded hex colors (4–8 hex chars after a #)
HEX_HITS=$(grep -nE '#[0-9a-fA-F]{3,8}\b' "$FILE_PATH" 2>/dev/null | strip_comments | head -20)
if [ -n "$HEX_HITS" ]; then
  FINDINGS+="
Hardcoded hex colors (use semantic tokens like bg-background, text-foreground):
$HEX_HITS"
fi

# 2. rgb/rgba/hsl/hsla literal numeric values
RGB_HITS=$(grep -nE '(rgb|hsl)a?\(\s*[0-9]' "$FILE_PATH" 2>/dev/null | strip_comments | head -20)
if [ -n "$RGB_HITS" ]; then
  FINDINGS+="
Literal rgb()/hsl() values (use theme tokens):
$RGB_HITS"
fi

# 3. Tailwind arbitrary px values for spacing/dimensions
PX_HITS=$(grep -nE '\b(p|m|gap|w|h|top|right|bottom|left|inset)-\[[0-9]+px\]' "$FILE_PATH" 2>/dev/null | strip_comments | head -20)
if [ -n "$PX_HITS" ]; then
  FINDINGS+="
Raw px outside the spacing scale (use Tailwind's spacing scale or a token):
$PX_HITS"
fi

# 4. Literal color classes that bypass dark mode
LITERAL_HITS=$(grep -nE '\b(bg|text|border|fill|stroke)-(white|black)\b' "$FILE_PATH" 2>/dev/null | strip_comments | head -20)
if [ -n "$LITERAL_HITS" ]; then
  FINDINGS+="
Literal color classes (break dark mode — use semantic tokens):
$LITERAL_HITS"
fi

# 5. Tailwind arbitrary z-index (no documented scale yet)
ZIDX_HITS=$(grep -nE '\bz-\[[0-9]+\]' "$FILE_PATH" 2>/dev/null | strip_comments | head -20)
if [ -n "$ZIDX_HITS" ]; then
  FINDINGS+="
Magic z-index (document a z-layer scale in CLAUDE.md):
$ZIDX_HITS"
fi

# 6. Inline style attribute with a literal color/dimension value
INLINE_HITS=$(grep -nE 'style=\{\{[^}]*(color|background|width|height|padding|margin)[^}]*:[^}]*"[#0-9]' "$FILE_PATH" 2>/dev/null | strip_comments | head -20)
if [ -n "$INLINE_HITS" ]; then
  FINDINGS+="
Static inline styles with literal values (move to a className using theme tokens):
$INLINE_HITS"
fi

# No violations → silent pass
[ -n "$FINDINGS" ] || exit 0

REL_PATH=$(python3 -c "import os,sys; print(os.path.relpath('$FILE_PATH'))" 2>/dev/null || echo "$FILE_PATH")

{
  echo "design-lint: token violations in $REL_PATH"
  printf '%s\n' "$FINDINGS"
  echo ""
  echo "See \${CLAUDE_PLUGIN_ROOT}/rules/RULES.md §6 (Design tokens) for the rules. Use the active theme's semantic tokens instead."
} >&2
exit 2
