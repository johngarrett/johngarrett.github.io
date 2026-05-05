#!/usr/bin/env bash
set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'
CHECK="${GREEN}✓${NC}"
CROSS="${RED}✗${NC}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! command -v convert &>/dev/null || ! command -v identify &>/dev/null; then
  echo "Error: ImageMagick (convert, identify) is required but not found in PATH." >&2
  exit 1
fi

format_size() {
  local bytes=$1
  awk -v b="$bytes" 'BEGIN {
    if (b >= 1073741824) printf "%.1f GB", b/1073741824
    else if (b >= 1048576) printf "%.1f MB", b/1048576
    else printf "%.1f KB", b/1024
  }'
}

marker_file() {
  local dir
  dir=$(dirname "$1")
  echo "$dir/.$(basename "$1").compressed"
}

is_compressed() {
  [ -f "$(marker_file "$1")" ]
}

# Group: content/type/ for shallow files, content/type/name/ for deeper ones
file_group() {
  local rel="${1#"$REPO_ROOT/"}"
  echo "$rel" | awk -F/ '{
    if (NF <= 3) { for (i=1; i<NF; i++) printf "%s/", $i; print "" }
    else printf "%s/%s/%s/\n", $1, $2, $3
  }'
}

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
last_group=""
first=1
while IFS= read -r photo; do
  found=1
  group=$(file_group "$photo")
  rel="${photo#"$REPO_ROOT/"}"
  display="${rel#"$group"}"

  if [ "$group" != "$last_group" ]; then
    [ "$first" -eq 0 ] && echo ""
    printf "%s\n" "$group"
    last_group="$group"
    first=0
  fi

  if is_compressed "$photo"; then
    size_fmt=$(format_size "$(wc -c < "$photo")")
    printf "    ${CHECK} %-44s %s\n" "$display" "$size_fmt"
  else
    compress_photo "$photo" "$display"
  fi
done < <(find "$REPO_ROOT/content" \
  \( -name "*.jpg"  -o -name "*.JPG" \
     -o -name "*.jpeg" -o -name "*.JPEG" \
     -o -name "*.png"  -o -name "*.PNG" \
     -o -name "*.heic" -o -name "*.HEIC" \) \
  -type f | sort)

if [ "$found" -eq 0 ]; then
  echo "No photo files found in content/"
fi
