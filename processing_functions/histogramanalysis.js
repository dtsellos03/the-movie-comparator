module.exports =



    function HistogramAnalysis(movies) {
        var d3 = require("d3");
        var myscores = [];
        var imdbscores = [];

        function Round1(number) {
            return (Math.round(number * 10) / 10)
        }



        movies.forEach(function(element) {
            myscores.push(Number(element["You rated"]))
            imdbscores.push(Number(element["IMDb Rating"]))
        })

       // console.log(myscores)
       // console.log(imdbscores)

        var MySum = myscores.reduce((a, b) => a + b, 0);
        //console.log(MySum + "IS THE SUM")
        var MyAverage = Round1(MySum / myscores.length);
        var IMDBSum = imdbscores.reduce((a, b) => a + b, 0);
        //console.log(IMDBSum + "IS THE IMDBSUM")
        var IMDBAverage = Round1(IMDBSum / imdbscores.length);


        var histGenerator = d3.histogram().domain([0, 11]).thresholds(10);
        var IMDBhistGenerator = d3.histogram().domain([1, 11]).thresholds(19);

        var MyScoreDistribution = histGenerator(myscores);
        var IMDBDistribution = IMDBhistGenerator(imdbscores);

        var MyScoreObject = [
            ['Rating', 'Ratings', {
                role: 'style'
            }],
            ['1', MyScoreDistribution[1].length, 'color: #1deac3'],
            ['2', MyScoreDistribution[2].length, 'color: #18ebac'],
            ['3', MyScoreDistribution[3].length, 'color: #16eba5'],
            ['4', MyScoreDistribution[4].length, 'color: #12ed91'],
            ['5', MyScoreDistribution[5].length, 'color: #0fee83'],
            ['6', MyScoreDistribution[6].length, 'color: #0bee72'],
            ['7', MyScoreDistribution[7].length, 'color: #09ef66'],
            ['8', MyScoreDistribution[8].length, 'color: #06f05a'],
            ['9', MyScoreDistribution[9].length, 'color: #03f14d'],
            ['10', MyScoreDistribution[10].length, 'color: #01f144']
        ]

        var IMDBScoreObject = [
            ['Rating', 'Ratings', {
                role: 'style'
            }],
            ['1', 0, 'color: #F8CF35'],
            ['', IMDBDistribution[0].length, 'color: #F7CB22'],
            ['2', IMDBDistribution[1].length, 'color: #F6C420'],
            ['', IMDBDistribution[2].length, 'color: #F6BD1F'],
            ['3', IMDBDistribution[3].length, 'color: #F6B71D'],
            ['', IMDBDistribution[4].length, 'color: #F6B01C'],
            ['4', IMDBDistribution[5].length, 'color: #F6AA1A'],
            ['', IMDBDistribution[6].length, 'color: #F6A319'],
            ['5', IMDBDistribution[7].length, 'color: #F69D18'],
            ['', IMDBDistribution[8].length, 'color: #F69616'],
            ['6', IMDBDistribution[9].length, 'color: #F59015'],
            ['', IMDBDistribution[10].length, 'color: #F58913'],
            ['7', IMDBDistribution[11].length, 'color: #F58312'],
            ['', IMDBDistribution[12].length, 'color: #F57C11'],
            ['8', IMDBDistribution[13].length, 'color: #F5760F'],
            ['', IMDBDistribution[14].length, 'color: #F56F0E'],
            ['9', IMDBDistribution[15].length, 'color: #F5690C'],
            ['', IMDBDistribution[16].length, 'color: #F5620B'],
            ['10', IMDBDistribution[17].length, 'color: #F55C0A']
        ]

        //console.log(MyScoreObject)
            //   console.log(IMDBScoreObject)

        var Histograms = {
            MyScores: MyScoreObject,
            IMDBScores: IMDBScoreObject,
            MyAverage: MyAverage,
            IMDBAverage: IMDBAverage
        }

        return Histograms

    }


;