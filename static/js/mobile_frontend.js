$(document).ready(function()
{
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
        var dir = $(this).data().json.dir;

        navigator.geolocation.getCurrentPosition(function(position)
            {
                position.dir = dir;
                socket.emit('volume', JSON.stringify(position), function(bool)
                {
                    // do something with returned bool value
                });
            },

            function(error)
            {

            },

            {enableHighAccuracy:true});
    });




});