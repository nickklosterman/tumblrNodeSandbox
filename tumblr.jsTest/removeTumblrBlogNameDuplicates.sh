#!/bin/bash
# read the ../tumblrListUniq.txt file and delete the files. This is to get around the contstant "argument list too long" when globbing
echo "this script will delete ALL files whose prefix is read from tumblrListUniq.txt!"
echo "enter a character to continue or quit (Ctrl-C) now"
read someChar
sort tumblrListUniq.txt | uniq -u > /tmp/tlU.txt.uniq
mv /tmp/tlU.txt.uniq tumblrListUniq.txt
