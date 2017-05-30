module.exports = 
    
   
function HistogramAnalysis(movies) {
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

    
;