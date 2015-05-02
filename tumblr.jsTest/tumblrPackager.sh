#!/bin/bash

filename=${1}

while read LINE
do
    echo "Processing ${LINE}"
    tar -zcvf ${LINE}.tar.gz ${LINE}*
done < $filename

