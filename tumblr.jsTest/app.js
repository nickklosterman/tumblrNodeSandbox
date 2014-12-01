// user for the maria db will need update,select,insert and create permissions. GRANT UPDATE,SELECT, INSERT ON <table> TO '<username>'@'<host>';

var fs = require('graceful-fs'),
    request = require('request'),
    util = require('util'),
    inspect = require('util').inspect
var diskspace = require('diskspace')
var mariasql = require('mariasql')
var tumblr = require('tumblr.js');
var sqlite3 = require("sqlite3").verbose() //is there a way to only condiitonally include this as all users won't need it?

//var diskspace = require('diskspace')

// Parameters:
// -tumblrName (required)
// -diskSpaceMinimum (optional) 
// -sqliteDatabaseFile (optional)
// -mariaHost, mariaUser, mariaPassword, mariaDatabase (optional) but all are needed for successful connection
// -mariaClient - instantiated mariaDB connection
function TumblrConnection(parameters){ 
  this.tumblrName=parameters['tumblrName']
  if (typeof parameters['tumblrName'] === 'undefined'){
    throw new Error('Missing required parameter: tumblrName.');
  }
  this.tumblrURL=this.tumblrName+".tumblr.com" //naive url grabbing

  if ( typeof process.env.TUMBLR_CONSUMER_KEY !== 'undefined'
    && typeof process.env.TUMBLR_SECRET_KEY !== 'undefined'
    && typeof process.env.TUMBLR_TOKEN !== 'undefined'
    && typeof process.env.TUMBLR_TOKEN_SECRET!== 'undefined'
     ){
    this.client = tumblr.createClient({
      consumer_key: process.env.TUMBLR_CONSUMER_KEY,
      consumer_secret: process.env.TUMBLR_SECRET_KEY, 
      token: process.env.TUMBLR_TOKEN,
      token_secret: process.env.TUMBLR_TOKEN_SECRET
    });
  } else {
    throw new Error("Missing one or more Tumblr Api keys")
  }

  // disk space minimum in gigabytes to check for and key off of
  // this really belongs in a parent class along with the mariadb connection as it doesn't change on a per username basis
  this.diskSpaceMinimum = (parameters['diskSpaceMinimum']) ? parameters['diskSpaceMinimum']*1000000000 : 1000000000
  this.checkDiskSpace()

  // file specifiying the sqlite database 
  this.sqliteDatabaseFile = (parameters['sqliteDatabaseFile']) ? parameters['sqliteDatabaseFile'] : ''

  // sqlite database connector variable
  if(this.sqliteDatabaseFile !== ''){
    //  console.log(this.sqliteDatabaseFile)
    this.sqliteDB = new sqlite3.Database(this.sqliteDatabaseFile)
    //    console.log(this.sqliteDB)
    // this.sqliteDB = {}
  } else {
    //    console.log("sqliteDB not initialized")
  }

  // mariadb parameters
  if (parameters['mariaHost']
    && parameters['mariaUser']
    && parameters['mariaPassword']
    && parameters['mariaDatabase'] ) {
    //console.log("setting up maria")
    var that = this;
    this.mariaHost = parameters['mariaHost']
    this.mariaUser = parameters['mariaUser']
    this.mariaPassword = parameters['mariaPassword']
    this.mariaDatabase = parameters['mariaDatabase']
    this.mariaClient = new mariasql()
    this.mariaClient.connect({host:this.mariaHost,
                              user:this.mariaUser,
                              password:this.mariaPassword,
                              db:this.mariaDatabase})
    
    this.mariaClient.on('connect', function() {
      //console.log('Client connected');
    })
    .on('error', function(err) {
      console.log('Client error: ' + err);
    })
    .on('close', function(hadError) {
      console.log('Client closed');
    });
  }

  //maria client passed in to prevent too many connections being made
  //    if (typeof parameters['mariaClient'] !== 'undefined'){
  if (parameters['mariaClient']){
    process.stdout.write("using mariaclient")
    this.mariaClient = parameters['mariaClient']
  } 

}

TumblrConnection.prototype.mariaEnd = function() {
  this.mariaClient.end()
}

