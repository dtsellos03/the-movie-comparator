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


        var y = SumAveragePercent(CombineScores(isolateScores(movies)));



        var ReturnObject = {
            "TopRunTime": Sort(y, "Runtime Percent", 5, -1),
            "TopScore": Sort(y, "Average", 5, -1)
        }


        return ReturnObject


        function Round1(number) {
            return (Math.round(number * 10) / 10)
        }

        function Round2(number) {
            return (Math.round(number * 100) / 100)
        }


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




        function SumAveragePercent(array) {
            array.forEach(function(element) {
                    var sum = element.score.reduce((previous, current) => current += previous);
                    var avg = sum / element.score.length;
                    element["Average"] = Round2(avg);
                    var sum = element.runtime.reduce((previous, current) => current += previous);
                    var avg = sum / element.runtime.length;
                    element["Runtime Sum"] = Round1(sum);
                    element["Runtime Percent"] = Round1(100 * sum / total)
                        //console.log(avg)
                })
                //console.log(y)
            return array
        }



        function isolateScores(movies, TAG) {
            var newlist = [];
            //console.log(movies);
            movies.forEach(function(element) {
                    //console.log(element
                    element["Genres"].slice(0, 2).forEach(function(el) {
                        el = el.trim();
                        el = el.charAt(0).toUpperCase() + el.slice(1)
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
                var occurs = o.reduce(function(n, item, i) {
                    return (item["Genres"] === cur["Genres"]) ? i : n;
                }, -1);

                if (occurs >= 0) {


                    o[occurs].score = o[occurs].score.concat(cur.score);
                    o[occurs].runtime = o[occurs].runtime.concat(cur.runtime);

                }
                else {

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

        function isolateScores(movies, TAG) {
            var newlist = [];
            //console.log(movies);
            movies.forEach(function(element) {
                    //console.log(element
                    element["Genres"].slice(0, 2).forEach(function(el) {
                        el = el.trim();
                        el = el.charAt(0).toUpperCase() + el.slice(1)
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
                var occurs = o.reduce(function(n, item, i) {
                    return (item["Genres"] === cur["Genres"]) ? i : n;
                }, -1);

                if (occurs >= 0) {


                    o[occurs].score = o[occurs].score.concat(cur.score);
                    o[occurs].runtime = o[occurs].runtime.concat(cur.runtime);

                }
                else {

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



    };
