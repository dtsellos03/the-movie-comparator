module.exports = 
    
    function WritersAnalysis(movies) {
        
    var stdev = require( 'compute-stdev' );
    
    movies.forEach(function(element) {
        //element["Genres"] = JSON.parse("[" + element["Genres"] + "]");
        //console.log(element.Writers)
    if(element.Writers){
       element["Writers"] = element["Writers"].split(',')
    }
    })

    //console.log(movies)

    function isolateScores(movies, TAG) {
        var newlist = [];
        //console.log(movies);
        movies.forEach(function(element) {
           // console.log(element.Writers)
            if(element.Writers){
            element["Writers"].forEach(function(el) {
                el = el.trim();
                //console.log(element)
                newlist.push({
                    "Writers": el,
                    score: Number(element["You rated"]),
                    title: element["Title"]
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
                return (item["Writers"] == cur["Writers"]) ? i : n;
            }, -1);

            // If the name is found,
            if (occurs >= 0) {

                // append the current value to its list of values.
                o[occurs].score = o[occurs].score.concat(cur.score);
                o[occurs].title = o[occurs].title.concat(cur.title);

                // Otherwise,
            } else {

                // add the current item to o (but make sure the value is an movies).
                var obj = {
                    "Writers": cur["Writers"],
                    score: [cur.score],
                    title: [cur.title]
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

    var y = Gen(z, "Writers");
    //console.log(y);
    // CALCULATE SUM/AVG
    y.forEach(function(element) {
        var sum = element.score.reduce((previous, current) => current += previous);
        var avg = sum / element.score.length;
        element["NumMovies"] = element.score.length
        element["Average"] = Round1(avg);
        if (element.score.length > 3){
        element["Stdev"] = Round1(stdev(element.score))
       // console.log(element.Writers)
       // console.log(element.title)
       // console.log(element.Writers+"  "+element.Stdev)
        }
    })
    //console.log(y)

    var z = [];
    y.forEach(function(element) {
        if ((element.score.length) > 3) {
            z.push(element)
        }
    })
    
    

//console.log(z)
    var mostProl = y.sort(function(a,b) {
        return b.score.length - a.score.length
    })
    //console.log(mostProl.slice(0,10))

    var ReturnObject = {
        "TopWriters": Sort(z, "Average", 10, -1),
        "WorstWriters": Sort(z, "Average", 10, 1),
        "WritersLength": y.length,
        "MostProlific": mostProl.slice(0,5),
        "MostControversial": Sort(z, "Stdev", 5, -1)
       
    }

   console.log(ReturnObject)
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

function Round1 (number) {
    return (Math.round(number * 10) / 10)
}



}
    
;