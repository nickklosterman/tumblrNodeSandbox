#!/bin/bash
#this is meant to be run in the dir where all the images are under the tumblrjstest dir
cd Images
find . -name "*.jpg"  -type f -print0 | xargs -0 ../../../jpeginfo/jpeginfo -c | grep -v OK > /tmp/filesToDelete.txt
cd ..
sed 's/.jpg .*/.jpg/;s/^/rm /;s/\.\//\.\/Images\//' /tmp/filesToDelete.txt > /tmp/deletefiles.sh
bash /tmp/deletefiles.sh

#now go and do the same for pnga
