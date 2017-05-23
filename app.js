var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const crypto = require('crypto');
var obj;

 var async = require('async');
 var request = require('request');
var fs = require("fs");
var path = require('path')
var multer = require('multer')

var storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err);

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})

var upload = multer({ storage: storage })

var Processer = require ("./processing.js")


app.use(bodyParser.json());

app.set("view engine", "ejs");


app.get("/home", function(req, res){
    res.render("Mixes");
});

app.get("/", function(req, res){
    res.render("Mixes");
});

app.get("/resuts", function(req, res){
    res.render("results");
});

    

function Middleware(filepath, res){
    var fullpath = "uploads/"+filepath
    var writeStream = fs.createWriteStream('newtest.json');
    const csvFilePath = fullpath
    const csv = require('csvtojson')
    csv({toArrayString: true}).fromFile(csvFilePath).pipe(writeStream)
    writeStream.on('finish', function(){ 
      var file = 'newtest.json'
      var start = Date.now();
      var answers = JSON.parse(fs.readFileSync(file, 'utf8'))
  
      fs.readFile(file, handleFile)
      
      // Write the callback function
      
  function handleFile(err, data) {
      if (err) throw err
      var obj = JSON.parse(data);
      var movieLength = obj.length;
      //console.log(movieLength + "is" )
      var count = 0;
       async.forEachOfLimit(obj, 20, function(value, key, callback) {
              //console.log("Position is "+obj[key].position)
              var url = 'http://www.omdbapi.com/?i=' + obj[key].const+'&apikey=9849809a';
              var movie = obj[key]
              
              //console.log(count);
              request(url, function(error, response, body) {
                  //console.log(error)
                  if (!error) {
                      //console.log("Count is" + key)
                    //  if (movie) {
                          movie["Actors"] = JSON.parse(body)["Actors"];
                          movie["Rated"] = JSON.parse(body)["Rated"]
                          count++
                          if (JSON.parse(body).Ratings.length == 3) {
                              movie['Metacritic'] = JSON.parse(body).Ratings[2].Value
                          }
                  //    }


                  }
                  callback();
                  console.log(count)
              });

          }, 
          function(err) {
             // console.log("DONE!");
             console.log(count)
              //console.log(obj[32]);
              //console.log("DONE!");
            //console.log(obj)
             // console.log("END OF ACTORS")
            //  var Actor =  Processer.ActorsAnalysis(obj)
             // console.log(Actor)
                //var Actors = Processer.ActorsAnalysis(obj);
                //console.log("PROCESSING")
                var Genre = Processer.GenreAnalysis(obj);
                var Ratings = Processer.RatingsAnalysis(obj);
                var Polarizing = Processer.PolarizingAnalysis(obj);
                var Histogram = Processer.HistogramAnalysis(obj);
                   var ReturnObj = {
                  Genre: Genre,
                  Ratings: Ratings,
                   Polarizing: Polarizing,
                  Histogram: Histogram
                   }
                   var Scores=JSON.stringify(ReturnObj.Histogram.myscores);
                 res.render("results", {ReturnObj: ReturnObj, Scores: Scores})
                  //console.log(ReturnObj)


          }
      );

  }
  
  
      //console.log('Took', Date.now() - start, 'ms')
     // console.log(answers);

       //
       
      
  });
  
  
};


app.post('/home/upload', upload.single('avatar'), function (req, res, next) {
  var filepath = req.file.filename
  Middleware(filepath, res)
  
  next()},
  function (req, res, next) {
    

})


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Camp has started!");
});

