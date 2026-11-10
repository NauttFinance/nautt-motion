#!/bin/sh
# Render a production in one or more languages and normalize loudness to -16 LUFS.
# Usage: pnpm render <production> [en pt es]
# Output: out/<production>/<production>-<lang>.mp4 (out/ is gitignored; publish finals as a GitHub Release)
set -e
cd "$(dirname "$0")/.."
prod=$1
[ -n "$prod" ] || { echo "usage: pnpm render <production> [en pt es]"; exit 1; }
shift
mkdir -p "out/$prod"
for lang in ${@:-en pt es}; do
  npx remotion render src/index.ts "$prod-$lang" "out/$prod/raw-$lang.mp4" --log=error
  ffmpeg -y -loglevel error -i "out/$prod/raw-$lang.mp4" -c:v copy -af loudnorm=I=-16:TP=-1.5:LRA=11 -c:a aac -b:a 192k "out/$prod/$prod-$lang.mp4"
  rm "out/$prod/raw-$lang.mp4"
  echo "$lang: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "out/$prod/$prod-$lang.mp4")s -> out/$prod/$prod-$lang.mp4"
done
