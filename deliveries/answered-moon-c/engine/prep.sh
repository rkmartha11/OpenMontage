#!/bin/sh
# usage: id start dur name [cropx_frac]  -> clips/name.mp4 1080x1920 30fps graded
G="eq=contrast=1.05:saturation=0.9:gamma=0.98,colorbalance=bs=0.03:bm=0.01:rh=0.025:gh=0.008"
while read id ss du name cx; do
  [ -z "$id" ] && continue
  u=$(grep "^$id " thumbs/urls.txt | cut -d' ' -f2)
  cx=${cx:-0.5}
  ffmpeg -nostdin -v error -y -ss $ss -i "$u" -t $du -an -vf "scale=-2:1920:flags=lanczos,crop=1080:1920:(iw-1080)*$cx:0,fps=30,$G,unsharp=5:5:0.35" -c:v libx264 -crf 14 -preset medium -pix_fmt yuv420p clips/$name.mp4 && echo "ok $name"
done
