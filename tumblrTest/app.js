var tumblr = require('tumblr');

var oauth = {
  consumer_key: process.env.TUMBLR_CONSUMER_KEY,
  consumer_secret: process.env.TUMBLR_SECRET_KEY, 
  token: process.env.TUMBLR_TOKEN,
  token_secret: process.env.TUMBLR_TOKEN_SECRET
};

// console.log( process.env.TUMBLR_CONSUMER_KEY)
// console.log( process.env.TUMBLR_SECRET_KEY)
// console.log( process.env.TUMBLR_TOKEN)
// console.log( process.env.TUMBLR_TOKEN_SECRET)

//djinnius ottoghetto
var blog = new tumblr.Blog('pinuparena.tumblr.com', oauth);

// blog.text({limit: 5}, function(error, response) {
//   if (error) {
//     throw new Error(error);
//   }

//   console.log(response.posts);
// });

blog.photo({limit: 5}, function(error, response) {
  if (error) {
    throw new Error(error);
  }
  
  //  console.log(response.posts);
  response.posts.forEach(function(element,index,fullArray){
    element.photos.forEach(function(element,index,fullArray){
      console.log(element.alt_sizes[0]) //appears as if  slot 0 hsa the highest res image.
    })
  })
});

var user = new tumblr.User(oauth);

// user.info(function(error, response) {
//   if (error) {
//     throw new Error(error);
//   }

//   console.log(response.user);
// });