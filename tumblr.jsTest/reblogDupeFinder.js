// get a list of all files.
//     sort them by length;
// check for substring occurrence of strings with length + threshold(say 4 char min tumblr name)
// or really just look for the tumblr names from tumblrListUniq.txt which don't start a filename.; hmm this isn't fullproof but a very good quick and dirty look. 

// filelist=/tmp/tumblrReblogDupeCheckTest.txt

// for extension in '*.gif' '*.png' '*.jpg'
// do  



// `ls $extension > /tmp/tumblrReblogDupeCheckTest.txt`

// while read LINE
// do 
// grep \^${LINE} $filelist
// done < $filename

// done


var fs = require('fs'),
    path = '.',
    THRESHOLD=2;

fs.readdir(path,function(err,files) {
    if (err) { throw err; }

    for (var i=0; i<5;i++){
	console.log(files[i]+" "+files[i].length);
	
    }
    //does sorting make it any faster?
    files.sort(function(a,b){
	return a.length - b.length ;
	//these shouldn't ever be hit
	// console.log("a:"+a+" b:"+b);
	// if (a.length > b.length) {
	//     	    return 1;
	// } else {
	//     return 0;
	// }
    })
    console.log("------aftersort");
    for (var i=0; i<5;i++){
	console.log(files[i]+" "+files[i].length);
    }
    //    files.forEach(function(ele,ind,arr){
    //  })
    var compareMethod="GUID";"//Substring"

    switch(compareMethod){
    case "Substring":

	var  arrayLength = files.length;
	for (var outer=0; outer<arrayLength; outer++){
	    var outerFile={	    name:files[outer],  length:files[outer].length	};
	    for (var inner=0; inner<arrayLength; inner++){
		var innerFile={name:files[inner],length:files[inner].length};
		//this length check also prevents self matches.
		if (innerFile.length>outerFile.length+THRESHOLD) {
		    //	console.log("comp");
		    if (innerFile.name.indexOf(outerFile.name) != -1 ) {
		    	console.log("-+- "+innerFile.name+" "+outerFile.name);
		    	console.log(outerFile.name);
		    }
		} else {
		    //		console.log("no comp");
		}
	    }
	}
	break;
    case "GUID":
	var objArray = [],
	arrayLength = files.length,
	obj={};
	console.log("populating array.");
	for (var inner=0; inner<arrayLength; inner++){
	    obj={
		name:files[inner],
		length:files[inner].length,
		GUID:getFileGUIDFromFilename(files[inner])
	    };
	    //		console.log(obj.GUID);
	    objArray.push(obj);
	}
	console.log("done populating array");
	console.log(arrayLength);
	console.log(objArray.length);
	for ( outer=0; outer<arrayLength; outer++){
	    for ( inner=0; inner<arrayLength; inner++){
		//this length check also prevents self matches.
		if (objArray[inner].GUID==objArray[outer].GUID && objArray[inner].name!==objArray[outer].name) {
		    console.log(objArray[inner].name+" "+objArray[outer].name);//+" "+objArray[outer].GUID+" "+inner+" "+outer);
		}
	    }

	}
	break;
    }//end switch
});


function getFileGUIDFromFilename(filename) {

    splitfile=filename.split('_');
    //    console.log(splitfile[splitfile.length-2]);
    var GUID=splitfile[splitfile.length-2];
    if (typeof GUID !== 'undefined' && GUID.length === 2) { //"r1"
	GUID=splitfile[splitfile.length-3];
    }
    //include length of 20 as last char(s) are number and are incremented if images sequential
    if (typeof GUID!== 'undefined' && (GUID.length === 19 || GUID.length === 20 )) {
	return GUID
    } else {
	return null;
    }

}

