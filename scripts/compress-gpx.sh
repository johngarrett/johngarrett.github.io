#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck source=lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

if ! command -v gpsbabel &>/dev/null; then
  echo "Error: gpsbabel is required but not found in PATH." >&2
  exit 1
fi

compress_gpx() {
  local input="$1"
  local name="$2"
  local before
  before=$(wc -c < "$input")
  local before_fmt
  before_fmt=$(format_size "$before")

  local tmp
  tmp=$(mktemp "${TMPDIR:-/tmp}/gpx.XXXXXX.gpx")
  trap 'rm -f "$tmp"' EXIT

  local start_time
  start_time=$(date +%s)

  printf "    %-44s compressing ..." "$name"

  local failed=0
  gpsbabel -i gpx -f "$input" -x simplify,count=1000 -o gpx -F "$tmp" 2>/dev/null || failed=1

  trap - EXIT

  if [ "$failed" -eq 1 ]; then
    rm -f "$tmp"
    printf "\r    ${CROSS} %-44s compression failed\n" "$name"
    return 1
  fi

  local after
  after=$(wc -c < "$tmp")
  local elapsed=$(( $(date +%s) - start_time ))

  if [ "$after" -ge "$before" ]; then
    rm -f "$tmp"
    touch "$(marker_file "$input")"
    printf "\r    ${CHECK} %-44s %ds | %s (already optimal)\n" \
      "$name" "$elapsed" "$before_fmt"
    return 0
  fi

  mv "$tmp" "$input"
  touch "$(marker_file "$input")"

  local after_fmt
  after_fmt=$(format_size "$after")
  local pct_saved
  pct_saved=$(awk -v b="$before" -v a="$after" \
    'BEGIN { printf "%d", (b - a) * 100 / b }')

  printf "\r    ${CHECK} %-44s %ds | %s -> %s (%d%% smaller)\n" \
    "$name" "$elapsed" "$before_fmt" "$after_fmt" "$pct_saved"
}

found=0
init_loop
while IFS= read -r gpx; do
  found=1
  process_file "$gpx" compress_gpx
done < <(find "$REPO_ROOT/content" -name "*.gpx" -type f | sort)

if [ "$found" -eq 0 ]; then
  echo "No GPX files found in content/"
fi
