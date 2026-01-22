#!/usr/bin/env bash
set -e

# Check staged added files for HTML pages created outside /src/pages or /src/template
staged_files=$(git diff --cached --name-only --diff-filter=A)
if [ -z "$staged_files" ]; then
  exit 0
fi

bad=0
for f in $staged_files; do
  if [[ "$f" =~ ^src/.*\.html$ ]]; then
    if [[ ! "$f" =~ ^src/pages/ ]] && [[ ! "$f" =~ ^src/template/ ]]; then
      echo "ERROR: New page '$f' detected outside /src/pages or /src/template. Create content pages in /src/pages by default."
      bad=1
    fi
  fi
done

if [ $bad -eq 1 ]; then
  echo "\nCommit aborted. Move new pages to /src/pages or use templates in /src/template."
  exit 1
fi

exit 0
