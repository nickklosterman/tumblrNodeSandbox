#!/bin/bash
#!/bin/bash
chars=( {a..z} {0..9} )
date=`date +%Y-%m-%d`

echo "This is a workaround for large numbers of files where `ls` chokes on them. Online resources state to either up the `ls` limit of files or to use `find` or `xargs`."
for LINE in why-i-love-comics  #add more on as a space separated list
do 
    for ((i=0; i<${#chars[@]}; i++))
    do
	echo "${chars[i]}${chars[j]}"
	echo "zipping ${LINE}_${chars[i]}-${date}.cbz" 
	zip "${LINE}_${chars[i]}-${date}.cbz" "${LINE}"_"${chars[i]}"*.jpg "${LINE}"_"${chars[i]}"*.png
	if  [[ $? == 0 ]]
	    then 
		rm "${LINE}"_"${chars[i]}"*.jpg "${LINE}"_"${chars[i]}"*.png
	fi
    done 
done


#Alternately #http://www.linuxjournal.com/article/6060 http://www.linuxquestions.org/questions/programming-9/zip-gives-error-bash-usr-bin-zip-argument-list-too-long-461482/
find ./ -name '"${LINE}"*.jpg' '"${LINE}"*.png' -print | zip "${LINE}-${date}.cbz" -@
#find . -name '*.gif' -print | zip gifs-2016-02-24.zip -@
#it appears that you can simply zip the directory to get around the expansion
find . -name 'pinuparena*.*g' -print | zip pinpuparena-2016-02-24.izp -@
find . -name '*.gif' -print | zip gifs-2016-02-24.zip -@

#maggins has a LOT of images ....lots of gifs as well

#find gifs that are animated (i.e. have more than 1 frame)
identify -format "%n" image.gif  #http://www.imagemagick.org/discourse-server/viewtopic.php?t=9868
I would want to dump those animated gifs into a directory or file or something for viewing of them. 
