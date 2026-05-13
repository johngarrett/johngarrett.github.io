#!/usr/bin/env bash
# Batch-convert HDR videos (typically iPhone Dolby Vision / HLG) to SDR
# BT.709 mp4 so they render correctly inline in browsers without HDR boost.
#
# Usage:
#   scripts/tonemap-hdr.sh content/trips/yosemite-may-2026/res/videos
#
# Produces a sibling `.sdr.mp4` for every .MOV/.mov/.mp4 found. Re-run is safe;
# files that already have a .sdr.mp4 are skipped.

set -euo pipefail

ROOT="${1:-.}"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found. Install with: brew install ffmpeg" >&2
  exit 1
fi

find "$ROOT" \
  \( -iname '*.mov' -o -iname '*.mp4' \) \
  ! -iname '*.sdr.mp4' \
  -print0 |
while IFS= read -r -d '' src; do
  dst="${src%.*}.sdr.mp4"

  if [[ -f "$dst" ]]; then
    echo "skip   $src (already converted)"
    continue
  fi

  # Detect HDR transfer characteristics; skip files that are already SDR.
  transfer="$(ffprobe -v error -select_streams v:0 \
    -show_entries stream=color_transfer -of csv=p=0 "$src" || true)"

  case "$transfer" in
    smpte2084|arib-std-b67|bt2020-10|bt2020-12)
      echo "tonemap $src  (transfer=$transfer)"
      ffmpeg -hide_banner -loglevel error -y -i "$src" \
        -vf "zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p" \
        -c:v libx264 -crf 20 -preset slow \
        -movflags +faststart \
        -c:a copy \
        "$dst"
      ;;
    *)
      echo "skip   $src (already SDR, transfer=$transfer)"
      ;;
  esac
done