//
// get all rows from database and see if file exists locally
// if it doesn't, mark that entry as a deletion
//
TumblrConnection.prototype.mariaFindFileDeletions = function ()  {
  var that = this
  that.mariaClient.query('SELECT tumblrName,post,imageURL,imageFilename FROM Posts')
  //                        + ' FROM Posts WHERE deleted = false AND duplicate = false')//downloaded=false
  .on('result', function(res) {
    res.on('row', function(row) {
      var thisrow = row
      var filename = row['tumblrName']+"_"+row['post']+"_"+row['imageFilename']
      //util.debug("filename:"+filename)
      fs.exists(filename,function(exists){
        util.debug(filename+" exists:"+exists)
        if (exists===false) {
          // util.debug(filename+" exists")
          that.mariaClient.query('UPDATE Posts SET deleted=true WHERE imageURL="'
                                +thisrow['imageURL']
                                +'" AND tumblrName="'
                                +thisrow['tumblrName']
                                +'" AND post = "'+thisrow['post']+'"')
          .on('result',function(res) {
            //I need to know that the result is successful
            //console.log(res) 
            // I really have no idea what to parse out of the response as it 
            // appears to really give results of the query, which since it was successfull to get 
            // to this point, doesn't really warrant posting the response.
          })
          .on('error', function(err) {
            console.log('Result error: ' + inspect(err));
          })
          .on('end', function(info) {
            /* console.log('Result finished successfully'); */
          });
        } else {
          util.debug(filename+" exists, not updating")
        }
      })
    })
    .on('error', function(err) {
      console.log('Result error: ' + inspect(err));
    })
    .on('end', function(info) {
      /* console.log('Result finished successfully'); */
    });
  })
  .on('end', function() {
    console.log('Done with all results');
  });
}


//
// Scan local directory and send filenames off to be decomposed and entered/updated in the database
//
TumblrConnection.prototype.scanLocalDirectory = function(){
  var that = this
  var path = '.' //'/home/arch-nicky/' //'.'

  var files = fs.readdirSync(path)
  if (files){
    //console.log(files)
    files.forEach(function(element,index,fullArray){
      //console.log(element)
      that.decomposeFilename(element)
    })
  }

  //async readdir call
  // fs.readdir(path,function(err,files){
  //   if (err) {
  //     console.log(err)
  //   }
  //   if (files){
  //     //console.log(files)
  //     files.forEach(function(element,index,fullArray){
  //       console.log(element)
  //       that.decomposeFilename(element)
  //     })
  //   }
  // })
}

//
// Extract database fields from filename
//
TumblrConnection.prototype.decomposeFilename = function(filename){
  var splitFilename=filename.split('_')
  //  console.log(filename+" "+splitFilename)
  if(splitFilename.length > 3){
    //Example filename
    // brianmichaelbendis_michael-zulli-john-totleben-stephen-r_tumblr_n1h24dHtrT1rv5690o6_r2_1280.jpg
    // ca-tsuka_stills-of-animator-expo-program-trailer-produced_tumblr_ne2gatA5Q21rb1rgoo8_1280.jpg
    // the first split element will be the tumblrName
    // the second split element will be the postName
    // all subsequent split elements will comprise the actual imagename
    var tumblrName=splitFilename[0]
    var postName=splitFilename[1]
    var imageName=""

    for (var i=2;i<splitFilename.length;i++){
      if (i !== splitFilename.length-1){
        imageName+=splitFilename[i]+"_"
      } else {
        imageName+=splitFilename[i]
      }
    }
    console.log("tumblrName:"+tumblrName+" postName:"+postName+" imageName:"+imageName)
  }
}
//
// Download and save image file; used in conjunction with query from mariadb
// updates db after image fully downloaded
//
TumblrConnection.prototype.mariaSaveFile = function(filename,url){
  var that = this;
  if ( fs.existsSync(filename) ) {
    //console.log(filename+" already exists. Skipping.")
    process.stdout.write("X")
  } else {
    var imageStream=fs.createWriteStream(filename)
    imageStream.on('close',function(){
      console.log("Writing of "+filename+" done.")
      that.mariaUpdateDownloaded(url)
    })
    var options = {url:url,headers:{ 'User-Agent':'request'}}
    var that = this //another that = this????
    var imagerequest=request(options,function(err,resp,body) {
                       if (err){
		         if (err.code === 'ECONNREFUSED') {
			   console.error(url+' Refused connection');
		         } else if (err.code==='ECONNRESET') {
			   console.error(url+' reset connection')
		         } else if (err.code==='ENOTFOUND') {
			   console.error(url+' enotfound')
		         } else {
			   console.log(url+err);
			   console.log(err.stack);
		         }
			 that.saveFile(filename,url);//call ourself again if there was an error (mostlikely due to hitting the server too hard)
			 //use settimeout and call yourself?
		       }
                     })
    imageStream.on('error',function(error) {
      if (error) {
        console.log("imageStream error:"+error)
        that.saveFile(filename,url);//call ourself again if there was an error (mostlikely due to hitting the server too hard)
      }
    })
    imagerequest.pipe(imageStream)
  }
}

