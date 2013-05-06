$(document).ready(function()
{
    // connect socket to server
    var socket = io.connect();

    socket.on('connect', function ()
    {
        // event to run when connected
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
    var $feedFireButton = $('#feedFireButton');
    var $volumeButton =  $('.volume-button');

    $volumeButton.button();
    $volumeButton.click(function(event) { sendVolume($(this).data('vol')); });

    function sendVolume(volume)
    {
        navigator.geolocation.getCurrentPosition(success, error, {enableHighAccuracy:true});

        function success(position)
        {
            position.dir = volume;
            socket.emit('volume', JSON.stringify(position), function(bool)
            {
                // TODO do something with returned bool value
                if(bool){
                    var sound = document.getElementById("goodsound");
                    sound.play();
                    alert('success! Your request has been noted');
                }else{
                    var sound = document.getElementById("errorsound");

                    sound.play()
                    alert('We were unable to process your request');
                }
            });
        }

        function error(error)
        {
            alert("GPS Error, your vote could not be counted")
        }
    }

    $feedFireButton.click(function()
    {
        navigator.geolocation.getCurrentPosition(success, error, {enableHighAccuracy:true});
        console.log("CLICKED");
        function success(position)
        {
            socket.emit('feedFire', JSON.stringify(position), function(bool)
            {
                // TODO do something with returned bool value
                if(bool){
                    var sound = document.getElementById("goodsound");
                    sound.play();
                    alert('success! Your request has been noted');
                }else{
                    var sound = document.getElementById("errorsound");

                    sound.play()
                    alert('We were unable to process your request');
                }
            });
        }

        function error(error)
        {
            console.log("GPS ERROR");
            alert("GPS Error, your vote could not be counted")
        }
    });

    // OLD SLIDER METHOD
    /*
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
     */
});
