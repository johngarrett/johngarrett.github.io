#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

find "$REPO_ROOT/content" -name "*.gpx" | while IFS= read -r gpx; do
  before=$(wc -c < "$gpx")
  tmp=$(mktemp --suffix=.gpx)
  gpsbabel -i gpx -f "$gpx" -x simplify,count=1000 -o gpx -F "$tmp"
  mv "$tmp" "$gpx"
  after=$(wc -c < "$gpx")
  printf "%s: %d KB -> %d KB\n" "$(basename "$gpx")" "$((before / 1024))" "$((after / 1024))"
done

echo "Done."
