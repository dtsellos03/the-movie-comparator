module.exports = 

function PolarizingAnalysis(movies) {
    movies.forEach(function(element) {
          if (element.Metacritic) {
              element.CritDiff = Number(element["You rated"])-10*eval(element.Metacritic)
              element.IMDbDiff = element["You rated"]-element["IMDb Rating"]
          } else {
            element.CritDiff = 0
              element.IMDbDiff = element["You rated"]-element["IMDb Rating"]
          }
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

    return ReturnObject;

}

;