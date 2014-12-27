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

//to get this list of all the people I'm following, I logged in via a web browser and copied the list into a file. I then ran `grep -v Updated file.txt| sort  | uniq > output.txt`. I then opened the file and removed the `Unfollow` and `Updated X minutes/hours/days ago`. I then did a `query-replace-regexp` `^\([A-Za-z0-9\-]+\)$` -> `'\1',`  and then I did a `replace-string` on `^J` (C-q C-j) -> `` to put them all on one line. I removed the final `,` and placed `[]` around it to make it an array and `insert-file` the results here.

//remove duplicates:
//nodupe_arr = arr.filter( function( item, index, inputArray ) {
//return inputArray.indexOf(item) == index;
//});

var foo = ['8bitmonkey','a1courier','alchemichael','alexhchung','alexkonstad','amyreeder','anthonyholden','archiemcphee','argovi','artbychamba','artissimo','azertip','bdligneclaire','bentanart','bethanyberg','billotomo','blackyjunkgallery','breebird33','brianmichaelbendis','cartoonhangover','cartoonretro','ca-tsuka','cclog','chachachabela','charlestan','cheeks-74','chhuy-ing','chiumonster','chrispimentel','chrissamnee','chuanong','chuwenjie','coryloftis','darcysart','darksideof','davidpetersenart','dheezen','dianmz','dimisfit','drawstin','drdavidmrmack','ducksofrubber','eecks','elioli-art','emengel','emersontung','ericcanete','evonyo','fabien-mense',/*'fash-cafe',*/'feelingfairyish','foosweechin','fresherluke','ful-fisk','funimationentertainment','gallery1988','giorgiobaroni','glenbrogan','gobi-baptiste-gaubert','gorrem','grizandnorm','hannakdraws','theartofanimation','hifructosemag','hlhughes','ianbrooks','ifm-paris','ikkoros','inkmountain','inprnt','isthatwhatyoumint','it8bit','jarvisink','jigokuen','jimjam-art','joslinlapin','joverine','jtowndraws','juxtapozmagazine','kassandraheller','kevinnelsonart','kheleksul','kinopia','kovvu','kr0npr1nz','kulorbandit','kylebaer','ladugard','ladytruds','la-vaniteuse','leeshit','legrawr','lewsteph','littlepaperforest','loish','luckybeezz','maggins','mahmudasrar','mdartstudio','milkmanner','milonogiannis','miltklingensmith','mimiadraws','mitografia','mohammadyazid','momochanners','moonbotstudios','mrgossie','mrjakeparker','mtakara','ncrossanimation','nicolasrix','nomorepros','obzejta','onedayfour','otgw','ottoghetto','ozguryildirim','pacalin','pascalcampion','patrikthevampire','pigswithcrayons','pinuparena','pixlotl','probertson','processresource','rafchu','raultrevino','sachinteng','sangkupeh','sarapichelli','scottwatanabe','sekigan','shinypant','shiyoonkim','silversd','sirpangur','skirtzzz','sohfia','specialk73','sporkii','stephanieratt','stevencrewniverse','strangewood','susandrawsthings','takitakos','tealin','theonides','tinycartridge','tofuvi','tooninator','tophatandgoggles','trainerklc','ttyto-alba','t-wei','veesdumpingrounds','waldemar-kazak','wannabeanimator','why-i-love-comics','wyattthenerd','xombiedirge','yesthisisaaron','zobobafoozie','paulsmithdraws','victoriaying','8bitmonkey','adigranovart','afuchan','alexhchung','animationplayground','appologia-universe','artagainstsociety','artbooksnat','artofnicomarlet','aszabla','auroreblackcat','authorproject-kenziechapman','babsdraws','badoum','barbaracanepa','bear1na','beautiful-wildlife','beckycloonan','bitchplanet','blindsprings','bobbypontillas','bouletcorp','brianmichaelbendis','brotherhoodoftofuv2','bryankonietzko','captain-laowa','cartoonretro','celorart','charactermodel','charamath','chhuy-ing','clairewendlingblog','clemenceperrault','cliffchiang','cliobablio','colours-theory','comicartappreciation','comicsbeat','comixology','comixologyfrance','coversdaily','creativehouses','crossconnectmag','cuhelski','curioos-arts','davidlafuente','davidmarquez','deantrippe','denismedri','deviantart','doodlebags','drdavidmrmack','duss005','elgunto','esadribic','etall','fabianmonk','fionastaples','francismanapul','gigidigi','giorgiobaroni','gnarlycovers','gorrem','howtolovecomics','ibmblr','idrawnintendo','idrawonlunchbags','idwcomics','illuspiration','imagecomics','inkwings','jameshance','jasonlatour','jbaxteranimator','jimcheungart','joedrawsstuff','joekeatinge','jonathonwallach','jsrossbach','juliendruant','just-art','karenhallion','karlkerschl','katikut','kendrasketch','kevinwada','knightandknights','kristaferanka','kylebaer','labofakto','la-vaniteuse','lebelgebd','leegarbettart','leinilyu','leo37','leseanthomas','letangles','lewistrondheim','lizclimo','losdemoniosdetony','lunchbagart','madeinhexels','maisonimmonen','margueritesauvage','marramew','marvel1980s','mikeyamada2','miles-johnston','monchocolachaux','moremonger','nickdragotta','nikoneda','nunoplati','nvm-illustration','ollymoss','pascalcampion','paulmaybury','paulrenaud','paulsmithdraws','peahart','philnoto','pigswithcrayons','poorcraftcomic','ramonvillalobos','raultrevino','robertvalley','royalboiler','rufftoon','ryanlangdraws','ryanottley','saint-for-rent','sebaanacho','selectedillustrations','sequentialsmart','shinmakoss','sketchinfun','sketchshark','skottieyoung','snackbagdad','sorcerersskull','sosouroquette','sosuperawesome','soufflevent','stevencrewniverse','supersonicart','theanimationarchive','thebristolboard','thegirlandthesoul','thewoodencrown','threadless','tobycypress','tomsawyr','t-wei','urbanbarbarian','vaitranquillo','valerioschiti','victongai','victoriaying','victoriousvocabulary']

