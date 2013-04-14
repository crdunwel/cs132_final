$(document).ready(function()
{

    var $volumeBar = $('#volumeBar');

    var timeout;
    $volumeBar.slider({min: 1,max: 100, range:'min', value:50, slide:function(){clearTimeout(timeout);timeout = setTimeout(sendVolume,2000)}});
    function sendVolume()
    {

        navigator.geolocation.getCurrentPosition(function(position)
        {
            position.dir = $volumeBar.slider("value");
            socket.emit('volume', JSON.stringify(position), function(bool)
            {
                // do something with returned bool value
            });
        },

        function(error)
        {

        },

        {enableHighAccuracy:true});
    }


    var socket = io.connect('http://localhost:8080');

    socket.on('connect', function ()
    {
        socket.emit('connected', '', function (data)
        {
            // get current song info
            var obj = JSON.parse(data);
            console.log(obj);
        });
    });

    $('#feedFireButton').click(function()
    {
        navigator.geolocation.getCurrentPosition(function(position)
        {
            socket.emit('feedFire', JSON.stringify(position), function(bool)
            {
                // do something with returned bool value
            });
        },

        function(error)
        {

        },

        {enableHighAccuracy:true});
    });

    $('.volumeButton').click(function()
    {

    });




});