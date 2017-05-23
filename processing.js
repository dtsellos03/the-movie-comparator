var GenreAnalysis =
    function GenreAnalysis(movies) {

        var total = 0;
        movies.forEach(function(element) {
            //console.log(element["Runtime (mins)"])
            total = total + Number(element["Runtime (mins)"])
            //console.log(element["Runtime (mins)"])
        })

        console.log(total)

        movies.forEach(function(element) {
            //element["Genres"] = JSON.parse("[" + element["Genres"] + "]");
            element["Genres"] = element["Genres"].split(',')
            //  console.log(element["Rated"])
        })

        ///////////////////


        function isolateScores(movies, TAG) {
            var newlist = [];
            //console.log(movies);
            movies.forEach(function(element) {
                //console.log(element
                element["Genres"].slice(0, 2).forEach(function(el) {
                    el = el.trim();
                    //console.log(element)
                    newlist.push({
                        "Genres": el,
                        score: Number(element["You rated"]),
                        runtime: Number(element["Runtime (mins)"])
                    })
                    //console.log(newlist)
                })
            })
            //console.log(newlist)
            return newlist;
        }

        function CombineScores(movies, TAG) {
            var output = movies.reduce(function(o, cur) {
                // Get the index of the key-value pair.
                var occurs = o.reduce(function(n, item, i) {
                    return (item["Genres"] === cur["Genres"]) ? i : n;
                }, -1);

                // If the name is found,
                if (occurs >= 0) {

                    // append the current value to its list of values.
                    o[occurs].score = o[occurs].score.concat(cur.score);
                    o[occurs].runtime = o[occurs].runtime.concat(cur.runtime);

                    // Otherwise,
                } else {

                    // add the current item to o (but make sure the value is an movies).
                    var obj = {
                        "Genres": cur["Genres"],
                        score: [cur.score],
                        runtime: [cur.runtime]
                    };
                    o = o.concat([obj]);
                }
                return o;
            }, []);
            //console.log(output)
            return output;

        }

        function SumAveragePercent(array) {
            array.forEach(function(element) {
                var sum = element.score.reduce((previous, current) => current += previous);
                var avg = sum / element.score.length;
                element["Average"] = Round2(avg);
                var sum = element.runtime.reduce((previous, current) => current += previous);
                var avg = sum / element.runtime.length;
                element["Runtime Sum"] = Round2(sum);
                element["Runtime Percent"] = Round2(100 * sum / total)
                //console.log(avg)
            })
            //console.log(y)
            return array
        }


        var y = SumAveragePercent(CombineScores(isolateScores(movies)))
        //console.log(y)



        ///////////// SORT TOP Genres


        function Sort(array, parameter, entries, d) {
            array.sort(function(a, b) {
                if (d == -1) {
                    return b[parameter] - a[parameter]
                } else {
                    return a[parameter] - b[parameter]
                }

            })
            return array.slice(0, entries)
        }



        var ReturnObject = {
            "TopRunTime": Sort(y, "Runtime Percent", 5, -1),
            "TopScore": Sort(y, "Average", 5, -1)
        }

        //console.log(ReturnObject)
        return ReturnObject


    }


var PolarizingAnalysis = function PolarizingAnalysis(movies) {
    movies.forEach(function(element) {
        if (element.Metacritic) {
            element.CritDiff = Round2(Number(element["You rated"]) - 10 * eval(element.Metacritic));
        }
        element.IMDbDiff = Round2(element["You rated"] - element["IMDb Rating"])
    })

    //console.log(movies)

    var ReturnObject = {
        "ULOVE-CRITHATE": Sort(movies, "CritDiff", 5, -1),
        "UHATE-CRITLOVE": Sort(movies, "CritDiff", 5, 1),
        "ULOVE-IMDBHATE": Sort(movies, "IMDbDiff", 5, -1),
        "UHATE-IMDBLOVE": Sort(movies, "IMDbDiff", 5, 1)
    }

    function Sort(array, parameter, entries, d) {
        array.sort(function(a, b) {
            if (d == -1) {
                return b[parameter] - a[parameter]
            } else {
                return a[parameter] - b[parameter]
            }

        })
        return array.slice(0, entries)
    }

    return ReturnObject

}


