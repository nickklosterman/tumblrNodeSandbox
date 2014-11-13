var fs = require('graceful-fs'),
    request = require('request')

var tumblr = require('tumblr.js');

// var client = new tumblr.Client({
//     // ...
// });
// Example

// Show user's blog names
// client.userInfo(function (err, data) {
//   //client.following(function (err, data) {
//   if (err) {
//     console.log(err)
//   } else {
//     data.blogs.forEach(function (blog) {
//       console.log(blog.name);
//     });
//   }
// });
function TumblrConnection(name){
    this.name=name
    this.blog=name+".tumblr.com"
    this.client = tumblr.createClient({
	consumer_key: process.env.TUMBLR_CONSUMER_KEY,
	consumer_secret: process.env.TUMBLR_SECRET_KEY, 
	token: process.env.TUMBLR_TOKEN,
	token_secret: process.env.TUMBLR_TOKEN_SECRET
    });
    
}

TumblrConnection.prototype.savePostImages = function() {
  var that = this
  this.client.posts(this.blog, function(err,data) {
    if (err) {
      console.log(that.blog+"-"+err)
    } else {
      //    console.log(data)
      data.posts.forEach(function(element,index,fullArray) {
        var slug  = element.slug
        if (typeof element.photos !== 'undefined') {
          //        saveFile(element)
          element.photos.forEach(function(element,index,fullArray) {
            that.saveFile(element,slug)
            // var splitUrl = (element.alt_sizes[0].url).split('/')
            // var imageFilename= splitUrl[splitUrl.length-1]
            // console.log(slug+"_"+imageFilename)
            //           console.log(element.alt_sizes[0])
          })
        }
      })
      // data.blogs.forEach(function (blog) {
      //     console.log(blog.name);
      // });
    }
  })
}


TumblrConnection.prototype.saveFile = function(element,slug){
  if (typeof element.alt_sizes !== 'undefined' && element.alt_sizes.length > 0) {
    var url = element.alt_sizes[0].url
    var splitURL = element.alt_sizes[0].url.split('/')
    var imageFilename = splitURL[splitURL.length-1]
    var filename=this.name+"_"+slug+"_"+imageFilename
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

module.exports = TumblrConnection
// function(blog) {
//   return new TumblrConnection(blog)
// }


//todo check disk space  use : https://www.npmjs.org/package/diskspace