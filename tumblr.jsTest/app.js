var fs = require('fs'),
request = require('request')

var tumblr = require('tumblr.js');
var client = tumblr.createClient({
  consumer_key: process.env.TUMBLR_CONSUMER_KEY,
  consumer_secret: process.env.TUMBLR_SECRET_KEY, 
  token: process.env.TUMBLR_TOKEN,
  token_secret: process.env.TUMBLR_TOKEN_SECRET
});

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

client.posts('pinuparena.tumblr.com', function(err,data) {
  if (err) {
    console.log(err)
  } else {
//    console.log(data)
    data.posts.forEach(function(element,index,fullArray) {
      var slug  = element.slug
      if (typeof element.photos !== 'undefined') {
//        saveFile(element)
         element.photos.forEach(function(element,index,fullArray) {
           saveFile(element,slug)
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

function saveImages(element){

}

function saveFile(element,slug){
  var url = element.alt_sizes[0].url
  var splitURL = element.alt_sizes[0].url.split('/')
  var imageFilename = splitURL[splitURL.length-1]
  var filename=slug+"_"+imageFilename
  var that = this;
  if ( fs.existsSync(filename) ) {
    console.log(filename+" already exists. Skipping.")
  } else {
    var imageStream=fs.createWriteStream(filename)
    imageStream.on('close',function(){
      console.log("Writing of "+filename+" done.")
    })

    var options = {url:url,headers:{ 'User-Agent':'request'}}
    //do http requests for the image count against our limit? They aren't using the api,
    //console.log(options) 
    var imagerequest=request(options,function(err,resp,body) {
                       if (err){
		         if (err.code === 'ECONNREFUSED') {
			   console.error(url+'Refused connection');
		         } else if (err.code==='ECONNRESET') {
			   console.error(url+'reset connection')
		         } else if (err.code==='ENOTFOUND') {
			   console.error(url+'enotfound')
		         } else {
			   console.log(url+err);
			   console.log(err.stack);
		         }
                         this.saveFile(url,filename);//call ourself again if there was an error (mostlikely due to hitting the server too hard)
		       }
                     })
    imageStream.on('error',function() {
      if (error) {
        console.log(error)
      }
    })
    imagerequest.pipe(imageStream)
  }
}

