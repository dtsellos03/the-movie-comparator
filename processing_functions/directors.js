module.exports = 
    
    function ActorAnalysis(movies) {
    
    movies.forEach(function(element) {
        //element["Genres"] = JSON.parse("[" + element["Genres"] + "]");
        //console.log(element.Actors)
    if(element.Actors){
       element["Actors"] = element["Actors"].split(',')
    }
    })

    //console.log(movies)

    function isolateScores(movies, TAG) {
        var newlist = [];
        //console.log(movies);
        movies.forEach(function(element) {
           // console.log(element.Actors)
            if(element.Actors){
            element["Actors"].forEach(function(el) {
                el = el.trim();
                //console.log(element)
                newlist.push({
                    "Actors": el,
                    score: Number(element["You rated"]),
                })
                //console.log(newlist)
            })
            }
        
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
   //console.log(z)

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
        "TopActors": Sort(z, "Average", 15, -1),
        "WorstActors": Sort(z, "Average", 15, 1)
    }

   // console.log(ReturnObject)
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

function Round2 (number) {
    return (Math.round(number * 100) / 100)
}



}
    
;