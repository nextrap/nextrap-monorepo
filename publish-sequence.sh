#!/usr/bin/env bash
# Vorhandene Release-Tags auf HEAD in Dreiergruppen pushen; Enter startet die nächste.
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
tag_list=$(git tag --points-at HEAD --list '*@*.*.*')
# Git-Tag-Namen enthalten keine Leerzeichen; die Liste wird zum Array.
tags=($tag_list)

for ((i=0; i<${#tags[@]}; i++)); do
  git push --no-follow-tags origin "refs/tags/${tags[i]}"
  if (( (i+1)%3 == 0 && i+1 < ${#tags[@]} )); then
    read -r -p 'Drei Tags gepusht. Weiter mit Enter (Abbruch: Strg+C): '
  fi
done
