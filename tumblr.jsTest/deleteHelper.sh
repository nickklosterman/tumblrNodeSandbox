#!/bin/bash
# read the ../tumblrListUniq.txt file and delete the files. This is to get around the contstant "argument list too long" when globbing
echo "this script will delete ALL files whose prefix is read from tumblrListUniq.txt!"
echo "enter a character to continue or quit now"
read someChar
while read line
do 
    echo ;
    rm ${line}*.* ;
done < ../tumblrListUniq.txt
