#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck source=lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

if ! command -v convert &>/dev/null || ! command -v identify &>/dev/null; then
  echo "Error: ImageMagick (convert, identify) is required but not found in PATH." >&2
  exit 1
fi

compress_photo() {
  local input="$1"
  local name="$2"
  local ext="${input##*.}"
  local ext_lower
  ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
  local before
  before=$(wc -c < "$input")
  local before_fmt
  before_fmt=$(format_size "$before")

  local tmp
  tmp=$(mktemp "/tmp/compress-photo-XXXXXX.$ext")

  trap 'rm -f "$tmp"' EXIT

  local start_time
  start_time=$(date +%s)

  printf "    %-44s compressing ..." "$name"

  local failed=0
  case "$ext_lower" in
    jpg|jpeg)
      convert "$input" -strip -quality 82 \
        -sampling-factor 4:2:0 -interlace JPEG "$tmp" 2>/dev/null || failed=1
      ;;
    png)
      convert "$input" -strip -define png:compression-level=9 \
        "$tmp" 2>/dev/null || failed=1
      ;;
    heic)
      convert "$input" -strip -quality 82 "$tmp" 2>/dev/null || failed=1
      ;;
  esac

  trap - EXIT

  if [ "$failed" -eq 1 ]; then
    rm -f "$tmp"
    printf "\r    ${CROSS} %-44s compression failed\n" "$name"
    return 1
  fi

  local after
  after=$(wc -c < "$tmp")

  if [ "$after" -ge "$before" ]; then
    rm -f "$tmp"
    touch "$(marker_file "$input")"
    local elapsed=$(( $(date +%s) - start_time ))
    printf "\r    ${CHECK} %-44s %ds | %s (already optimal)\n" \
      "$name" "$elapsed" "$before_fmt"
    return 0
  fi

  mv "$tmp" "$input"
  touch "$(marker_file "$input")"

  local after_fmt
  after_fmt=$(format_size "$after")
  local elapsed=$(( $(date +%s) - start_time ))
  local pct_saved
  pct_saved=$(awk -v b="$before" -v a="$after" \
    'BEGIN { printf "%d", (b - a) * 100 / b }')

  printf "\r    ${CHECK} %-44s %ds | %s -> %s (%d%% smaller)\n" \
    "$name" "$elapsed" "$before_fmt" "$after_fmt" "$pct_saved"
}

found=0
init_loop
while IFS= read -r photo; do
  found=1
  process_file "$photo" compress_photo
done < <(find "$REPO_ROOT/content" \
  \( -name "*.jpg"  -o -name "*.JPG" \
     -o -name "*.jpeg" -o -name "*.JPEG" \
     -o -name "*.png"  -o -name "*.PNG" \
     -o -name "*.heic" -o -name "*.HEIC" \) \
  -type f | sort)

if [ "$found" -eq 0 ]; then
  echo "No photo files found in content/"
fi
