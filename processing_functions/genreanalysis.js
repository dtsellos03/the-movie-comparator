module.exports = 
    
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


function Round2 (number) {
    return (Math.round(number * 100) / 100)
}



    }
    

    
;