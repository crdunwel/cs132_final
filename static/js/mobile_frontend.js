$(document).ready(function()
{
    // connect socket to server
    var socket = io.connect();

    // event to run when connected
    socket.on('connect', function ()
    {
        socket.emit('connected', '', function (data)
        {
            // TODO get current song info
            //var obj = JSON.parse(data);
            //console.log(obj);

		document.getElementById('songTitle').innerHTML = data.title;
		document.getElementById('songArtist').innerHTML = data.artist;
		
        });
    });

	socket.on('songUpdate', function(song){
		// TODO get current song info

		document.getElementById('songTitle').innerHTML = song.title;
		document.getElementById('songArtist').innerHTML = song.artist;
	});

    // jquery selectors
    var $volumeBar = $('#volumeBar');
    var $feedFireButton = $('#feedFireButton');

    var sliderTimeout;    // used for timeout of slider so user isn't sending 100's of request to server.
    $volumeBar.slider({
        min: 0,
        max: 100,
        range:'min',
        value:50,
        step:1,
        slide:function(event,ui)
        {
            //$slider_handle.text(ui.value);
            clearTimeout(sliderTimeout);
            sliderTimeout = setTimeout(sendVolume, 2000)
        }
    });

    var $slider_handle = $('.ui-slider-handle');
    //$slider_handle.text($volumeBar.slider("value"));
    $slider_handle.css({'text-decoration':'none','text-align':'center'});

    function sendVolume()
    {
        navigator.geolocation.getCurrentPosition(success, error, {enableHighAccuracy:true});

        function success(position)
        {
            position.dir = $volumeBar.slider("value");
            socket.emit('volume', JSON.stringify(position), function(bool)
            {
                // TODO do something with returned bool value
            });
        }

        function error(error)
        {
            // TODO handle case where no GPS present
        }

    }

    $feedFireButton.click(function()
    {
        navigator.geolocation.getCurrentPosition(success, error, {enableHighAccuracy:true});

        function success(position)
        {
            socket.emit('feedFire', JSON.stringify(position), function(bool)
            {
                // TODO do something with returned bool value
            });
        }

        function error(error)
        {
            // TODO handle GPS error
        }

    });

});
