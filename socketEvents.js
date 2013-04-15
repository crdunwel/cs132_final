var cookie = require('cookie');
var connect = require('connect');
var models = require('./models.js');

module.exports = function(io)
{
    // Authorize web socket from session id
    io.set('authorization', function (handshakeData, accept)
    {
        if (handshakeData.headers.cookie)
        {
            handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
            handshakeData.sessionID = connect.utils.parseSignedCookie(handshakeData.cookie['express.sid'], 'secret');

            if (handshakeData.cookie['express.sid'] == handshakeData.sessionID)
            {
                return accept('Cookie is invalid.', false);
            }
        }
        else
        {
            return accept('No cookie transmitted.', false);
        }

        accept(null, true);
    });

    // bind events to socket
    io.sockets.on('connection', function (client)
    {
        // Event to run user first connects
        client.on('connected', function (name, fn)
        {
            console.log(client.id);
            // TODO get song info from database
        });

        // Event to run when feed fire button is clicked
        client.on('feedFire', function (msg, fn)
        {
            var obj = JSON.parse(msg);
            console.log(obj);

            // TODO need to first check if user with session ID already exists
            models.Location.create({client_id:client.id,longitude:obj.coords.longitude,latitude:obj.coords.latitude}).success(function(location)
            {
                models.FeedFire.create({feed:true,LocationId:location.id}).success(function(feedFire)
                {
                    fn(true);
                });
            });

        });

        // Event to run when volume slider is slid and stays still for certain number of seconds
        client.on('volume', function (msg, fn)
        {
            var obj = JSON.parse(msg);
            console.log(obj);

            // TODO need to first check if user with session ID already exists
            models.Location.create({client_id:client.id,longitude:obj.coords.longitude,latitude:obj.coords.latitude}).success(function(location)
            {
                models.Volume.create({dir:obj.dir, LocationId:location.id}).success(function(volume)
                {
                    fn(true);
                });
            });

        });
    });
};