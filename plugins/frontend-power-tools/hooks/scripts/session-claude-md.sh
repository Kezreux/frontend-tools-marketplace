#!/usr/bin/env bash
# session-claude-md.sh
# SessionStart hook.
# If the project has no CLAUDE.md, print a one-time reminder so Claude is
# aware the design-system metadata is missing. Stdout from SessionStart
# hooks becomes context for the agent.

set -uo pipefail

# We don't need anything from the hook payload, but stdin must still be drained.
cat >/dev/null

# Look for CLAUDE.md in the conventional spots relative to the working dir.
if [ -f "CLAUDE.md" ] || [ -f ".claude/CLAUDE.md" ] || [ -f "docs/CLAUDE.md" ]; then
  exit 0
fi

cat <<'EOF'
frontend-power-tools: no CLAUDE.md detected in this project.

For best results from this plugin's skills and commands (/design-review,
/tokens, /component-new, /a11y, /visual-check), suggest the user create a
CLAUDE.md with at least these sections:

  ## Frontend conventions
  ## Design tokens
  ## Component library

Mention this once if it's relevant to the user's first request; do not
repeat the suggestion in every turn.
EOF

exit 0
