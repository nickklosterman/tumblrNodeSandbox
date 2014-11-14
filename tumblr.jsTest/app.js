var fs = require('graceful-fs'),
    request = require('request')

var tumblr = require('tumblr.js');
var sqlite3 = require("sqlite3").verbose() //is there a way to only condiitonally include this as all users won't need it?

//var diskspace = require('diskspace')

function TumblrConnection(parameters){ 
  this.tumblrName=parameters['tumblrName']
  if (typeof parameters['tumblrName'] === 'undefined'){
    throw new Error('Missing required parameter: tumblrName.');
  }
  this.tumblrURL=this.tumblrName+".tumblr.com" //naive url grabbing
  this.client = tumblr.createClient({
    consumer_key: process.env.TUMBLR_CONSUMER_KEY,
    consumer_secret: process.env.TUMBLR_SECRET_KEY, 
    token: process.env.TUMBLR_TOKEN,
    token_secret: process.env.TUMBLR_TOKEN_SECRET
  });

  // disk space minimum to check for and key off of
  this.diskspaceMinimum = (parameters['diskspaceMinimum']) ? parameters['diskspaceMinimum'] : 10

  // file specifiying the sqlite database 
  this.sqliteDatabaseFile = (parameters['sqliteDatabaseFile']) ? parameters['sqliteDatabaseFile'] : ''

  // sqlite database connector variable
  if(this.sqliteDatabaseFile !== ''){
    //  console.log(this.sqliteDatabaseFile)
    this.sqliteDB = new sqlite3.Database(this.sqliteDatabaseFile)
    //    console.log(this.sqliteDB)
    // this.sqliteDB = {}
  } else {
    console.log("sqliteDB not initialized")
  }
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
			   //                             that.saveFile(element,slug);//call ourself again if there was an error (mostlikely due to hitting the server too hard)
			   //use settimeout and call yourself?
		         }
                       })
      imageStream.on('error',function(error) {
        if (error) {
          console.log("imageStream error:"+error)
          //	    that.saveFile(element,slug);//call ourself again if there was an error (mostlikely due to hitting the server too hard)
        }
      })
      imagerequest.pipe(imageStream)
    }
  }
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

TumblrConnection.prototype.checkDiskSpace = function() {
}


module.exports = TumblrConnection
// function(tumblrURL) {
//   return new TumblrConnection(tumblrURL)
// }


//todo check disk space  use : https://www.npmjs.org/package/diskspace
//todo: bypass the API and grab rss feeds.
//todo allow specification of the ouptut directory