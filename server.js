var express = require('express');
var engines = require('consolidate');
var nunjucks = require('nunjucks');
var views = require('./views.js');

// instantiate server and connect with app and io
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = 8080;

// configure app
app.configure(function()
{
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'secret',
        store: new express.session.MemoryStore({reapInterval: 60000 * 10}),
        key:'express.sid'
    }));
    app.use("/static", express.static(__dirname + '/static'));
    var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('templates'));
    env.express(app);
    views.setEnvironment(env);
});

// URL matching
app.get('/technician',views.techPage);
app.get('/client', views.clientPage);
app.get('/', views.clientPage);

// launch server
server.listen(port, function()
{
    console.log('Listening on port ' + port);
    require('./socketEvents.js')(io);
});
