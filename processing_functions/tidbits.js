module.exports = 
  
  //Get top 5 longest movies
  //Get 
   
function Tidbits(movies) {
    
    var totalRuntime = 0;
    
    movies.forEach(function(element) {
        totalRuntime = totalRuntime + Number(element["Runtime (mins)"])
        element.Num = element.Num[" Votes"]
    })
    
        
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
        

   totalRuntime =  Math.round(totalRuntime);
    
   // console.log(totalRuntime)
    
    var ReturnObject = {
        longMovies: Sort(movies, "Runtime (mins)", 5, -1),
        obscureMovies: Sort(movies, "Num", 5, 1),
        totalRuntime: totalRuntime,
        totalMovies: movies.length

    }

  //console.log(ReturnObject)
    return ReturnObject

}

    
;