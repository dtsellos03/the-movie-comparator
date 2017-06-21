module.exports =

    function ActorAnalysis(movies) {

        var stdev = require('compute-stdev');

        movies.forEach(function(element) {
            if (element.Actors) {
                element["Actors"] = element["Actors"].split(',')
            }
        })

        var z = isolateScores(movies)


        var y = Gen(z, "Actors");

        y.forEach(function(element) {
                var sum = element.score.reduce((previous, current) => current += previous);
                var avg = sum / element.score.length;
                element["NumMovies"] = element.score.length
                element["Average"] = Round1(avg);
                if (element.score.length > 3) {
                    element["Stdev"] = Round1(stdev(element.score))

                }
            })
            //console.log(y)

        var z = [];
        y.forEach(function(element) {
            if ((element.score.length) > 3) {
                z.push(element)
            }
        })


        var mostProl = y.sort(function(a, b) {
                return b.score.length - a.score.length
            })


        var ReturnObject = {
            "TopActors": Sort(z, "Average", 10, -1),
            "WorstActors": Sort(z, "Average", 10, 1),
            "ActorsLength": y.length,
            "MostProlific": mostProl.slice(0, 5),
            "MostControversial": Sort(z, "Stdev", 5, -1)

        }

        return ReturnObject


        function Sort(array, parameter, entries, d) {
            array.sort(function(a, b) {
                if (d == -1) {
                    return b[parameter] - a[parameter]
                }
                else {
                    return a[parameter] - b[parameter]
                }

            })
            return array.slice(0, entries)
        }

        function Round1(number) {
            return (Math.round(number * 10) / 10)
        }

        function isolateScores(movies, TAG) {
            var newlist = [];
            
            movies.forEach(function(element) {
                    if (element.Actors) {
                        element["Actors"].forEach(function(el) {
                            el = el.trim();

                            newlist.push({
                                    "Actors": el,
                                    score: Number(element["You rated"]),
                                    title: element["Title"]
                                })

                        })
                    }

                })
                //console.log(newlist)
            return newlist;
        }


        function Gen(movies, TAG) {
            var output = movies.reduce(function(o, cur) {
            
                var occurs = o.reduce(function(n, item, i) {
                    return (item["Actors"] == cur["Actors"]) ? i : n;
                }, -1);


                if (occurs >= 0) {

      
                    o[occurs].score = o[occurs].score.concat(cur.score);
                    o[occurs].title = o[occurs].title.concat(cur.title);

                    // Otherwise,
                }
                else {

              
                    var obj = {
                        "Actors": cur["Actors"],
                        score: [cur.score],
                        title: [cur.title]
                    };
                    o = o.concat([obj]);
                }
                return o;
            }, []);
         
            return output;
        }

    }

;