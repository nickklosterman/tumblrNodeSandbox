#!/bin/bash
node ../driver.js 17 ../tumblrListUniq.txt;
find . -type f -size 0 -print0 | xargs -0 rm #basically RMZ
