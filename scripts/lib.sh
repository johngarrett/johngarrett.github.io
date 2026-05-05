#!/usr/bin/env bash
# Shared utilities for compress-*.sh scripts

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'
CHECK="${GREEN}✓${NC}"
CROSS="${RED}✗${NC}"

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
# Requires REPO_ROOT to be set by the caller.
file_group() {
  local rel="${1#"$REPO_ROOT/"}"
  echo "$rel" | awk -F/ '{
    if (NF <= 3) { for (i=1; i<NF; i++) printf "%s/", $i; print "" }
    else printf "%s/%s/%s/\n", $1, $2, $3
  }'
}

# Print a file entry, compressing it if needed.
# Usage: process_file <path> <compress_fn>
process_file() {
  local file="$1"
  local compress_fn="$2"
  local group
  group=$(file_group "$file")
  local rel="${file#"$REPO_ROOT/"}"
  local display="${rel#"$group"}"

  if [ "$group" != "$_last_group" ]; then
    [ "$_first" -eq 0 ] && echo ""
    printf "%s\n" "$group"
    _last_group="$group"
    _first=0
  fi

  if is_compressed "$file"; then
    local size_fmt
    size_fmt=$(format_size "$(wc -c < "$file")")
    printf "    ${CHECK} %-44s %s\n" "$display" "$size_fmt"
  else
    "$compress_fn" "$file" "$display"
  fi
}

# Call before the main loop to initialize grouping state.
init_loop() {
  _last_group=""
  _first=1
}