//
// update mariadb posts which have been downloaded.
// match on the url
//
TumblrConnection.prototype.mariaUpdateDownloaded = function(url) {
  var that = this
  this.mariaClient.query('UPDATE Posts SET downloaded=true WHERE imageURL="'+url+'"')
  .on('result',function(res) {
    //I need to know what the 
    //console.log(res) 
    util.debug("update of download complete")
  })
  .on('error', function(err) {
    console.log('Result error: ' + inspect(err));
    that.mariaUpdateDownloaded(url)
  })
  .on('end', function(info) {
    /* console.log('Result finished successfully'); */
  });
}

//
// query mariadb to find posts which haven't been downloaded, call function to download them.
//
TumblrConnection.prototype.mariaQuery = function () {
  var that = this
  that.mariaClient.query('SELECT tumblrName,post,imageURL,imageFilename FROM Posts WHERE deleted = false AND duplicate = false')//downloaded=false
  .on('result', function(res) {
    res.on('row', function(row) {
      var filename = row['tumblrName']+"_"+row['post']+"_"+row['imageFilename']
      that.mariaSaveFile(filename,row['imageURL'])
    })
    .on('error', function(err) {
      console.log('Result error: ' + inspect(err));
    })
    .on('end', function(info) {
      /* console.log('Result finished successfully'); */
    });
  })
  .on('end', function() {
    process.stdout.write("-")
    //console.log('Done with all results');
  });
}

TumblrConnection.prototype.mariaInsertAndDownload  = function ()  {
  this.mariaInsert(true)
}

