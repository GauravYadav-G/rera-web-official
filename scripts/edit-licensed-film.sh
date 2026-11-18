#!/usr/bin/env bash
# Local demo edit. Source links and licences are listed in docs/media-credits.md.
set -euo pipefail
root=${1:-/tmp/rera-polish}
mkdir -p "$root/editorial" public/media public/images
font=${FONT:-/tmp/fonts/LiberationMono-Regular.ttf}
[ -f "$font" ] || font=/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf
shots=(cottonbro-terminal shutter-setup cottonbro-editor)
starts=(3.5 5 8)
labels=('01  /  RUN THE TOOLCHAIN' '02  /  RESOLVE DEPENDENCIES' '03  /  INSPECT THE OUTPUT')
for i in 0 1 2; do
  ffmpeg -hide_banner -loglevel error -y -ss "${starts[$i]}" -i "$root/${shots[$i]}.mp4" -t 5 -map 0:v:0 -an -sn -dn -map_metadata -1 -write_tmcd 0 \
    -vf "fps=24,scale=1040:584:force_original_aspect_ratio=increase:flags=lanczos,crop=1040:584,hue=s=0,eq=brightness=0.006:contrast=1.06,setsar=1,pad=1152:648:56:34:color=0xece7dc,drawbox=x=56:y=33:w=1040:h=1:color=0x9b958a:t=fill,drawbox=x=56:y=618:w=1040:h=1:color=0x9b958a:t=fill,drawbox=x=56:y=14:w=6:h=6:color=0xff5a1f:t=fill,drawtext=fontfile=${font}:text='RERA WEB  /  BUILD SHORTS':fontsize=13:x=71:y=11:fontcolor=0x22211d,drawtext=fontfile=${font}:text='${labels[$i]}':fontsize=13:x=56:y=h-21:fontcolor=0x22211d,drawtext=fontfile=${font}:text='ILLUSTRATIVE FOOTAGE':fontsize=11:x=w-tw-56:y=h-20:fontcolor=0x4f4a3e" \
    -c:v libx264 -crf 24 -pix_fmt yuv420p "$root/editorial/clip-$i.mp4"
done
printf 'file clip-0.mp4\nfile clip-1.mp4\nfile clip-2.mp4\n' > "$root/editorial/concat.txt"
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$root/editorial/concat.txt" -map 0:v:0 -c copy -movflags +faststart public/media/terminal-study.mp4
ffmpeg -hide_banner -loglevel error -y -ss 3.1 -i public/media/terminal-study.mp4 -frames:v 1 -c:v libwebp -quality 88 public/images/terminal-study.webp
