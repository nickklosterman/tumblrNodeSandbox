var TC=require('./app.js')

// [1,2,3,4,5].forEach(function(element,index,fullArray) {
// console.log(element)
// })

// fail
// ['1','2','3','4','5'].forEach(function(element,index,fullArray) {
// console.log(element)
// })

// fail
// ["1","2","3","4","5"].forEach(function(element,index,fullArray) {
// console.log(element)
// })

//to get this list of all the people I'm following, I logged in via a web browser and copied the list into a file. I then ran `sort file.txt | uniq > output.txt`. I then opened the file and removed the `Unfollow` and `Updated X minutes/hours/days ago`. I then did a `query-replace-regexp` `^\([A-Za-z0-9\-]+\)$` -> `'\1',`  and then I did a `replace-string` on `^J` (C-q C-j) -> `` to put them all on one line. I removed the final `,` and placed `[]` around it to make it an array and `insert-file` the results here.
var foo = ['8bitmonkey','a1courier','alchemichael','alexhchung','alexkonstad','amyreeder','anthonyholden','archiemcphee','argovi','artbychamba','artissimo','azertip','bdligneclaire','bentanart','bethanyberg','billotomo','blackyjunkgallery','breebird33','brianmichaelbendis','cartoonhangover','cartoonretro','ca-tsuka','cclog','chachachabela','charlestan','cheeks-74','chhuy-ing','chiumonster','chrispimentel','chrissamnee','chuanong','chuwenjie','coryloftis','darcysart','darksideof','davidpetersenart','dheezen','dianmz','dimisfit','drawstin','drdavidmrmack','ducksofrubber','eecks','elioli-art','emengel','emersontung','ericcanete','evonyo','fabien-mense','fash-cafe','feelingfairyish','foosweechin','fresherluke','ful-fisk','funimationentertainment','gallery1988','giorgiobaroni','glenbrogan','gobi-baptiste-gaubert','gorrem','grizandnorm','hannakdraws','theartofanimation','hifructosemag','hlhughes','ianbrooks','ifm-paris','ikkoros','inkmountain','inprnt','isthatwhatyoumint','it8bit','jarvisink','jigokuen','jimjam-art','joslinlapin','joverine','jtowndraws','juxtapozmagazine','kassandraheller','kevinnelsonart','kheleksul','kinopia','kovvu','kr0npr1nz','kulorbandit','kylebaer','ladugard','ladytruds','la-vaniteuse','leeshit','legrawr','lewsteph','littlepaperforest','loish','luckybeezz','maggins','mahmudasrar','mdartstudio','milkmanner','milonogiannis','miltklingensmith','mimiadraws','mitografia','mohammadyazid','momochanners','moonbotstudios','mrgossie','mrjakeparker','mtakara','ncrossanimation','nicolasrix','nomorepros','obzejta','onedayfour','otgw','ottoghetto','ozguryildirim','pacalin','pascalcampion','patrikthevampire','pigswithcrayons','pinuparena','pixlotl','probertson','processresource','rafchu','raultrevino','sachinteng','sangkupeh','sarapichelli','scottwatanabe','sekigan','shinypant','shiyoonkim','silversd','sirpangur','skirtzzz','sohfia','specialk73','sporkii','stephanieratt','stevencrewniverse','strangewood','susandrawsthings','takitakos','tealin','theonides','tinycartridge','tofuvi','tooninator','tophatandgoggles','trainerklc','ttyto-alba','t-wei','veesdumpingrounds','waldemar-kazak','wannabeanimator','why-i-love-comics','wyattthenerd','xombiedirge','yesthisisaaron','zobobafoozie','paulsmithdraws','victoriaying']

                            
var foo2 = ['rafchu','fresherluke','milonogiannis','alchemichael','veesdumpingrounds','metalshell','lewsteph','scottwatanabe','jigokuen','jimjam-art','darcysart','kevinnelsonart','bentanart','pr1ps','jtowndraws','kr0npr1nz','chachachabela','chrissamnee','mitografia','dianmz','joverine','artissimo','alexkonstad','cheeks-74','mrjakeparker','billotomo','davidpetersenart','dheezen','gobi-baptiste-gaubert','ca-tsuka','evonyo','amyreeder','bentanart','anthonyholden','sirpangur','skirtzzz','shiyoonkim','sarapichelli','ottoghetto','probertson','loish','kylebaer','ttyto-alba','pixlotl','cartoonretro','gorrem','chhuy-ing','mtakara','raultrevino']

var choice = 7
switch(choice){
  case 1:
  foo.forEach(function(element,index,fullArray){
    var client  = new TC({tumblrName:element})
    client.savePostImages();
  })
  break;

  case 2:
  var client = new TC('rafchu.tumblr.com')
  client.savePostImages()
  break;

  case 3:
  foo.forEach(function(element,index,fullArray){
    var client  = new TC({tumblrName:element,sqliteDatabaseFile:'TumblrDB.sqlite3'})
    client.setupSQLite3Database()
    client.savePostsToSQLiteDatabase()
  })
  break;

  case 4:
  var client  = new TC({tumblrName:'rafchu',sqliteDatabaseFile:'TumblrDB.sqlite3'})
  client.setupSQLite3Database()
  client.savePostsToSQLiteDatabase()
  break;

  case 5:
  foo.forEach(function(element,index,fullArray){
    var client  = new TC({tumblrName:element})
    client.analyzeNameLengths();
  })
  break;

  case 6:
  foo.forEach(function(element,index,fullArray){
    var client  = new TC({tumblrName:element})
    client.analyzeNameLengths();
  })
  break;
  
  case 7:
  console.log(process.env.MARIA_HOST)
  console.log(process.env.MARIA_USER)
  console.log(process.env.MARIA_PASSWORD)
  console.log(process.env.MARIA_DATABASE)
  var client  = new TC({tumblrName:'rafchu',
                        mariaHost:process.env.MARIA_HOST,
                        mariaUser:process.env.MARIA_USER,
                        mariaPassword:process.env.MARIA_PASSWORD,
                        mariaDatabase:process.env.MARIA_DATABASE})
  //client.insertDataIntoMariaDatabase()
  //  client.closeMariaDatabase()
  client.mariaInsert();
//  client.mariaEnd();
  break;
}

//fdupes -d -N . //use fdupes to automatically delete dupes, preserving the first one.