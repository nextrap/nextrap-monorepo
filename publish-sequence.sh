#!/usr/bin/env bash
# Pusht die bereits erzeugten Release-Tags des aktuellen Commits manuell
# in Dreiergruppen. Aufruf: ./publish-sequence.sh [--dry-run] [remote]
# Build, Nx-Versionierung/Changelog und lokale Release-Tags müssen zuvor im
# Build-Container vorbereitet sein. Der Release-Stand muss bereits committed und
# lokal getaggt sein. Dieses Script benötigt weder Node.js noch Nx und erzeugt keine Tags.
# Nur Tags auf HEAD werden berücksichtigt: ältere Releases gehören nicht zum
# ausgewählten Commit. Bereits identisch gepushte Tags werden übersprungen.
# Jeder Tag startet .github/workflows/publish-tags.yml; npm publiziert dort.
set -euo pipefail

# Der Pfad des Scripts bestimmt das Repository, unabhängig vom Aufrufverzeichnis.
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
usage() {
  printf '%s\n' 'Aufruf: ./publish-sequence.sh [--dry-run] [remote]' \
    'Standard-Remote: origin. 3 einzelne Tag-Pushes parallel; kein Build.' \
    'Zwischen Gruppen: 60 Sekunden Pause; kein Warten auf fertige GitHub-Actions.' \
    'Nur vorhandene Release-Tags (*@*.*.*) auf HEAD; keine Versionierung.' \
    '--dry-run zeigt den Plan ohne Push oder Wartezeit.'
}
fail() { printf 'Fehler: %s\n' "$*" >&2; exit 1; }

# Eine Vorschau erlaubt die Kontrolle der konkreten Release-Tags vor dem Start.
dry_run=false
remote=origin
if [[ ${1:-} == --help || ${1:-} == -h ]]; then usage; exit 0; fi
if [[ ${1:-} == --dry-run ]]; then dry_run=true; shift; fi
if (( $# > 1 )); then usage >&2; exit 2; fi
if (( $# == 1 )); then remote=$1; fi
[[ $remote != -* ]] || fail 'Remote muss ein eingerichteter Git-Remote-Name sein.'
git remote get-url "$remote" >/dev/null
release_commit=$(git rev-parse HEAD)

# Namen und Objekt-IDs werden vor den Pushes eingefroren. So kann ein währenddessen
# verschobener lokaler Tag nicht unbemerkt einen anderen Release veröffentlichen.
local_tags=$(git for-each-ref --points-at "$release_commit" --sort=refname \
  --format='%(objectname) %(refname:strip=2)' refs/tags)
remote_tags=$(git ls-remote --refs "$remote" 'refs/tags/*')
tags=()
objects=()
while read -r object tag; do
  [[ -n $tag && $tag == *@*.*.* ]] || continue
  remote_object=$(awk -v ref="refs/tags/$tag" '$2 == ref { print $1 }' <<< "$remote_tags")
  if [[ -n $remote_object ]]; then
    [[ $remote_object == "$object" ]] || fail "Remote-Tag $tag weicht ab; wird nicht überschrieben."
    printf 'Bereits gepusht: %s\n' "$tag"
    continue
  fi
  tags+=("$tag")
  objects+=("$object")
done <<< "$local_tags"
count=${#tags[@]}
if (( count == 0 )); then
  printf '%s\n' 'Keine ausstehenden Release-Tags auf HEAD. Kein Push nötig.'
  exit 0
fi
printf 'Release-Commit: %s; ausstehende Tags: %s\n' "$release_commit" "$count"
printf '  %s\n' "${tags[@]}"
if $dry_run; then
  printf '%s\n' 'Plan: vorhandene Tags in Dreiergruppen mit jeweils 60 Sekunden Abstand pushen.'
  exit 0
fi

# Einzelne explizite Ref-Pushes vermeiden GitHubs Grenze bei mehr als drei Tags
# pro Push-Event. --no-follow-tags verhindert zusätzliche implizite Tag-Pushes.
# https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#push
for ((start=0; start<count; start+=3)); do
  pids=()
  for ((i=start; i<count && i<start+3; i++)); do
    printf 'Push: %s\n' "${tags[i]}"
    git -c push.followTags=false push --no-follow-tags "$remote" \
      "${objects[i]}:refs/tags/${tags[i]}" &
    pids+=("$!")
  done
  # Alle gestarteten Pushes abwarten, auch wenn einer fehlschlägt. Bei einem
  # Fehler keine weitere Gruppe starten; erneuter Aufruf überspringt Erfolge.
  failed=false
  for pid in "${pids[@]}"; do
    if ! wait "$pid"; then failed=true; fi
  done
  if $failed; then fail 'Mindestens ein Tag-Push fehlgeschlagen; keine weitere Gruppe gestartet.'; fi
  if (( start+3 < count )); then
    printf '%s\n' 'Gruppe gepusht; warte 60 Sekunden vor der nächsten Gruppe.'
    sleep 60
  fi
done
printf '%s\n' 'Alle ausstehenden Tags gepusht. Den npm-Publish-Status in GitHub Actions prüfen.'
