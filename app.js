var express = require("express");
var app = express();
var server = require('http').Server(app);
var bodyParser = require("body-parser");
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var Middleware = require('./middleware');

const crypto = require('crypto');
const csv = require('csvtojson')

var storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            if (err) return cb(err);

            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
})

var upload = multer({
    storage: storage
})

app.use(bodyParser.json());
app.use('/static', express.static('public'))
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/sampleresults", function(req, res) {
    res.render("sampleresults");
});

app.get('*', function(req, res) {
    res.render("landing");
});

app.post('/home/upload', upload.single('avatar'), function(req, res, next) {
        var filepath = req.file.filename
        console.log(filepath.split('.').pop())
        if (filepath.split('.').pop() != 'csv') {
            fs.unlink('/uploads/' + filepath, (err) => {
                if (err) throw err;
            });
            res.render("error", {
                err: "Please upload a valid .csv file"
            })
            return null
        }

        Middleware(filepath, res, server)

    },
    function(req, res, next) {


    })


server.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server started!");
});

module.exports = app;