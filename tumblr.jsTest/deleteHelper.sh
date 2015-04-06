#!/bin/bash
# read the ../tumblrListUniq.txt file and delete teh files. This is to get around the contstant "argument list too long" when globbing
while read line; do ; echo ; rm *.* ; done < ../tumblrListUniq.txt
