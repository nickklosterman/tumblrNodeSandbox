# get a list of all files.
#     sort them by length;
# check for substring occurrence of strings with length + threshold(say 4 char min tumblr name)
# or really just look for the tumblr names from tumblrListUniq.txt which don't start a filename.; hmm this isn't fullproof but a very good quick and dirty look. 

#outputs length of longest line
#cat ../tumblrListUniq.txt | while read line; do echo $line | wc -m ; done | sort -n | tail -1
#wc -L ../tumblrListUniq.txt # this gave 28, whereas the above gave 29......hmm

#outputs length of shortest line
#cat ../tumblrListUniq.txt | while read line; do echo $line | wc -m ; done | sort | tail -1

filelist=/tmp/tumblrReblogDupeCheckTest.txt
if [[ 1 -lt 0 ]]
   then
filelist=/tmp/tumblrReblogDupeCheckTest.txt
filename=../tumblrListUniq.txt
for extension in '*.gif' '*.png' '*.jpg'
do  

#    echo `expr ls $extension > /tmp/tumblrReblogDupeCheckTest.txt`

    while read LINE
    do
	echo "    ${LINE} : "
#	while read LINE2
	#	do

	#grep for lines that start with our tumblr name, invert that. Pipe that and find our tumblr name in those files that don't start with our tumblr name.; i.e. find our tumblr name in files where it doesn't occur at the beginning
grep -v \^${LINE} $filelist | grep ${LINE} 
	    #grep \^${LINE} $filelist
#	    echo `expr match ${LINE} ${LINE2}`
#	done < $filelist
    done < $filename

done
fi

function checkForMatch() {
    filelist=$1
    checklength=$2
    LINE=$3
    while read LINE2
    do
	len2=${#LINE2}
	if [[ $len2 -gt $checklength ]]
	then
	    if [[ "${LINE}" =~ "${LINE2}" ]]
	    then
		echo ${LINE2} ${LINE}
	    fi
	fi
    done < $filelist
    }

filelist2=$filelist
THRESHOLD=6 #our shortest tumblr name is 9 chars long, plus a _ would make 10
while read LINE
do
    len1=${#LINE}
    checklength=$len1+$THRESHOLD
    while read LINE2
    do
    	len2=${#LINE2}
    	if [[ $len2 -gt $checklength ]]
    	then
    	    if [[ "${LINE}" =~ "${LINE2}" ]]
    	    then
    		echo ${LINE2} ${LINE}
    	    fi
    	fi
    done < $filelist
#    checkForMatch $filelist $checklength $LINE
done < $filelist
