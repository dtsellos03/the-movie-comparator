

module.exports = 
    


function HistogramAnalysis(movies) {
    var d3 = require("d3");
    var myscores = [];
    var imdbscores = [];

    
    movies.forEach(function(element) {
        myscores.push([Number(element["You rated"])])
        imdbscores.push([Number(element["IMDb Rating"])])
    })
    
    var histGenerator = d3.histogram().domain([0,11]).thresholds(10);

    var MyScoreDistribution = histGenerator(myscores);
    var IMDBDistribution = histGenerator(imdbscores);
    
    var MyScoreObject = {
        '1': MyScoreDistribution[1].length,
        '2': MyScoreDistribution[2].length,
        '3': MyScoreDistribution[3].length,
        '4': MyScoreDistribution[4].length,
        '5': MyScoreDistribution[5].length,
        '6': MyScoreDistribution[6].length,
        '7': MyScoreDistribution[7].length,
        '8': MyScoreDistribution[8].length,
        '9': MyScoreDistribution[9].length,
        '10': MyScoreDistribution[10].length,
    }
    
        var IMDBScoreObject = {
        '1': IMDBDistribution[1].length,
        '2': IMDBDistribution[2].length,
        '3': IMDBDistribution[3].length,
        '4': IMDBDistribution[4].length,
        '5': IMDBDistribution[5].length,
        '6': IMDBDistribution[6].length,
        '7': IMDBDistribution[7].length,
        '8': IMDBDistribution[8].length,
        '9': IMDBDistribution[9].length,
        '10': IMDBDistribution[10].length,
    }

   // console.log(MyScoreObject)
 //   console.log(IMDBScoreObject)
   
   var Histograms = {
       MyScores: MyScoreObject,
       IMDBScores: IMDBScoreObject
   }
   
   return Histograms

}

    
;