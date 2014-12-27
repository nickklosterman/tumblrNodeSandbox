#!/bin/bash
echo "this script outputs a list of the tumblrs whose images have been downloadeed and their respective counts"
ls | sed 's/_.*//' | sort | uniq -c | sort -h
#1) get list of files
#2) strip off the uuid of the file name, retain just the tumblr name
#3) sort the tumblr names alphabetically
#4) get a count of the unique names
#5) sort the counts using the human readable numeric format
