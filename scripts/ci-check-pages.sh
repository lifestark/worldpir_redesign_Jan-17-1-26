#!/usr/bin/env bash
set -e

# CI check for newly added HTML pages outside /src/pages or /src/template
# Usage: run in GitHub Actions after checkout (fetch-depth: 0)

BASE_REF=${BASE_REF:-}
BEFORE=${BEFORE:-}
HEAD_SHA=${HEAD_SHA:-}

# Determine diff range
if [ -n "$BASE_REF" ] && [ "$BASE_REF" != "" ]; then
  git fetch origin "$BASE_REF" --depth=1 || true
  DIFF_RANGE="origin/$BASE_REF...HEAD"
elif [ -n "$BEFORE" ] && [ -n "$HEAD_SHA" ]; then
  DIFF_RANGE="$BEFORE...$HEAD_SHA"
else
  DIFF_RANGE="HEAD"
fi

added=$(git diff --name-only --diff-filter=A $DIFF_RANGE || true)

bad=0
for f in $added; do
  if [[ "$f" =~ ^src/.*\.html$ ]] && [[ ! "$f" =~ ^src/pages/ ]] && [[ ! "$f" =~ ^src/template/ ]]; then
    echo "::error file=$f::New page '$f' created outside /src/pages. Place content pages in /src/pages by default."
    bad=1
  fi
done

if [ $bad -eq 1 ]; then
  echo "CI check failed: pages should be created under /src/pages or /src/template."
  exit 1
fi

exit 0