var RatingsAnalysis = function RatedAnalysis(movies) {

    var ratingSums = {
        "APPROVED": 0,
        "R": 0,
        "PG-13": 0,
        "NOT RATED": 0,
        "NC-17": 0,
        "UNRATED": 0,
        "PG": 0,
        "G": 0,
    }

    movies.forEach(function(element) {
        ratingSums[(element["Rated"])]++
    })
    ratingSums["R"] = 100 * ratingSums["R"]
    ratingSums["PG"] = 100 * ratingSums["PG"]
    ratingSums["NC-17"] = 100 * ratingSums["NC-17"]
    ratingSums["G"] = 100 * ratingSums["G"]
    ratingSums["PG-13"] = 100 * ratingSums["PG-13"]

    return ratingSums

}



var HistogramAnalysis = function HistogramAnalysis(movies) {
    var ReturnObject = {
        myscores: [['K']],
        imdbscores: [['Rating']]

    }
    movies.forEach(function(element) {
        ReturnObject.myscores.push([Number(element["You rated"])])
        ReturnObject.imdbscores.push([Number(element["IMDb Rating"])])
    })
    
    

    //console.log(ReturnObject)
    return ReturnObject

}



var ActorsAnalysis = function ActorAnalysis(movies) {
    
    movies.forEach(function(element) {
        //element["Genres"] = JSON.parse("[" + element["Genres"] + "]");
        //console.log(element.Actors)
        element["Actors"] = element["Actors"].split(',')
    })



    function isolateScores(movies, TAG) {
        var newlist = [];
        //console.log(movies);
        movies.forEach(function(element) {
            //console.log(element.Actors)
           
            element["Actors"].forEach(function(el) {
                el = el.trim();
                //console.log(element)
                newlist.push({
                    "Actors": el,
                    score: Number(element["You rated"]),
                })
                //console.log(newlist)
            })
        
         })
        //console.log(newlist)
        return newlist;
    }

    //var movies = isolateScores(letters, "Directors")

    //console.log(isolateScores(letters))

    //console.log(isolateScores(letters, "Directors"));

    //

    function Gen(movies, TAG) {
        var output = movies.reduce(function(o, cur) {
            // Get the index of the key-value pair.
            var occurs = o.reduce(function(n, item, i) {
                return (item["Actors"] == cur["Actors"]) ? i : n;
            }, -1);

            // If the name is found,
            if (occurs >= 0) {

                // append the current value to its list of values.
                o[occurs].score = o[occurs].score.concat(cur.score);

                // Otherwise,
            } else {

                // add the current item to o (but make sure the value is an movies).
                var obj = {
                    "Actors": cur["Actors"],
                    score: [cur.score]
                };
                o = o.concat([obj]);
            }
            return o;
        }, []);
        //console.log(output)
        return output;
    }

    var z = isolateScores(movies)
   console.log(z)

    var y = Gen(z, "Actors");
    //console.log(y);
    // CALCULATE SUM/AVG
    y.forEach(function(element) {
        var sum = element.score.reduce((previous, current) => current += previous);
        var avg = sum / element.score.length;
        element["Average"] = Round2(avg);
        //console.log(avg)
    })
    //console.log(y)

    var z = [];
    y.forEach(function(element) {
        if ((element.score.length) > 3) {

            z.push(element)
        }
    })

//console.log(z)

    var ReturnObject = {
        "TopActors": Sort(z, "Average", 5, -1),
        "WorstActors": Sort(z, "Average", 5, 1)
    }

    //console.log(ReturnObject)
    return ReturnObject


    function Sort(array, parameter, entries, d) {
        array.sort(function(a, b) {
            if (d == -1) {
                return b[parameter] - a[parameter]
            } else {
                return a[parameter] - b[parameter]
            }

        })
        return array.slice(0, entries)
    }


}

function Round2 (number) {
    return (Math.round(number * 100) / 100)
}




module.exports = {
    GenreAnalysis: GenreAnalysis,
    PolarizingAnalysis: PolarizingAnalysis,
    RatingsAnalysis: RatingsAnalysis,
    HistogramAnalysis: HistogramAnalysis,
    ActorsAnalysis: ActorsAnalysis

};