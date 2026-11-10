#!/bin/sh
# Per-line delivery stats (chars/sec, loudness) to spot tone drift between lines.
# Usage: pnpm vo:stats <production> <en|pt|es>
set -e
cd "$(dirname "$0")/.."
prod=$1; lang=$2
[ -n "$prod" ] && [ -n "$lang" ] || { echo "usage: pnpm vo:stats <production> <en|pt|es>"; exit 1; }
json=productions/$prod/vo/$lang.json
n=$(node -e "console.log(require('./$json').durations.length)")
i=1
while [ "$i" -le "$n" ]; do
  f=public/$prod/vo/$lang/vo$i.mp3
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  chars=$(node -e "console.log(require('./$json').alignment[$i-1].text.length)")
  lufs=$(ffmpeg -hide_banner -i "$f" -af ebur128 -f null - 2>&1 | grep -A1 'Integrated' | tail -1 | awk '{print $2}')
  echo "vo$i  $(echo "scale=1; $chars/$dur" | bc) chars/s  $lufs LUFS"
  i=$((i + 1))
done