foo2=['wakkawa','westcoastavengers','why-i-love-comics','zirese','2dbean','8bitmonkey','adigranovart','afuchan','aimeezhou','alexhchung','alliebirdseed','amandakihlstrom','animationplayground','apesandbabes','appologia-universe','artagainstsociety','artbooksnat','artofnicomarlet','aszabla','auroreblackcat','authorproject-kenziechapman','babsdraws','badoum','barbaracanepa','bear1na','beautiful-wildlife','beckycloonan','beiibis','bethcraig','bitchplanet','blindsprings','blythedockham','bobbypontillas','bookofrat','bouletcorp','brentschoonover','brianmichaelbendis','brotherhoodoftofuv2','bryankonietzko','captain-laowa','cartoonretro','celorart','charactermodel','charamath','charlesbad','chhuy-ing','chrislamart','clairewendlingblog','clemenceperrault','cliffchiang','cliobablio','codaleia','coelacanthtea','colours-theory','comicartappreciation','comicbookdojo','comicsbeat','comixology','comixologyfrance','coversdaily','creativehouses','crossconnectmag','cuhelski','curioos-arts','davidlafuente','davidmarquez','deantrippe','denismedri','deviantart','doodlebags','drawnbydana','drdavidmrmack','duss005','ecole-gobelins','elgunto','esadribic','etall','fabianmonk','fionastaples','francismanapul','fuckyeahconceptcarz','fuckyeahfrankcho','gabbyzapata','gelipetorres','gigidigi','giorgiobaroni','gnarlycovers','gorrem','hammpix','heart-without-art-is-just-he','howtolovecomics','ibmblr','idrawnintendo','idrawonlunchbags','idwcomics','illuspiration','imagecomics','inkwings','iraville','iroga','jameshance','jasonlatour','jbaxteranimator','jenniferely','jfsouzatoons','jimcheungart','joedrawsstuff','joekeatinge','jonathonwallach','jp-from-vulcain','jsrossbach','juliendruant','just-art','justinridgeart','kababis','karenhallion','karlkerschl','katikut','kendrasketch','kenimation','kevinwada','kidskribble','kinuck','knightandknights','kristaferanka','kristinkemper','kylebaer','labofakto','la-vaniteuse','lebelgebd','leegarbettart','leinilyu','leo37','leseanthomas','letangles','lewistrondheim','lisaveeee','lizclimo','losdemoniosdetony','lunchbagart','madeinhexels','maisonimmonen','margueritesauvage','mariposa-nocturna','marramew','marvel1980s','mikeyamada2','mikuloctopus','miles-johnston','moaniecat','monchocolachaux','moremonger','munoa13','nickdragotta','nikoneda','nunoplati','nvm-illustration','ollymoss','originalsinfest','pascalcampion','patrickballesteros','paulmaybury','paulrenaud','paulsmithdraws','peahart','philnoto','pigswithcrayons','poorcraftcomic','ramonvillalobos','raultrevino','requiemdusk','robertvalley','royalboiler','rubyspoon','rufftoon','ryanlangdraws','ryanottley','ryanstegman','saint-for-rent','schmoesi','sebaanacho','selectedillustrations','sequentialsmart','shinmakoss','sketchinfun','sketchshark','skottieyoung','skullbashgato','snackbagdad','snarkies','sorcerersskull','sosouroquette','sosuperawesome','soufflevent','soyopanda','stevencrewniverse','supersonicart','teemujuhani','theanimationarchive','theartofgaberose','thebristolboard','thegirlandthesoul','thepaulrichards','thewoodencrown','threadless','timheitz','tobycypress','tomfowlerddd','tomfowlerstuff','tomsawyr','torianne00','tunabora','t-wei','urbanbarbarian','vaitranquillo','valerioschiti','victongai','victoriaying','victoriousvocabulary','vinceaparo','wakkawa','westcoastavengers','why-i-love-comics','wopanda','yingjue','zirese']

