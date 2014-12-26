#!/bin/bash
#this excludes the "by-some-artist" which I think are deviant art or externally sources images.
ls pinuparena* | grep -v by- | sed 's/pinuparena_//;s/-.*//' | grep -v _tumblr | sort | uniq > /tmp/pinupArena.txt
echo "This script creates a list of tumblrs used by pinuparena and places them in /tmp/pinupArena.txt"
echo "to get a count of the uniq occurrences, use `uniq -c` as the last command"
