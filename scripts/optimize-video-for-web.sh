#!/usr/bin/env bash
# Create a compact, broadly compatible MP4 for web delivery.
#
# Usage:
#   ./scripts/optimize-video-for-web.sh content/work/yvml-demo.mov
#   ./scripts/optimize-video-for-web.sh input.mov output.web.mp4

set -euo pipefail

if [[ $# -lt 1 || $# -gt 2 ]]; then
  echo "Usage: $0 INPUT_VIDEO [OUTPUT_MP4]" >&2
  exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Error: ffmpeg is required but was not found in PATH." >&2
  exit 1
fi

input=$1
if [[ ! -f "$input" ]]; then
  echo "Error: input video not found: $input" >&2
  exit 1
fi

if [[ $# -eq 2 ]]; then
  output=$2
else
  input_dir=$(dirname "$input")
  input_name=$(basename "$input")
  output="$input_dir/${input_name%.*}.web.mp4"
fi

if [[ "$input" -ef "$output" ]] 2>/dev/null; then
  echo "Error: output must be a different file from the input." >&2
  exit 1
fi

output_dir=$(dirname "$output")
output_name=$(basename "$output")
mkdir -p "$output_dir"
tmp=$(mktemp "$output_dir/.${output_name%.mp4}.XXXXXX.mp4")
trap 'rm -f "$tmp"' EXIT

# This profile is intended for portfolio/demo clips: clean UI text at typical
# display sizes while substantially reducing large screen recordings.
ffmpeg -hide_banner -y -i "$input" \
  -map 0:v:0 -map '0:a?' \
  -vf "fps=30,scale='min(1200,iw)':-2:flags=lanczos" \
  -c:v libx264 -preset medium -crf 28 -maxrate 3M -bufsize 6M \
  -pix_fmt yuv420p -movflags +faststart \
  -c:a aac -b:a 96k \
  "$tmp"

mv -f "$tmp" "$output"
trap - EXIT

echo "Created $output"
