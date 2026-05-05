#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! command -v bunx &>/dev/null; then
  echo "Error: bun is required but not found in PATH." >&2
  exit 1
fi

cd "$REPO_ROOT"
bunx cspell --config cspell.json --no-progress "content/**/*.md" readme.md
