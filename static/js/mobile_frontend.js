$(document).ready(function()
{
    // connect socket to server
    var socket = io.connect('http://localhost:8080');

    socket.on('connect', function ()
    {
        // event to run when connected
        socket.emit('connected', '', function (data)
        {
            // TODO get current song info
            var obj = JSON.parse(data);
            console.log(obj);
        });
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
                if(true){
                    playSound('sounds/error.mp3');
                    alert('success! Your request has been noted');
                }else{
                    playSound('sounds/error.mp3');
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
                console.log("FIRE FEEDING");
                if(true){
                    playSound('sounds/error.mp3');
                    alert('success! Your request has been noted');
                }else{
                    playSound('sounds/error.mp3');
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

     function playSound(soundfile) {
        console.log("MAKING SOUND plzS");
        document.getElementById("dummy").innerHTML=
        "<embed src=\""+soundfile+"\" hidden=\"true\" autostart=\"true\" loop=\"false\" />";
    }
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