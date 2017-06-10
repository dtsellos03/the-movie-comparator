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
    console.log(ratingSums)
    ratingSums["R"] = Round1(100 * ratingSums["R"]/movies.length)
    ratingSums["PG"] = Round1(100 * ratingSums["PG"]/movies.length)
    ratingSums["NC-17"] = Round1(100 * ratingSums["NC-17"]/movies.length)
    ratingSums["G"] = Round1(100 * ratingSums["G"]/movies.length)
    ratingSums["PG-13"] = Round1(100 * ratingSums["PG-13"]/movies.length)
    
    var finalarray = [
        {rating: "R", percent: ratingSums["R"]},
        {rating: "PG", percent: ratingSums["PG"]},
        {rating: "NC-17", percent: ratingSums["NC-17"]},
        {rating: "G", percent: ratingSums["G"]},
        {rating: "PG-13", percent: ratingSums["PG-13"]}
        ]
        
    finalarray.sort(function(a, b) {
               return b.percent - a.percent
    });

    var truefinalarray = finalarray.slice(0,3);
    truefinalarray[0].class = "progress-bar-success";
    truefinalarray[1].class = "progress-bar-info";
    truefinalarray[2].class = "progress-bar-warning";
    
    return truefinalarray

function Round1 (number) {
    return (Math.round(number * 10) / 10)
}




}

;