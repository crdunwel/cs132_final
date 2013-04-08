var express = require('express');
var anyDB = require('any-db');
var engines = require('consolidate');
var nunjucks = require('nunjucks');
var models = require('./models.js');

var app = express();
app.use(express.bodyParser());
app.use("/static", express.static(__dirname + '/static'));
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('templates'));
env.express(app);
var msg_tmpl = env.getTemplate('message.html');

function generateRoomIdentifier(length)
{
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var result = '';
    for (var i = 0; i < length; i++) { result += chars.charAt(Math.floor(Math.random() * chars.length)); }
    return result;
}

function returnMessagesAfterID(response, roomName, lastID)
{
    models.Message.findAll({ where: ["room = ? AND id > ?", roomName, lastID] }).success(function(models)
    {
        var toReturn = "";
        for (var i=0; i<models.length; i++)
        {
            toReturn += msg_tmpl.render({message: models[i].selectedValues});
        }
        response.json({'html':toReturn});
    });
}

/*
 Get index page
 */
app.get('/', function(request, response)
{
    response.render('intro.html', {});
});

/*
 Create new chatroom
 */
app.post('/', function(request, response)
{
    var roomName;
    if (!request.param('roomName')) { roomName = generateRoomIdentifier(6); }
    else { roomName = request.param('roomName'); }
    response.redirect('/rooms/' +  roomName);
});

/*
 Get all messages in json format
 */
app.get('/:roomName/messages.json', function(request, response)
{
    var room = request.params.roomName;
    if (!room) {room='';}
    models.Message.findAll({ where: ["room = ?", room] }).success(function(models)
    {
        response.json(models);
    });
});

/*
 Get new messages from database in HTML format
 */
app.get('/:roomName/messages/update', function(request, response)
{
    var roomName = request.params.roomName;
    var lastID = request.param("lastID");
    models.Message.findAll({ where: ["room = ? AND id > ?", roomName, lastID] }).success(function(models)
    {
        returnMessagesAfterID(response,roomName,lastID);
    });
});

/*
 Enter room and load current messages.
 */
app.get('/rooms/:roomName', function(request, response)
{
    var room = request.params.roomName;
    models.Message.findAll({ where: ["room = ?", room] }).success(function(models)
    {
        response.render('room.html', {room:room, messages:models});
    });
});

/*
 Post new message.
 */
app.post('/rooms/:roomName', function(request, response)
{
    var roomName = request.param('roomName');
    var nickname = request.param('nickname');
    var body = request.param('body');
    var lastID = request.param('lastID');

    models.Message.create({room: roomName, nickname: nickname, body:body}).success(function(message)
    {
        returnMessagesAfterID(response,roomName,lastID);
    });

});

/*
 TODO
 Room statistics
 Expand database to include more persistence for users (login/pw, avatar, profile, etc)

 //models.Message.findAll({ where: ["room = ? AND 'strftime(%s,createdAt)' >= ?", room, '"strftime(%s,now,localtime)"-300'] }).success(function(models)
 */

var port = 8080;
console.log('Listening on port ' + port);
app.listen(port);