foo2=['adultswimcentral','adventuretime','advicecomics','aimeezhou','alexandrediboine','aliceduke','alicexz','alliebirdseed','amandakihlstrom','anais-maamar','andrewmar','archidisiac','asurocksportfolio','aurrytan','avasdemon','bendrawslife','bethcraig','boheeseong','brandnewnostalgia','carolinegariba','cartoonpolitics','chrishoughtonart','colemanengle','colleencoover','comicbookcovers','comicsworkbook','comixwarriors','couscousblr','craigknowles','cxcfestival','danbeaulieu','davidyardin','deep-dark-fears','djibmp','dshalv','elliotcrutchley','endeden','everking','fantagraphics','francoyovich','freelance-sharkbaby','fryingtoilet','gabbyzapata','gailsimone','gelipetorres','gmyi','go-workout-now','goworkouttv','gurihiru','heavycreamcomic','hotbloodcomic','joelcarroll','joeymajdali','joy-ang','jp-from-vulcain','laserena','lifeanim8ed','mallius','mankyseemankydo','marlene-beaube','mbarq','mckelvie','mikuloctopus','mokeydraws','muttscomicsofficial','nadya-mira','nanlawson','neilgooge','noodleztime','orpheelin','pernilleoe','pointystix','reiquintero','reneechio','requiemdusk','rileyrossmo','sibyllinesketchblog','sonny0029','stinedraws','thingsiphotoshopped','tonybrescini','untorch','vignalistudio','woofycakes','zatransis','zenpencils','zorinvasili']


