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

var ActorsAnalysis = require('./processing_functions/actorsanalysis.js');
var GenreAnalysis = require('./processing_functions/genreanalysis.js');
var HistogramAnalysis = require('./processing_functions/histogramanalysis.js');
var PolarizingAnalysis = require('./processing_functions/polarizinganalysis.js');
var RatingsAnalysis = require('./processing_functions/ratingsanalysis.js');
var DirectorsAnalysis = require('./processing_functions/directorsanalysis.js');




app.use(bodyParser.json());

app.set("view engine", "ejs");


app.get("/home", function(req, res){
    res.render("landing");
});

app.get("/", function(req, res){
    res.render("landing");
});


    

function Middleware(filepath, res){
    var fullpath = "uploads/"+filepath
    console.time('parse csv')
    var writeStream = fs.createWriteStream('newtest.json');
    const csvFilePath = fullpath
    const csv = require('csvtojson')
    csv({toArrayString: true}).fromFile(csvFilePath).pipe(writeStream)
    writeStream.on('finish', function(){ 
      var file = 'newtest.json'
      var start = Date.now();
      var answers = JSON.parse(fs.readFileSync(file, 'utf8'))
      console.timeEnd('parse csv')
      fs.readFile(file, handleFile)
      
      
  function handleFile(err, data) {
      if (err) throw err
      
      var obj = JSON.parse(data);
      var movieLength = obj.length;
      //console.log(movieLength + "is" )
      var count = 0;
      console.time('API call')
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
                          
                          JSON.parse(body).Ratings.forEach(function(element){
                               if (element.Source === 'Metacritic'){
                                   movie['Metacritic'] = element.Value
                                   //console.log(movie.Title)
                                   //console.log(element.Value)
                               }
                          })
                             
                         
                         
                  //    }

                   
                  }
                  callback();
                  //console.log(count)
              });

          }, 
          function(err) {
              console.timeEnd('API call')
             // console.log("DONE!");
             //console.log(count)
              //console.log(obj[32]);
              //console.log("DONE!");
            // console.log(obj)
             // console.log("END OF ACTORS")
            //  var Actor =  Processer.ActorsAnalysis(obj)
             // console.log(Actor)
                console.time('actor analysis')
                var Actors = ActorsAnalysis(obj);
                console.log(Actors.ActorsLength)
                console.timeEnd('actor analysis')
                console.time('genre analysis')
                var Genre = GenreAnalysis(obj);
                console.timeEnd('genre analysis')
                console.time('ratings analysis')
                var Ratings = RatingsAnalysis(obj);
                console.timeEnd('ratings analysis')
                console.time('polar analysis')
                var Polarizing = PolarizingAnalysis(obj);
                console.timeEnd('polar analysis')
                console.time('histo analysis')
                var Histogram = HistogramAnalysis(obj);
                var Directors = DirectorsAnalysis(obj);
                console.timeEnd('histo analysis')
                   var ReturnObj = {
                  Actors: Actors,
                  Genre: Genre,
                  Ratings: Ratings,
                   Polarizing: Polarizing,
                  Histogram: Histogram,
                  Directors: Directors
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

