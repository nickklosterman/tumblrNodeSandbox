[ Tumblr API V2](https://www.tumblr.com/docs/en/api/v2)

[SO Questions tagged 'tumblr'](http://stackoverflow.com/questions/tagged/tumblr)

[Tumblr Engineering](engineering.tumblr.com/)

[Tumblr Developer Center](https://www.tumblr.com/developers)

[Tubmlr Oath Apps ](https://www.tumblr.com/oauth/apps)

[Developers Tumblr](developers.tumblr.com/)

[Tumblr's o-fish api implementation in JS (NPM) ](https://www.npmjs.org/package/tumblr.js)
Their api, although it passes all their tests, still gives me 401 errors when trying to hit user.following
When running their [console app](https://api.tumblr.com/console/calls/user/info) I received 401 errors as well. 

[Tumblr's o-fish api implementation in JS (Github) ](https://github.com/tumblr/tumblr.js)

[Hoardr - Download all your liked Tumblr images.(NPM) ](https://www.npmjs.org/package/hoardr)

[Hoardr - Download all your liked Tumblr images.(GH) ](https://github.com/gvn/hoardr)

[Tumburglar - Utility library for getting non-OAuth Tumblr data painlessly (NPM)](https://www.npmjs.org/package/tumburglar)

[Tumburglar - Utility library for getting non-OAuth Tumblr data painlessly (NPM)](http://github.com/wayspurrchen/tumburglar.git)

[Node Tumblr Package on NPM](https://www.npmjs.org/package/tumblr)

API Keys
=======
Add your api keys from [tumblr](http://www.tumblr.com/oauth/register) as environment variables. I stuck mine in my local ~/.bash_profile.
```
export TUMBLR_CONSUMER_KEY=''
export TUMBLR_SECRET_KEY=''
export TUMBLR_TOKEN=''
export TUMBLR_TOKEN_SECRET=''	
```    
Source your ~/.bash\_profile (`source ~/.bash_profile`) so that you can access the keys. 
If you don't source your file you will get a 401 error when attempting to access the api.

tumblr.jsTest
=============
Sandbox for playing with [Tumblr.js](https://www.npmjs.org/package/tumblr.js). As stated above, it appears as if all functionality is implemented, but not currently working.

tumblrTest
==========
Sandbox for [Tumblr](https://www.npmjs.org/package/tumblr). I started playing here but abandoned it when I thought it wasn't correctly implementing the api calls due to the 401 responses I was getting.