var foo2 = ['rafchu','fresherluke','milonogiannis','alchemichael','veesdumpingrounds','metalshell','lewsteph','scottwatanabe','jigokuen','jimjam-art','darcysart','kevinnelsonart','bentanart','pr1ps','jtowndraws','kr0npr1nz','chachachabela','chrissamnee','mitografia','dianmz','joverine','artissimo','alexkonstad','cheeks-74','mrjakeparker','billotomo','davidpetersenart','dheezen','gobi-baptiste-gaubert','ca-tsuka','evonyo','amyreeder','bentanart','anthonyholden','sirpangur','skirtzzz','shiyoonkim','sarapichelli','ottoghetto','probertson','loish','kylebaer','ttyto-alba','pixlotl','cartoonretro','gorrem','chhuy-ing','mtakara','raultrevino']

var allTumblrs = ['8bitmonkey','a1courier','alchemichael','alexhchung','alexkonstad','amyreeder','anthonyholden','archiemcphee','argovi','artbychamba','artissimo','azertip','bdligneclaire','bentanart','bethanyberg','billotomo','blackyjunkgallery','breebird33','brianmichaelbendis','cartoonhangover','cartoonretro','ca-tsuka','cclog','chachachabela','charlestan','cheeks-74','chhuy-ing','chiumonster','chrispimentel','chrissamnee','chuanong','chuwenjie','coryloftis','darcysart','darksideof','davidpetersenart','dheezen','dianmz','dimisfit','drawstin','drdavidmrmack','ducksofrubber','eecks','elioli-art','emengel','emersontung','ericcanete','evonyo','fabien-mense','feelingfairyish','foosweechin','fresherluke','ful-fisk','funimationentertainment','gallery1988','giorgiobaroni','glenbrogan','gobi-baptiste-gaubert','gorrem','grizandnorm','hannakdraws','theartofanimation','hifructosemag','hlhughes','ianbrooks','ifm-paris','ikkoros','inkmountain','inprnt','isthatwhatyoumint','it8bit','jarvisink','jigokuen','jimjam-art','joslinlapin','joverine','jtowndraws','juxtapozmagazine','kassandraheller','kevinnelsonart','kheleksul','kinopia','kovvu','kr0npr1nz','kulorbandit','kylebaer','ladugard','ladytruds','la-vaniteuse','leeshit','legrawr','lewsteph','littlepaperforest','loish','luckybeezz','maggins','mahmudasrar','mdartstudio','milkmanner','milonogiannis','miltklingensmith','mimiadraws','mitografia','mohammadyazid','momochanners','moonbotstudios','mrgossie','mrjakeparker','mtakara','ncrossanimation','nicolasrix','nomorepros','obzejta','onedayfour','otgw','ottoghetto','ozguryildirim','pacalin','pascalcampion','patrikthevampire','pigswithcrayons','pinuparena','pixlotl','probertson','processresource','rafchu','raultrevino','sachinteng','sangkupeh','sarapichelli','scottwatanabe','sekigan','shinypant','shiyoonkim','silversd','sirpangur','skirtzzz','sohfia','specialk73','sporkii','stephanieratt','stevencrewniverse','strangewood','susandrawsthings','takitakos','tealin','theonides','tinycartridge','tofuvi','tooninator','tophatandgoggles','trainerklc','ttyto-alba','t-wei','veesdumpingrounds','waldemar-kazak','wannabeanimator','why-i-love-comics','wyattthenerd','xombiedirge','yesthisisaaron','zobobafoozie','paulsmithdraws','victoriaying','8bitmonkey','adigranovart','afuchan','alexhchung','animationplayground','appologia-universe','artagainstsociety','artbooksnat','artofnicomarlet','aszabla','auroreblackcat','authorproject-kenziechapman','babsdraws','badoum','barbaracanepa','bear1na','beautiful-wildlife','beckycloonan','bitchplanet','blindsprings','bobbypontillas','bouletcorp','brianmichaelbendis','brotherhoodoftofuv2','bryankonietzko','captain-laowa','cartoonretro','celorart','charactermodel','charamath','chhuy-ing','clairewendlingblog','clemenceperrault','cliffchiang','cliobablio','colours-theory','comicartappreciation','comicsbeat','comixology','comixologyfrance','coversdaily','creativehouses','crossconnectmag','cuhelski','curioos-arts','davidlafuente','davidmarquez','deantrippe','denismedri','deviantart','doodlebags','drdavidmrmack','duss005','elgunto','esadribic','etall','fabianmonk','fionastaples','francismanapul','gigidigi','giorgiobaroni','gnarlycovers','gorrem','howtolovecomics','ibmblr','idrawnintendo','idrawonlunchbags','idwcomics','illuspiration','imagecomics','inkwings','jameshance','jasonlatour','jbaxteranimator','jimcheungart','joedrawsstuff','joekeatinge','jonathonwallach','jsrossbach','juliendruant','just-art','karenhallion','karlkerschl','katikut','kendrasketch','kevinwada','knightandknights','kristaferanka','kylebaer','labofakto','la-vaniteuse','lebelgebd','leegarbettart','leinilyu','leo37','leseanthomas','letangles','lewistrondheim','lizclimo','losdemoniosdetony','lunchbagart','madeinhexels','maisonimmonen','margueritesauvage','marramew','marvel1980s','mikeyamada2','miles-johnston','monchocolachaux','moremonger','nickdragotta','nikoneda','nunoplati','nvm-illustration','ollymoss','pascalcampion','paulmaybury','paulrenaud','paulsmithdraws','peahart','philnoto','pigswithcrayons','poorcraftcomic','ramonvillalobos','raultrevino','robertvalley','royalboiler','rufftoon','ryanlangdraws','ryanottley','saint-for-rent','sebaanacho','selectedillustrations','sequentialsmart','shinmakoss','sketchinfun','sketchshark','skottieyoung','snackbagdad','sorcerersskull','sosouroquette','sosuperawesome','soufflevent','stevencrewniverse','supersonicart','theanimationarchive','thebristolboard','thegirlandthesoul','thewoodencrown','threadless','tobycypress','tomsawyr','t-wei','urbanbarbarian','vaitranquillo','valerioschiti','victongai','victoriaying','victoriousvocabulary','wakkawa','westcoastavengers','why-i-love-comics','zirese','2dbean','8bitmonkey','adigranovart','afuchan','aimeezhou','alexhchung','alliebirdseed','amandakihlstrom','animationplayground','apesandbabes','appologia-universe','artagainstsociety','artbooksnat','artofnicomarlet','aszabla','auroreblackcat','authorproject-kenziechapman','babsdraws','badoum','barbaracanepa','bear1na','beautiful-wildlife','beckycloonan','beiibis','bethcraig','bitchplanet','blindsprings','blythedockham','bobbypontillas','bookofrat','bouletcorp','brentschoonover','brianmichaelbendis','brotherhoodoftofuv2','bryankonietzko','captain-laowa','cartoonretro','celorart','charactermodel','charamath','charlesbad','chhuy-ing','chrislamart','clairewendlingblog','clemenceperrault','cliffchiang','cliobablio','codaleia','coelacanthtea','colours-theory','comicartappreciation','comicbookdojo','comicsbeat','comixology','comixologyfrance','coversdaily','creativehouses','crossconnectmag','cuhelski','curioos-arts','davidlafuente','davidmarquez','deantrippe','denismedri','deviantart','doodlebags','drawnbydana','drdavidmrmack','duss005','ecole-gobelins','elgunto','esadribic','etall','fabianmonk','fionastaples','francismanapul','fuckyeahconceptcarz','fuckyeahfrankcho','gabbyzapata','gelipetorres','gigidigi','giorgiobaroni','gnarlycovers','gorrem','hammpix','heart-without-art-is-just-he','howtolovecomics','ibmblr','idrawnintendo','idrawonlunchbags','idwcomics','illuspiration','imagecomics','inkwings','iraville','iroga','jameshance','jasonlatour','jbaxteranimator','jenniferely','jfsouzatoons','jimcheungart','joedrawsstuff','joekeatinge','jonathonwallach','jp-from-vulcain','jsrossbach','juliendruant','just-art','justinridgeart','kababis','karenhallion','karlkerschl','katikut','kendrasketch','kenimation','kevinwada','kidskribble','kinuck','knightandknights','kristaferanka','kristinkemper','kylebaer','labofakto','la-vaniteuse','lebelgebd','leegarbettart','leinilyu','leo37','leseanthomas','letangles','lewistrondheim','lisaveeee','lizclimo','losdemoniosdetony','lunchbagart','madeinhexels','maisonimmonen','margueritesauvage','mariposa-nocturna','marramew','marvel1980s','mikeyamada2','mikuloctopus','miles-johnston','moaniecat','monchocolachaux','moremonger','munoa13','nickdragotta','nikoneda','nunoplati','nvm-illustration','ollymoss','originalsinfest','pascalcampion','patrickballesteros','paulmaybury','paulrenaud','paulsmithdraws','peahart','philnoto','pigswithcrayons','poorcraftcomic','ramonvillalobos','raultrevino','requiemdusk','robertvalley','royalboiler','rubyspoon','rufftoon','ryanlangdraws','ryanottley','ryanstegman','saint-for-rent','schmoesi','sebaanacho','selectedillustrations','sequentialsmart','shinmakoss','sketchinfun','sketchshark','skottieyoung','skullbashgato','snackbagdad','snarkies','sorcerersskull','sosouroquette','sosuperawesome','soufflevent','soyopanda','stevencrewniverse','supersonicart','teemujuhani','theanimationarchive','theartofgaberose','thebristolboard','thegirlandthesoul','thepaulrichards','thewoodencrown','threadless','timheitz','tobycypress','tomfowlerddd','tomfowlerstuff','tomsawyr','torianne00','tunabora','t-wei','urbanbarbarian','vaitranquillo','valerioschiti','victongai','victoriaying','victoriousvocabulary','vinceaparo','wakkawa','westcoastavengers','why-i-love-comics','wopanda','yingjue','zirese','adultswimcentral','adventuretime','advicecomics','aimeezhou','alexandrediboine','aliceduke','alicexz','alliebirdseed','amandakihlstrom','anais-maamar','andrewmar','archidisiac','asurocksportfolio','aurrytan','avasdemon','bendrawslife','bethcraig','boheeseong','brandnewnostalgia','carolinegariba','cartoonpolitics','chrishoughtonart','colemanengle','colleencoover','comicbookcovers','comicsworkbook','comixwarriors','couscousblr','craigknowles','cxcfestival','danbeaulieu','davidyardin','deep-dark-fears','djibmp','dshalv','elliotcrutchley','endeden','everking','fantagraphics','francoyovich','freelance-sharkbaby','fryingtoilet','gabbyzapata','gailsimone','gelipetorres','gmyi','go-workout-now','goworkouttv','gurihiru','heavycreamcomic','hotbloodcomic','joelcarroll','joeymajdali','joy-ang','jp-from-vulcain','laserena','lifeanim8ed','mallius','mankyseemankydo','marlene-beaube','mbarq','mckelvie','mikuloctopus','mokeydraws','muttscomicsofficial','nadya-mira','nanlawson','neilgooge','noodleztime','orpheelin','pernilleoe','pointystix','reiquintero','reneechio','requiemdusk','rileyrossmo','sibyllinesketchblog','sonny0029','stinedraws','thingsiphotoshopped','tonybrescini','untorch','vignalistudio','woofycakes','zatransis','zenpencils','zorinvasili','nicolasdelort','rodreisartist','j0elg','petervnguyen','tonycliff','flyingmilkpig','misterwalsh','kwonshell','edderzz','autanimuscaput','brokenlynx21','pryce14','cameron-stewart','paticmak','dwdesign','nebezial-asheri','kurtisweibe','johnnyrocwell','steinerfrommars','shadowlinecomics','benrankel','zdarsky','nickpitarra','jordiecolorsthings','bastien-coolashu','ani-r','iambrao','lenasayaphoum','abbydraws','annaxiin','vanduobones','illustrationeverywhere','inkwings','adrien-gromelle','carrececile','diane-truc','vergani','lepetitfeufollet','thibaultleclercq','oktotally','toniinfante','anzka','sashamutch','tentacleeye','danaterrace','felipesmithart','blackjunkgallery','morganjeske','mirkand','souracid','karladiazc','meredithmcclaren']



