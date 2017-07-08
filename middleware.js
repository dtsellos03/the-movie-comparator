module.exports = function Middleware(filepath, res, server) {


  
    var ActorsAnalysis = require('./processing_functions/actorsanalysis.js');
    var GenreAnalysis = require('./processing_functions/genreanalysis.js');
    var HistogramAnalysis = require('./processing_functions/histogramanalysis.js');
    var PolarizingAnalysis = require('./processing_functions/polarizinganalysis.js');
    var RatingsAnalysis = require('./processing_functions/ratingsanalysis.js');
    var DirectorsAnalysis = require('./processing_functions/directorsanalysis.js');
    var WritersAnalysis = require('./processing_functions/writersanalysis.js');
    var TidbitsAnalysis = require('./processing_functions/tidbits.js')
    var io = require('socket.io')(server);
    var fs = require("fs");
    const csv = require('csvtojson')
    var async = require('async');
    var request = require('request');
    
    
     // Converting CSV to JSON  
    
    var fullpath = "uploads/" + filepath
    var JSONfile = Math.round(100000 * Math.random()).toString() + '_obj.json'
    var writeStream = fs.createWriteStream(JSONfile);
    const csvFilePath = fullpath
    csv({
        toArrayString: true
    }).fromFile(csvFilePath).pipe(writeStream)
    writeStream.on('finish', function() {
        fs.unlink(fullpath, (err) => {
            if (err) throw err;

        });
        var start = Date.now();

        try {
            fs.readFile(JSONfile, handleFile)
        }
        catch (err) {


            if (res.headersSent == false) {
                res.render("error", {
                    err: err
                })
            }
        }

        // Processing functions on JSON file

        function handleFile(err, data) {
            if (err) {
                try {
                    res.render("error");
                }
                catch (err) {

                    return null
                }

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


                    if (res.headersSent == false) {
                        res.render("error", {
                            err: "Server timeout. Please try again."
                        })
                    }

                }, 15000);


                // API calls to OMDb API

                var percent = 0;

                async.forEachOfLimit(filteredMovies, 20, function(value, key, callback) {

                        var url = 'http://www.omdbapi.com/?i=' + filteredMovies[key].const+'&apikey=9849809a';
                        var movie = filteredMovies[key]

                        request(url, function(error, response, body) {

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

                                    percent = Math.floor((count / totalNumber) * 100)
                                    io.sockets.emit('message', percent);


                                }
                                catch (err) {

                                    if (res.headersSent == false) {
                                        res.render("error", {
                                            err: err
                                        })
                                    }
                                    return null
                                }
                            }
                            callback();

                        });

                    },
                    function(err) {

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
                        var IMDBRatings = [{
                            rating: 'R',
                            percent: 47.1,
                            class: "progress-bar-success"
                        }, {
                            rating: 'PG-13',
                            percent: 30.8,
                            class: "progress-bar-info"
                        }, {
                            rating: 'PG',
                            percent: 11.2,
                            class: "progress-bar-warning"
                        }, {
                            rating: 'G',
                            percent: 1.8
                        }, {
                            rating: 'NC-17',
                            percent: 0.2
                        }].slice(0, 3)

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
                if (res.headersSent == false) {
                    res.render("error", {
                        err: err
                    })
                }
                return null
            }
        }
    });
};
