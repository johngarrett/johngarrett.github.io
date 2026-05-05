#!/usr/bin/env bash
set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'
CHECK="${GREEN}✓${NC}"
CROSS="${RED}✗${NC}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! command -v ffmpeg &>/dev/null || ! command -v ffprobe &>/dev/null; then
  echo "Error: ffmpeg and ffprobe are required but not found in PATH." >&2
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

get_duration_ms() {
  ffprobe -v error -select_streams v:0 \
    -show_entries stream=duration \
    -of default=noprint_wrappers=1:nokey=1 "$1" 2>/dev/null \
    | awk '{printf "%d", $1 * 1000}' || echo "0"
}

is_compressed() {
  local tag
  tag=$(ffprobe -v error \
    -show_entries format_tags=compressed \
    -of default=noprint_wrappers=1:nokey=1 "$1" 2>/dev/null || true)
  [ "$tag" = "1" ]
}

compress_video() {
  local input="$1"
  local name
  name=$(basename "$input")
  local ext="${input##*.}"
  local before
  before=$(wc -c < "$input")
  local before_fmt
  before_fmt=$(format_size "$before")

  local duration_ms
  duration_ms=$(get_duration_ms "$input")

  local tmp
  tmp=$(mktemp "/tmp/compress-video-XXXXXX.${ext}")
  local progress_file
  progress_file=$(mktemp "/tmp/compress-progress-XXXXXX")

  # Ensure cleanup on exit
  trap 'rm -f "$tmp" "$progress_file"' EXIT

  local start_time
  start_time=$(date +%s)

  ffmpeg -y -i "$input" \
    -c:v libx264 -crf 28 -preset slow \
    -c:a aac -b:a 128k \
    -movflags +faststart \
    -metadata compressed=1 \
    -progress "$progress_file" \
    -nostats -loglevel error \
    "$tmp" &
  local ffmpeg_pid=$!

  while kill -0 "$ffmpeg_pid" 2>/dev/null; do
    local current_ms=0
    if [ -s "$progress_file" ]; then
      current_ms=$(grep "^out_time_ms=" "$progress_file" | tail -1 | cut -d= -f2 || echo "0")
      # ffmpeg reports microseconds despite the "ms" name
      current_ms=$(awk -v v="$current_ms" 'BEGIN { printf "%d", v / 1000 }')
    fi

    local elapsed=$(( $(date +%s) - start_time ))
    local pct=0
    if [ "$duration_ms" -gt 0 ] 2>/dev/null; then
      pct=$(awk -v c="$current_ms" -v d="$duration_ms" \
        'BEGIN { v = int(c * 100 / d); if (v > 100) v = 100; print v }')
    fi

    printf "\r  %-40s %3d%% | %ds elapsed | %s -> ..." \
      "$name" "$pct" "$elapsed" "$before_fmt"
    sleep 0.5
  done

  wait "$ffmpeg_pid"
  local exit_code=$?

  rm -f "$progress_file"
  trap - EXIT

  if [ "$exit_code" -ne 0 ]; then
    rm -f "$tmp"
    printf "\r${CROSS} %-40s compression failed\n" "$name"
    return 1
  fi

  mv "$tmp" "$input"

  local after
  after=$(wc -c < "$input")
  local after_fmt
  after_fmt=$(format_size "$after")
  local elapsed=$(( $(date +%s) - start_time ))
  local pct_saved
  pct_saved=$(awk -v b="$before" -v a="$after" \
    'BEGIN { printf "%d", (b - a) * 100 / b }')

  printf "\r${CHECK} %-40s 100%% | %ds | %s -> %s (%d%% smaller)\n" \
    "$name" "$elapsed" "$before_fmt" "$after_fmt" "$pct_saved"
}

found=0
while IFS= read -r video; do
  found=1
  name=$(basename "$video")
  if is_compressed "$video"; then
    printf "${CHECK} %s\n" "$name"
  else
    compress_video "$video"
  fi
done < <(find "$REPO_ROOT/content" \
  \( -name "*.mp4" -o -name "*.MP4" -o -name "*.mov" -o -name "*.MOV" \) \
  -type f | sort)

if [ "$found" -eq 0 ]; then
  echo "No video files found in content/"
fi