var nodupe_arr = allTumblrs.filter( function( item, index, inputArray ) {
//write out the name of duplicates
if (inputArray.indexOf(item) !== index) {
console.log("Dupe:"+item)
}
//filter out duplicates
// return true if the index for the item matches indexOf 
return inputArray.indexOf(item) == index;
});

foo = nodupe_arr

sortedNoDupe = nodupe_arr.sort()
//console.log(sortedNoDupe)
//console.log(allTumblrs.length+":"+sortedNoDupe.length)
//console.log(JSON.stringify(sortedNoDupe))




//set default choice to 1
var choice = 1
if (process.argv[2]) {
    choice = parseInt(process.argv[2])
    console.log(choice)
}

switch(choice){
case 1:
    // loop over all tumblrs and dl images
    foo.forEach(function(element,index,fullArray){
	setTimeout(function() {
	var client  = new TC({tumblrName:element,
                              diskSpaceMinimum:0.5})
	    client.savePostImages();
	},500*index);
    })
    break;

case 2:
    // save all images for one user
    var client = new TC('rafchu.tumblr.com')
    client.savePostImages()
    break;

case 3:

    // attempt at using a sqlite db for use in keeping track of files
    // ran into tooo many processes trying to access the db 
    // when one process had a lock on the db file

    // array of tumblrs attempt at using a sqlite db
    foo.forEach(function(element,index,fullArray){
	var client  = new TC({tumblrName:element,sqliteDatabaseFile:'TumblrDB.sqlite3'})
	client.setupSQLite3Database()
	client.savePostsToSQLiteDatabase()
    })
    break;

case 4:
    // single tumblr attempt at using a sqlite db

    var client  = new TC({tumblrName:'rafchu',sqliteDatabaseFile:'TumblrDB.sqlite3'})
    client.setupSQLite3Database()
    client.savePostsToSQLiteDatabase()
    break;

case 5:
    // Used to determine size of fields for the database schema
    // use one tumblr
    var client  = new TC({tumblrName:'rafchu'})
    client.analyzeNameLengths();
    break;

case 6:
    // Used to determine size of fields for the database schema
    // loop over all tumblrs
    foo.forEach(function(element,index,fullArray){
	var client  = new TC({tumblrName:element})
	client.analyzeNameLengths();
    })
    break;
    
case 7:
    // insert tumblr posts into maria database
    console.log(process.env.MARIA_HOST)
    console.log(process.env.MARIA_USER)
    console.log(process.env.MARIA_PASSWORD)
    console.log(process.env.MARIA_DATABASE)
    //  var client  = new TC({tumblrName:'rafchu',
    //  var client  = new TC({tumblrName:'billotomo',
    var client  = new TC({tumblrName:'cclog',
                          mariaHost:process.env.MARIA_HOST,
                          mariaUser:process.env.MARIA_USER,
                          mariaPassword:process.env.MARIA_PASSWORD,
                          mariaDatabase:process.env.MARIA_DATABASE})
    //client.insertDataIntoMariaDatabase()
    //  client.closeMariaDatabase()
    client.mariaInsert();
    //  client.mariaEnd();
    break;

case 8:
    // query database to find posts which haven't been downloaded and download them.
    var client  = new TC({tumblrName:'rafchu',
                          mariaHost:process.env.MARIA_HOST,
                          mariaUser:process.env.MARIA_USER,
                          mariaPassword:process.env.MARIA_PASSWORD,
                          mariaDatabase:process.env.MARIA_DATABASE})
    client.mariaQuery();
    break;

case 9:
    // scan local directory looking for filenames and decomposing the filename
    // into the tumblr,post,image components
    var client  = new TC({tumblrName:'rafchu'})
    client.scanLocalDirectory()
    break;

case 10:
    // find posts in database but which don't exist in the filesystem, update
    // these records as deleted.
    var client  = new TC({tumblrName:'rafchu',
                          mariaHost:process.env.MARIA_HOST,
                          mariaUser:process.env.MARIA_USER,
                          mariaPassword:process.env.MARIA_PASSWORD,
                          mariaDatabase:process.env.MARIA_DATABASE})

    client.mariaFindFileDeletions()
    break;

case 11:
    // rafchu billotomo sekigan artissimo
    var client  = new TC({tumblrName:'artissimo',
                          mariaHost:process.env.MARIA_HOST,
                          mariaUser:process.env.MARIA_USER,
                          mariaPassword:process.env.MARIA_PASSWORD,
                          mariaDatabase:process.env.MARIA_DATABASE})
    //client.mariaInsert() // insert records into database
    client.mariaInsertAndDownload() //insert records into database and download images 
    //client.mariaQuery() // query database and download new files, mariaInsert followed by mariaQuery could be rolled into one.
    //client.mariaFindFileDeletions()
    //client.scanLocalDirectory()
    break;

case 12:
    // Insert records into database and download images 
    // successfully downloaded images will then update their db record setting the downloaded field to true
    // loop over all tumblrs

    var mariasql = require('mariasql')
    var mariaClient = new mariasql()
    mariaClient.connect({host:process.env.MARIA_HOST,
			 user:process.env.MARIA_USER,
			 password:process.env.MARIA_PASSWORD,
			 db:process.env.MARIA_DATABASE})
    mariaClient.on('connect', function() {
	//console.log('Client connected');
	foo.forEach(function(element,index,fullArray){
	    var client  = new TC({tumblrName:element,
				  mariaClient:mariaClient
				  //   mariaHost:process.env.MARIA_HOST,
				  // mariaUser:process.env.MARIA_USER,
				  // mariaPassword:process.env.MARIA_PASSWORD,
				  // mariaDatabase:process.env.MARIA_DATABASE
				 })

	    client.mariaInsertAndDownload();
	})
    })
	.on('error', function(err) {
	    console.log('Client error: ' + err);
	})
	.on('close', function(hadError) {
	    console.log('Client closed');
	});

    foo.forEach(function(element,index,fullArray){
	var client  = new TC({tumblrName:element,
                              mariaClient:mariaClient
                              //   mariaHost:process.env.MARIA_HOST,
                              // mariaUser:process.env.MARIA_USER,
                              // mariaPassword:process.env.MARIA_PASSWORD,
                              // mariaDatabase:process.env.MARIA_DATABASE
                             })

	client.mariaInsertAndDownload();
    })
    break;

case 13:
    // Test checking of diskspace
    var client  = new TC({tumblrName:'artissimo',
                          diskSpaceMinimum:5.4
			 })
    break;
    
case 14:
    foo.forEach(function(element,index,fullArray){
	var client  = new TC({tumblrName:element})
	client.saveRssFile();
    })
    
    break;
case 15:
    foo.forEach(function(element,index,fullArray){
	var client  = new TC({tumblrName:element})
	client.saveXMLFeedFile();
    })
    
    break;
case 16:
    foo.forEach(function(element,index,fullArray){
	var client  = new TC({tumblrName:element})
	client.saveJSONFeedFile();
	//would need to JSON.parse to get at results if reading from file
    })

    
    break;
    
default:
    console.log("invalid option")
    break;

}

//fdupes -d -N . //use fdupes to automatically delete dupes, preserving the first one.
