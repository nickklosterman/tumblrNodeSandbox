#!/bin/bash
#this is meant to be run in the dir where all the images are under the tumblrjstest dir
cd Images
find . -name "*.jpg"  -type f -print0 | xargs -0 ../../../jpeginfo/jpeginfo -c | grep -v OK > ../filesToDelete.txt
sed 's/.jpg .*/.jpg/;s/^/rm /;s/\.\//\.\/Images\//' filesToDelete.txt 