//
// insert tubmlr image record into mariadb if there is no 
//
TumblrConnection.prototype.mariaInsert = function(downloadBoolean) {
  var that = this
  //console.log(this)
  this.client.posts(this.tumblrURL, function(err,data) {
    if (err) {
      console.log(that.tumblrURL+"-"+err)
    } else {
      data.posts.forEach(function(element,index,fullArray) {
        var slug  = element.slug
        if (typeof element.photos !== 'undefined') {
          element.photos.forEach(function(element,index,fullArray) {
            if (typeof element.alt_sizes !== 'undefined' && element.alt_sizes.length > 0) {
              var url = element.alt_sizes[0].url
              var splitURL = element.alt_sizes[0].url.split('/')
              var imageFilename = splitURL[splitURL.length-1]
              var filename = that.tumblrName+"_"+slug+"_"+imageFilename
              //              that.mariaClient.query('SELECT COUNT(*) FROM Posts WHERE imageFilename = ?',imageFilename)
              //console.log(that)
              that.mariaClient.query('SELECT COUNT(*) FROM Posts WHERE imageFilename = "'+imageFilename+'"')
              .on('result', function(res) {
                res.on('row', function(row) {
                  //console.log('Result row: ' + inspect(row));
                  //console.log(row['COUNT(*)'])
                  //util.debug(row['COUNT(*)'])
                  if (row['COUNT(*)'] == 0 ) {
                    //that.mariaClient.query('INSERT INTO Posts (tumblrName,post,imageURL,imageFilename,deleted,json,duplicate) VALUES ("?","?","?","?","?","?","?")',that.tumblrName,"nothing",url,imageFilename,false,"-",false) //this inserts question marks
                    //that.mariaClient.query('INSERT INTO Posts (tumblrName,post,imageURL,imageFilename,deleted,json,duplicate) VALUES (?,?,?,?,?,?,?)',that.tumblrName,"nothing",url,imageFilename,false,"-",false)
                    //that.mariaClient.query('INSERT INTO Posts SET ?',{tumblrName:that.tumblrName,post:"nothing",imageURL:url,imageFilename:imageFilename,deleted:false,json:"-",duplicate:false})
                    util.debug('INSERT INTO Posts (tumblrName,post,imageURL,imageFilename,deleted,json,duplicate) VALUES ("'+that.tumblrName+'","'+slug+'","'+url+'","'+imageFilename+'",'+false+',"-",'+false+')')
                    if (typeof downloadBoolean !== 'undefined'
                      && downloadBoolean === true) {
                      that.mariaSaveFile(filename,url)
                    }

                    that.mariaClient.query('INSERT INTO Posts (tumblrName,post,imageURL,imageFilename,deleted,json,duplicate,downloaded) '
                                          + 'VALUES ("'+that.tumblrName+'","'+slug+'","'+url+'","'+imageFilename+'",false,"-",false,false)')
                    .on('result', function(res) {
                      res.on('row', function(row) {
                        ///
                        /// This is not being hit
                        ///
                        console.log('Insert Result row: ' + inspect(row));
                        if (typeof downloadBoolean !== 'undefined'
                          && downloadBoolean === true) {
                          that.mariaSaveFile(filename,url)
                        }
                      })
                      .on('error', function(err) { console.log('Result error: ' + inspect(err));})
                      .on('end', function(info) {/* console.log('Result finished successfully'); */ });
                    })
                    .on('end', function() {process.stdout.write('*'); /*console.log('Done with all results');*/}); //Insert into Posts....
                    
                  } else {
                    //if the image was already entered, perform more in depth query to see if the post would be a duplicate
                    //util.debug(imageFilename+" present.")
                    //util.debug("imageFilename:"+imageFilename+" tumblrName:"+that.tumblrName+" slug:"+slug)
                    that.mariaClient.query('SELECT COUNT(*) FROM Posts '
                                          + 'WHERE imageFilename = "'+imageFilename
                                          +'" AND tumblrName = "'+that.tumblrName
                                          +'" AND post = "'+slug+'"')
                    .on('result', function(res) {
                      res.on('row', function(row) {
                        if (row['COUNT(*)'] == 0 ) {
                          that.mariaClient.query('INSERT INTO Posts (tumblrName,post,imageURL,imageFilename,deleted,json,duplicate,downloaded) '
                                                + 'VALUES ("'+that.tumblrName+'","nothing","'+url+'","'+imageFilename+'",false,"-",true,false)')
                          .on('result', function(res) {
                            res.on('row', function(row) { console.log('Insert Result row: ' + inspect(row)); })
                            .on('error', function(err) { console.log('Result error: ' + inspect(err)); })
                            .on('end', function(info) {/* console.log('Result finished successfully'); */ });
                          })
                          .on('end', function() {process.stdout.write('^'); /*console.log('Done with all results');*/ });
                        } else {
                          //console.log("Duplicate post prevented")
                          process.stdout.write("D")
                          
                        }
                      })
                      .on('error', function(err) { console.log('Result error: ' + inspect(err)); })
                      .on('end', function(info) {/* console.log('Result finished successfully'); */ });
                    })
                    .on('end', function() { process.stdout.write('$'); /*console.log('Done with all results');*/});
                  }
                }) // triggers for initial Result of Select Count(*)
                .on('error', function(err) {console.log('Result error: ' + inspect(err)); })
                .on('end', function(info) {/* console.log('Result finished successfully'); */ });
              }) // trigger for select Count(*)
              .on('end', function() { process.stdout.write('!'); /*console.log('Done with all results');*/ });
              //              that.mariaClient.end()

              // that.mariaClient.query(that.mariaInsertPQ(that.tumblrName,"nothing",url,imageFilename,false,"-",false))
              // .on('result', function(res) {
              //   res.on('row', function(row) {
              //     console.log('Result row: ' + inspect(row));
              //   })
              //   .on('error', function(err) {
              //     console.log('Result error: ' + inspect(err));
              //   })
              //   .on('end', function(info) {
              //    /* console.log('Result finished successfully'); */
              //   });
              // })
              // .on('end', function() {
              //   console.log('Done with all results');
              // });
            }
          })
        }
      })
    }
  })
}

