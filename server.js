var express = require('express');
var anyDB = require('any-db');
var engines = require('consolidate');
var nunjucks = require('nunjucks');
var models = require('./models.js');
var views = require('./views.js');

var app = express();
app.use(express.bodyParser());
app.use("/static", express.static(__dirname + '/static'));
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('templates'));
env.express(app);

var port = 8080;

// URL matching here
app.get('/',views.mainPage);

console.log('Listening on port ' + port);
app.listen(port);