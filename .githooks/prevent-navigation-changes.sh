#!/usr/bin/env bash
# Prevent committing changes to the main navigation file
CHANGED_FILES=$(git diff --cached --name-only)
PROTECTED="src/js/components/navigation.js"

echo "Checking for protected file changes..."
if echo "$CHANGED_FILES" | grep -qE "^${PROTECTED}$"; then
  echo "\nERROR: Changes to ${PROTECTED} are not allowed."
  echo "If you need to modify it, please coordinate with the team and temporarily disable this hook."
  exit 1
fi

exit 0