TumblrConnection.prototype.analyzeNameLengths = function() {
  var that = this
  var urlLength = 0
  var splitURLLength = 0
  var imageFilenameLength = 0
  var filenameLength = 0
  var postsLength = 0
  var slugLength = 0 
  this.client.posts(this.tumblrURL, function(err,data) {
    if (err) {
      console.log(that.tumblrURL+"-"+err)
    } else {
      data.posts.forEach(function(element,index,fullArray) {
        if (postsLength < (JSON.stringify(element)).length) { postsLength = (JSON.stringify(element)).length }
        var slug  = element.slug
        if (slugLength < slug.length ){ slugLength = slug.length }
        if (typeof element.photos !== 'undefined') {
          element.photos.forEach(function(element,index,fullArray) {
            if (typeof element.alt_sizes !== 'undefined' && element.alt_sizes.length > 0) {
              var url = element.alt_sizes[0].url
              var splitURL = element.alt_sizes[0].url.split('/')
              var imageFilename = splitURL[splitURL.length-1]
              var filename=this.tumblrName+"_"+slug+"_"+imageFilename
              if ( urlLength <  url.length ) { urlLength = url.length }
              //if ( splitURLLength < (splitURL[length-1]).length ) { splitURLLength = (splitURL[length-1]).length }
              if ( imageFilenameLength < imageFilename.length) {imageFilenameLength = imageFilename.length}
              if ( filenameLength < filename.length) { filenameLength = filename.length } 
            }
            if ( index === fullArray.length -1 ){
              console.log(that.tumblrURL)
              console.log(" postsLength: "+postsLength)
              console.log(" urlLength: "+urlLength)
              console.log(" slugLenght: "+slugLength)
              //console.log("splitURLLength: "+splitURLLength)
              console.log(" imageFilenameLength: "+imageFilenameLength)
              console.log(" filenameLength: "+filenameLength)
              
            }
            
          })
        }
      })
    }
  })
}

TumblrConnection.prototype.savePostsToSQLiteDatabase = function() {
  var that = this
  var postArray = []
  var getData = function (cb) {
    that.client.posts(that.tumblrURL, function(err,data) {
      if (err) {
        console.log(that.tumblrURL+"-"+err)
      } else {
        data.posts.forEach(function(element,index,fullArray) {
          var fullPost = element
          var slug  = element.slug
          if (typeof element.photos !== 'undefined') {
            element.photos.forEach(function(element,index,fullArray) {
              //console.log(element+":"+slug+":"+fullPost)
              postArray.push({element:element,slug:slug,fullPost:fullPost})
              //that.saveFile(element,slug)
            })
          }
        })
        cb(postArray)  
      }
    })
  }
  getData(this.bulkInsertSQLite3Database.bind(this)/*(this.closeSQLite3Database)*/)
}

TumblrConnection.prototype.savePostImages = function() {
  var that = this
  this.client.posts(this.tumblrURL, function(err,data) {
    if (err) {
      console.log(that.tumblrURL+"-"+err)
    } else {
      data.posts.forEach(function(element,index,fullArray) {
        var slug  = element.slug
        if (typeof element.photos !== 'undefined') {
          element.photos.forEach(function(element,index,fullArray) {
            that.saveFile(element,slug)
          })
        }
      })
    }
  })
}

TumblrConnection.prototype.saveRssFile = function(){
    var url = "http://"+this.tumblrName+".tumblr.com/rss" //this is naive and may not work for all; e.g. pinuparena
    this.saveFeedFile(url,".rss");
}

TumblrConnection.prototype.saveXMLFeedFile = function(){
    url = "http://"+this.tumblrName+".tumblr.com/api/read"
    this.saveFeedFile(url,".xml");
}
TumblrConnection.prototype.saveJSONFeedFile = function(){
    url = "http://"+this.tumblrName+".tumblr.com/api/read/json"
    this.saveFeedFile(url,".json");

}

