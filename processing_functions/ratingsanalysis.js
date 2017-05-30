module.exports = 

function RatedAnalysis(movies) {

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

;