#!/bin/bash

filename=${1}

while read LINE
do
    echo "Processing ${LINE}"
    mv /Users/nklosterman/.personal/Git/tumblrNodeSandbox/tumblr.jsTest/Media/${LINE}* /Volumes/NO\ NAME/Media/
done < $filename