TumblrConnection.prototype.saveFeedFile = function(url,extension){
   
    var filename=this.tumblrName+extension
    var that = this;
    if ( fs.existsSync(filename) ) {
	//console.log(filename+" already exists. Skipping.")
	process.stdout.write("A")
    } else {
	process.stdout.write("W")
    }
    
    var fileStream=fs.createWriteStream(filename,{flags:'a'})
    fileStream.on('close',function(){
        //	fileStream.on('end',function(){
        console.log("Writing of "+filename+" done.")
    })

    var options = {url:url,headers:{ 'User-Agent':'request'}}
    var that = this
    var filerequest=request(options,function(err,resp,body) {
        if (err){
	    if (err.code === 'ECONNREFUSED') {
		console.error(url+' Refused connection');
	    } else if (err.code==='ECONNRESET') {
		console.error(url+' reset connection')
	    } else if (err.code==='ENOTFOUND') {
		console.error(url+' enotfound')
	    } else {
		console.log(url+err);
		console.log(err.stack);
	    }
	    that.saveRssFile(element,slug);//call ourself again if there was an error (mostlikely due to hitting the server too hard)
	}
    })
    fileStream.on('error',function(error) {
        if (error) {
            console.log("fileStream error:"+error)
            that.saveRssFile(element,slug);//call ourself again if there was an error (mostlikely due to hitting the server too hard)
        }
    })
    filerequest.pipe(fileStream)
}


TumblrConnection.prototype.saveFile = function(element,slug){
  if (typeof element.alt_sizes !== 'undefined' && element.alt_sizes.length > 0) {
    var url = element.alt_sizes[0].url
    var splitURL = element.alt_sizes[0].url.split('/')
    var imageFilename = splitURL[splitURL.length-1]
    var filename=this.tumblrName+"_"+slug+"_"+imageFilename
    var that = this;
    if ( fs.existsSync(filename) ) {
      //console.log(filename+" already exists. Skipping.")
      process.stdout.write("X")
    } else {
      var imageStream=fs.createWriteStream(filename)
      imageStream.on('close',function(){
        //	imageStream.on('end',function(){
        console.log("Writing of "+filename+" done.")
      })

      var options = {url:url,headers:{ 'User-Agent':'request'}}
      //do http requests for the image count against our limit? They aren't using the api,
      //console.log(options) 
      var that = this
      var imagerequest=request(options,function(err,resp,body) {
                         if (err){
		           if (err.code === 'ECONNREFUSED') {
			     console.error(url+' Refused connection');
		           } else if (err.code==='ECONNRESET') {
			     console.error(url+' reset connection')
		           } else if (err.code==='ENOTFOUND') {
			     console.error(url+' enotfound')
		           } else {
			     console.log(url+err);
			     console.log(err.stack);
		           }
			   that.saveFile(element,slug);//call ourself again if there was an error (mostlikely due to hitting the server too hard)
			   //use settimeout and call yourself?
		         }
                       })
      imageStream.on('error',function(error) {
        if (error) {
          console.log("imageStream error:"+error)
          that.saveFile(element,slug);//call ourself again if there was an error (mostlikely due to hitting the server too hard)
        }
      })
      imagerequest.pipe(imageStream)
    }
  }
}

TumblrConnection.prototype.setupMariaDatabase = function (){

  this.sqliteDB.serialize(function() {
    //name: the blog name
    //post: the post name
    //imageURL: the url of the image
    //deleted: boolean field for marking if the file was deleted locally
    //json: the full post data returned from the api
    //duplicate: boolean denoting if the image was referenced elsewhere (reblogged image)
    that.sqliteDB.run("CREATE TABLE IF NOT EXISTS Tumblr (name TEXT,post TEXT,imageURL TEXT,imageFilename TEXT, deleted INT,json TEXT,duplicate INT)")
  })
}
TumblrConnection.prototype.setupSQLite3Database = function (){
  if (this.sqliteDatabaseFile === ''){
    throw new Error('Invalid or Missing required parameter: sqliteDatabaseFile.');
  } else {
    //console.log(this.sqliteDatabaseFile)
  }
  var exists = fs.existsSync(this.sqliteDatabaseFile)
  if (!exists){
    console.log("Creating DB file.")
    fs.openSync(this.sqliteDatabaseFile, "w")
  }

  // var sqlite3 = require("sqlite3").verbose()

  // this.sqliteDB = new sqlite3.Database(this.sqliteDatabaseFile)
  var that = this
  this.sqliteDB.serialize(function() {
    //name: the blog name
    //post: the post name
    //imageURL: the url of the image
    //deleted: boolean field for marking if the file was deleted locally
    //json: the full post data returned from the api
    //duplicate: boolean denoting if the image was referenced elsewhere (reblogged image)
    that.sqliteDB.run("CREATE TABLE IF NOT EXISTS Tumblr (name TEXT,post TEXT,imageURL TEXT,imageFilename TEXT, deleted INT,json TEXT,duplicate INT)")
  })
}

