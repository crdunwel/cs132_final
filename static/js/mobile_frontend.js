$(document).ready(function()
{
    // connect socket to server
    var socket = io.connect('http://localhost:8080');

    socket.on('connect', function ()
    {
        socket.emit('connected', '', function (data)
        {
            // TODO get current song info
            var obj = JSON.parse(data);
            console.log(obj);
        });
    });

    // jquery selectors
    var $volumeBar = $('#volumeBar');
    var $feedFireButton = $('#feedFireButton');

    var sliderTimeout;    // used for timeout of slider so user isn't sending 100's of request to server.
    $volumeBar.slider({
        min: 1,
        max: 100,
        range:'min',
        value:50,
        slide:function() {clearTimeout(sliderTimeout);sliderTimeout = setTimeout(sendVolume, 2000)}
    });

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