/**
 * Practice
 */

var http = require('http');
var path = require('path');
var express = require('express');
var when = require('when');
var request = require('request');
var app = express();

var config = require('./config.js');
app.set("appConfig", config);

app.use(express.static(path.join(__dirname, 'public')));

var router = express.Router();

// for all requests - like any middle
router.use(function(req,res,next) {
    next();
});

// handle base path
router.get('/', function(req,res) {
    res.redirect('/index.html')
});


// -----------------------------------------
var service = {
    getChuckNorrisJoke: function() {
        var deferred = when.defer();

        request('http://api.icndb.com/jokes/random', function(err, res){

            if (err) {
                console.log(err);
                return deferred.resolve(err);
            }

            console.log (res.statusCode);

            var json = JSON.parse(res.body);
            return deferred.resolve(json);

        });
        return deferred.promise;
    }

};
// ------------------------------------------



router.get('/joke/chuckNorris', function(req,res) {

    service.getChuckNorrisJoke()
        .then(function(data) {
            res.send(data.value);
        });
});


// apply router to all requests
app.use('/', router);

http.createServer(app).listen(config.port, function() {
    console.log("server running on port 8000");
});