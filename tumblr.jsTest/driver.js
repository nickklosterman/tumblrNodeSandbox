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



var foo = ['rafchu','fresherluke','milonogiannis','alchemichael','veesdumpingrounds','metalshell','lewsteph','scottwatanabe','jigokuen','jimjam-art','darcysart','kevinnelsonart','bentanart','pr1ps','jtowndraws','kr0npr1nz','chachachabela','chrissamnee','mitografia','dianmz','joverine','artissimo','alexkonstad','cheeks-74','mrjakeparker','billotomo','davidpetersenart','dheezen','gobi-baptists-gaubert','ca-tsuka','evonyo','amyreeder','bentanart','anthonyholden','sirpangur','skirtzzz','shiyoonkim','sarapichelli','ottoghetto','probertson','loish']

foo.forEach(function(element,index,fullArray){
var client  = new TC(element+'.tumblr.com')
client.savePostImages();
//console.log(element)
})
//var client = new TC('rafchu.tumblr.com')
//client.savePostImages()