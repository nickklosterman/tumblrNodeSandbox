#!/bin/bash
node ../driver.js 17 ../tumblrListUniq.txt;
find . -type f -size 0 -print0 | xargs -0 rm #basically RMZ

echo "" > /tmp/jpegCheck.sh
while read LINE
do
#run jpeginfo check on the files, grep the files that aren't shown as 'ok', strip off all the message garbage leaving just the filename and stick a `rm` on the front and pipe it to our file.     
    ../../../jpeginfo/jpeginfo -c ${LINE}* | grep -v "[OK]" | sed 's/ .*//;s/^/rm /' >> /tmp/jpegCheck.sh
    
done < ../tumblrListUniq.txt
