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
	//tech socket events
	client.on('updateTechData', function (){
		console.log("updatedData");
		//get the data from the database, send it back to the client
		client.emit('data', null);
        });

	client.on('resetSpeakerData', function(speaker){
		console.log("resetSpeakerData");
		//reset data for the speaker, send back everything
		client.emit('data', null);
	});

	client.on('resetFireData', function(fire){
		console.log("resetFireData");
		//reset data for the fire, send back everything
		client.emit('data', null);
	});

	client.on('newSpeaker', function(speaker){
		console.log("newSpeaker");
		console.log(speaker);
		//add a new speaker to the database
		client.emit('data', null);
	});

	client.on('newFire', function(fire){
		console.log("newFire");
		console.log(fire);
		//add a new fire to the database
		client.emit('data', null);
	});


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