TumblrConnection.prototype.insertSQLite3Database = function (){
  if (this.sqliteDB === {}){
    console.log(this)
    throw new Error(' sqliteDB not initialized')
  }
  var stmt = this.sqliteDB.prepare("INSERT INTO Tumblr VALUES (?,?,?,?)")
  stmt.run(this.tumblrName,post,url,false)
  stmt.finalize()
}

TumblrConnection.prototype.bulkInsertSQLite3Database = function(postArray) {
  var that = this
  if (this.sqliteDB === {}
    || typeof this.sqliteDB === 'undefined'){
    //    console.log(this)
    //    console.log("this.sqliteDB:"+this.sqliteDB)
    throw new Error('sqliteDB not initialized')
  }
  //  console.log("bulkinsert")

  //console.log(this.sqliteDB)
  var stmt = this.sqliteDB.prepare("INSERT INTO Tumblr VALUES (?,?,?,?,?,?,?)") // I get SQLITE_BUSY: database is locked; I know I've gotten this message before, doesn't appear to be a solution https://github.com/mapbox/node-sqlite3/issues/9 I think setting the database to wal mode fixed things where I saw it before, but am not sure I can do that in node.
  //console.log(postArray)
  postArray.forEach(function(element,index,fullArray) {
    //console.log("bulkinst:"+element.element.alt_sizes[0].url+":"+element.slug+":"+element.fullPost)
    //console.log("bulkinst:"+element.fullPost)
    //console.log("ele.ele.pho:"+element.element.photos)
    //    console.log("ele.ele:"+element.element)
    if (typeof element.element !== 'undefined'
      && typeof element.element.alt_sizes !== 'undefined'
      && element.element.alt_sizes.length > 0) {
      that.sqliteDB.serialize(function(){
        var resultCount = 0
        //console.log(this.tumblrName+" "+element.slug+" "+element.element.alt_sizes[0].url+" "+false+" "+element.fullPost)
        var url = element.element.alt_sizes[0].url.split('/')
        var imageFilename = url[url.length - 1]
        that.sqliteDB.each("SELECT COUNT(*) FROM Tumblr WHERE imageFilename = '"+imageFilename+"'",function(err,row) {
          if (err) {
            console.log(err)
          } else {
            resultCount = row.count
            console.log(row.count)
          }
        })
          stmt.run(this.tumblrName,element.slug,element.element.alt_sizes[0].url,imageFilename,false,JSON.stringify(element.fullPost),/*duplicate*/resultCount)
      })
    } else {
      stmt.run(this.tumblrName,element.slug,"oo",false,element.fullPost)
      console.log('no alt_sizes')
    }
  })
  stmt.finalize()
  this.sqliteDB.close()
}

TumblrConnection.prototype.checkImageFileExistenceFromSQLite3Database = function () {
  //given a constructed image filename, deconstruct to parts and query based on that
  // this.sqliteDB("SELECT count(*) from Tumblr where name = , post = ,imageURL = ", function(err,row) {  })
}

TumblrConnection.prototype.closeSQLite3Database = function() {
  this.sqliteDB.close()
}
//create another library to handle creation of the db?

TumblrConnection.prototype.checkDiskSpace = function () {
  //console.log("check")
  var that =this
  diskspace.check('/home', function (err, total, free, status) {
    //    console.log(total+" free:"+free)
    //  console.log("total:"+total+" free:"+free)
    if (free<that.diskSpaceMinimum) {
      throw new Error("Disk Space too low.\n"+free+" bytes required\n"+that.diskSpaceMinimum+" bytes free.")
      
    } else {
      //      console.log("free")
      //    console.log(free)
      //  console.log(that.diskSpaceMinimum)
    }
  });
}


module.exports = TumblrConnection
// function(tumblrURL) {
//   return new TumblrConnection(tumblrURL)
// }



//todo: bypass the API and grab rss feeds.
//todo: allow specification of the ouptut directory
//todo: save post to a separate db with tumblrName and slug; otherwise repeating saving of post.
//todo: readdir vs fileexists; or download all to a temp dir then post process. or get all file names, compare to those present in a directory listing

