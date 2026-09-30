#!/usr/bin/env bash
# Convert one or more images to compact WebP files for web delivery.
#
# Usage:
#   ./scripts/convert-images-to-webp.sh content/work/photo.jpg
#   ./scripts/convert-images-to-webp.sh content/work/*.png
#
# Each output is written beside its input with a .webp extension. Images are
# never enlarged; dimensions are capped at 2000 px and metadata is removed.

set -euo pipefail

if [[ $# -eq 0 ]]; then
  echo "Usage: $0 IMAGE [IMAGE ...]" >&2
  exit 1
fi

if ! command -v magick >/dev/null 2>&1; then
  echo "Error: ImageMagick (magick) is required but was not found in PATH." >&2
  exit 1
fi

for input in "$@"; do
  if [[ ! -f "$input" ]]; then
    echo "Error: image not found: $input" >&2
    exit 1
  fi

  output="${input%.*}.webp"
  output_dir=$(dirname "$output")
  output_name=$(basename "$output")
  tmp=$(mktemp "$output_dir/.${output_name%.webp}.XXXXXX.webp")

  # -auto-orient respects camera orientation; the trailing > prevents upscaling.
  magick "$input" -auto-orient -resize '2000x2000>' -strip \
    -quality 82 -define webp:method=6 -define webp:alpha-quality=90 \
    "$tmp"
  mv -f "$tmp" "$output"

  echo "Created $output"
done
