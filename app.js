var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require("body-parser");
var async = require('async');
var request = require('request');
var fs = require("fs");
var path = require('path')
var multer = require('multer')

const crypto = require('crypto');
const csv = require('csvtojson')

var storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            if (err) return cb(err);

            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
})

var upload = multer({
    storage: storage
})


var ActorsAnalysis = require('./processing_functions/actorsanalysis.js');
var GenreAnalysis = require('./processing_functions/genreanalysis.js');
var HistogramAnalysis = require('./processing_functions/histogramanalysis.js');
var PolarizingAnalysis = require('./processing_functions/polarizinganalysis.js');
var RatingsAnalysis = require('./processing_functions/ratingsanalysis.js');
var DirectorsAnalysis = require('./processing_functions/directorsanalysis.js');
var WritersAnalysis = require('./processing_functions/writersanalysis.js');
var TidbitsAnalysis = require('./processing_functions/tidbits.js');
var IMDBRatings = require('./processing_functions/imdbMPAA.js');


app.use(bodyParser.json());
app.use('/static', express.static('public'))
app.set("view engine", "ejs");


app.get("/home", function(req, res) {
    res.render("landing");
});

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/sampleresults", function(req, res) {
    res.render("sampleresults");
});

app.get('*', function(req, res) {
    res.render("landing");
});

app.post('/home/upload', upload.single('avatar'), function(req, res, next) {
    var filepath = req.file.filename
    console.log(filepath.split('.').pop())
    if (filepath.split('.').pop() != 'csv') {
        fs.unlink('/uploads/' + filepath, (err) => {
            if (err) throw err;
        });
        renderError(res, "Please upload a valid .csv file");
        return null;
    }

    Middleware(filepath, res, function(returnObj) {
        /// render route
    });

});


server.listen(8000, process.env.IP, function() {
    console.log("Server started!");
});

module.exports = app;

function Middleware(filepath, res, callback) {

    // Converting CSV to JSON  

    var fullpath = "uploads/" + filepath
    var JSONfile = Math.round(100000 * Math.random()).toString() + '_obj.json'
    var writeStream = fs.createWriteStream(JSONfile);
    const csvFilePath = fullpath
    csv({
        toArrayString: true
    }).fromFile(csvFilePath).pipe(writeStream);
    writeStream.on('finish', function() {
        fs.unlink(fullpath, (err) => {
            if (err) throw err;

        });
        var start = Date.now();

        try {
            fs.readFile(JSONfile, handleFile)
        }
        catch (err) {
            renderError(res, err)
        }

        // Processing functions on JSON file

        function handleFile(err, data) {
            if (err) {
                renderError(res, err)
            }
            try {
                fs.unlink(JSONfile, (err) => {
                    if (err) throw err;
                });
                var movies = JSON.parse(data);
                var filteredMovies = movies.filter(function(word) {
                    return word["Title type"] === "Feature Film";
                })
                var movieLength = filteredMovies.length;
                var count = 0;
                var totalNumber = filteredMovies.length;

                // Timeout after 15 seconds if API calls don't complete

                setTimeout(function() {

                    renderError(res, "Server timeout. Please try again.")

                }, 15000);


                // API calls to OMDb API

                var percent = 0;

                async.forEachOfLimit(filteredMovies, 20, function(value, key, callback) {

                        var url = 'http://www.omdbapi.com/?i=' + filteredMovies[key].const+'&apikey=9849809a';
                        var movie = filteredMovies[key]

                        var options = {
                            url: url,
                            timeout: 4000
                        }

                        request(options, function(error, response, body) {

                            if (!error) {

                                try {
                                    movie["Actors"] = JSON.parse(body)["Actors"];
                                    movie["Rated"] = JSON.parse(body)["Rated"];
                                    movie["Writers"] = JSON.parse(body)["Writer"].replace(/ *\([^)]*\) */g, "");;
                                    movie["Poster"] = JSON.parse(body)["Poster"];

                                    JSON.parse(body).Ratings.forEach(function(element) {
                                        if (element.Source === 'Metacritic') {
                                            movie['Metacritic'] = element.Value
                                        }
                                    })

                                    count++

                                    // Emit progress of API calls to client side

                                    percent = Math.floor((count / totalNumber) * 100);

                                    io.sockets.emit('message', percent);


                                }
                                catch (err) {
                                    renderError(res, err)
                                    return null
                                }
                            }
                            callback();

                        });

                    },
                    function(err) {

                        console.log(count)
                        console.log(movieLength)

                        if (err) {
                            console.log(err)
                        }

                        // Processing functions on movies array

                        var Actors = ActorsAnalysis(filteredMovies);
                        var Genre = GenreAnalysis(filteredMovies);
                        var Ratings = RatingsAnalysis(filteredMovies);
                        var Polarizing = PolarizingAnalysis(filteredMovies);
                        var Histogram = HistogramAnalysis(filteredMovies);
                        var Directors = DirectorsAnalysis(filteredMovies);
                        var Tidbits = TidbitsAnalysis(filteredMovies);
                        var Writers = WritersAnalysis(filteredMovies);

                        var ReturnObj = {
                            Actors: Actors,
                            Genre: Genre,
                            Ratings: Ratings,
                            IMDBRatings: IMDBRatings,
                            Polarizing: Polarizing,
                            Histogram: Histogram,
                            Directors: Directors,
                            Tidbits: Tidbits,
                            Writers: Writers
                        }

                        // Render results page

                        res.render("results2", {
                            ReturnObj: ReturnObj

                        })
                    }
                );
            }
            catch (err) {
                renderError(res, err)
                return null
            }
        }
    });
};

function renderError(res, err) {
    if (res.headersSent == false) {
        res.render("error", {
            err: err
        })
    }
}
