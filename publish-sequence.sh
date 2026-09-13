#!/usr/bin/env bash
# Vorhandene Release-Tags auf HEAD einzeln pushen, dazwischen 60 Sekunden warten.
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
tags=$(git tag --points-at HEAD --list '*@*.*.*')
wait_before_push=false

for tag in $tags; do
  if $wait_before_push; then
    sleep 60
  fi
  git push --no-follow-tags origin "refs/tags/$tag"
  wait_before_push=true
done
