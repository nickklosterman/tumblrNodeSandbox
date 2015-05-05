#!/bin/bash
node ../driver.js 17 ../tumblrListUniq.txt;
find . -type f -size 0 -print0 | xargs -0 rm #basically RMZ

echo "" > /tmp/jpegCheck.sh
while read LINE
do
    
    ../../../jpeginfo/jpeginfo -c ${LINE}* | grep -v "[OK]" | sed 's/ .*//;s/^/rm /' >> /tmp/jpegCheck.sh
    
done < ../tumblrListUniq.txt
