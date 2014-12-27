#!/bin/bash
echo "this script outputs a list of the tumblrs whose images have been downloadeed and their respective counts"
ls | sed 's/_.*//' | sort | uniq -c
