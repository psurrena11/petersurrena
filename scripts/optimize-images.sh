#!/usr/bin/env bash
#
# Compress images in public/img in place. Only overwrites a file when the
# compressed version is actually smaller. Skips svg/ico.
#
# Requires: imagemagick, pngquant  (sudo pacman -S imagemagick pngquant)
#
# Usage:
#   scripts/optimize-images.sh            # compress public/img
#   scripts/optimize-images.sh <dir>      # compress another folder
#   DRY_RUN=1 scripts/optimize-images.sh  # report savings without writing

set -euo pipefail

IMG_DIR="${1:-$(dirname "$0")/../public/img}"
JPG_QUALITY=82
WEBP_QUALITY=82
PNG_QUALITY="65-85"
DRY_RUN="${DRY_RUN:-0}"

command -v magick >/dev/null || { echo "imagemagick not found (sudo pacman -S imagemagick)"; exit 1; }
command -v pngquant >/dev/null || { echo "pngquant not found (sudo pacman -S pngquant)"; exit 1; }

total_before=0
total_after=0
changed=0
skipped=0

human() {
  numfmt --to=iec --suffix=B "$1"
}

while IFS= read -r -d '' f; do
  before=$(stat -c%s "$f")
  tmp=$(mktemp --suffix=".${f##*.}")

  case "${f,,}" in
    *.jpg|*.jpeg)
      magick "$f" -strip -interlace Plane -quality "$JPG_QUALITY" "$tmp"
      ;;
    *.png)
      pngquant --quality="$PNG_QUALITY" --strip --speed 1 --force --output "$tmp" -- "$f" \
        || cp "$f" "$tmp"   # pngquant fails if it can't meet quality target; keep original
      ;;
    *.webp)
      magick "$f" -strip -quality "$WEBP_QUALITY" "$tmp"
      ;;
  esac

  after=$(stat -c%s "$tmp")
  total_before=$((total_before + before))

  if (( after < before )); then
    total_after=$((total_after + after))
    changed=$((changed + 1))
    printf '%-70s %9s -> %9s (-%d%%)\n' "${f#"$IMG_DIR"/}" "$(human "$before")" "$(human "$after")" $(( (before - after) * 100 / before ))
    if [[ "$DRY_RUN" != "1" ]]; then
      mv "$tmp" "$f"
    else
      rm -f "$tmp"
    fi
  else
    total_after=$((total_after + before))
    skipped=$((skipped + 1))
    rm -f "$tmp"
  fi
done < <(find "$IMG_DIR" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' \) -print0)

echo
echo "Compressed: $changed files, unchanged: $skipped"
echo "Total: $(human "$total_before") -> $(human "$total_after") (saved $(human $((total_before - total_after))))"
[[ "$DRY_RUN" == "1" ]] && echo "(dry run — nothing was written)"
exit 0
