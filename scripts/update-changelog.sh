#!/usr/bin/env bash
set -euo pipefail

# Update md/CHANGELOG.md with information about the last commit.
# If the last commit is already recorded (by hash), do nothing.

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

CHANGELOG="md/CHANGELOG.md"

LAST_HASH=$(git rev-parse --short HEAD)

if grep -q "$LAST_HASH" "$CHANGELOG" 2>/dev/null; then
  exit 0
fi

LAST_MSG=$(git log -1 --pretty=%B)
LAST_AUTHOR=$(git log -1 --pretty='%an')
LAST_DATE=$(git log -1 --pretty='%ad' --date=iso)
FILES_CHANGED=$(git show --name-only --pretty="" HEAD | sed '/^$/d' | tr '\n' ', ' | sed 's/, $//')

TMP_FILE=$(mktemp)
{
  echo "## $LAST_DATE"
  echo
  echo "- Commit: $LAST_HASH"
  echo "- Автор: $LAST_AUTHOR"
  echo "- Сообщение: $LAST_MSG"
  echo "- Изменённые файлы: $FILES_CHANGED"
  echo
  cat "$CHANGELOG"
} > "$TMP_FILE"

mv "$TMP_FILE" "$CHANGELOG"

git add "$CHANGELOG"
git commit -m "chore(changelog): update for $LAST_HASH" --no-verify || true
