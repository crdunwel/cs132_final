cs132_final
===========

The goal of this project is to create an app for Providence's WaterFire that allows participants to customize and/or enhance their experience at the event remotely through their mobile smartphone.  We will be implementing two crowdsourcing features, one that allows participants to suggest a change in volume by region and the other for feeding the fires.  The app will be extendable to allow more features to be added in the future.

##Getting Started

I took the liberty of selecting git as our versioning control and github to store our repository.  If you've taken CS32 already then you've used version control before but if you haven't then welcome to the world of sharing code. Check out https://github.com/ and follow the set up guide and create an account.

I have already created a repository and set up a skeleton for our project. As you may read in the "Fork A Repo" guide on github, you can get the files by using "clone" in the following manner.

```
$ git clone https://github.com/crdunwel/cs132_final.git
# Clones your fork of the repository into the current directory in terminal
```

Once you clone the project you should install the node modules we will (likely) be using as I defined in the package.json.

```
$ npm install
```

As a note, I have added the directory "node_modules/" to the ".gitignore" file so we don't run into conflicts from computer to computer.
##Quick Git Guide

I am no means an expert on Git and if you would like to learn more then please check out http://git-scm.com/.  I am just going to briefly explain what versioning is and provide a short summary of the key commands we will be using to share our code.

If you followed the link you will see that "Git is a free and open source distributed version control system designed to handle everything from small to very large projects with speed and efficiency." All this means is that Git is a system that provides the functionality for keeping track of and sharing the state of code as it changes.

You have already used the "clone" function above to copy all the contents of our repository to your local disk.  Now we will learn how to push (add/update) files from our local disk to the repository and pull (update) files from repository to our local disk.

###BASIC COMMANDS

To add a new file or directory to your git tracking list use

```
$ git add <*>
# example: git add README.md, git add static/, git add .
```

To commit your changes (including added files/folders) use

```
$ git commit -m "<Message>"
```

To push (save) your committed changes to the remote repository use

```
$ git push -u origin master
```

Finally, to update any changes on the repository to your local disk use

```
$ git pull -u origin master
```

If you try to push before you pull then you may get an error.  This is because you must be up to date with the repository before you are allowed to push your changes.

###MERGE CONFLICT

Now, you may be wondering what happens if two people are working on and pushing the same file simultaneously.  In many cases Git is intelligent enough to merge the contents of files so long as the two people aren't changing the same parts of the code. In some cases you'll run into a merge conflict after trying to commit.  You can manually resolve the issue by running

```
$ git mergetool
```

###BRANCHING

You may be wondering what the "-u origin master" part of our commands above mean.  All this means is that you're pushing and pulling from the trunk "master" line of updates.  However, what if you wanted to test a major change to the codebase or implement a major new feature without affecting the currently working codebase?  You could create a new branch of the code that copies all the content of the trunk, work on it, then merge it back with the master once the new feature is working.  In other words you can have multiple origins to push to and pull from.

For now we shouldn't worry about having multiple branches.  If at a later date it proves necessary then it's very easy to branch.  If you want to learn more then check out http://gitref.org/branching/.

###OPTIONAL

You will be prompted for your username/password when pushing unless you set up SSH.  This is not necessary but will eliminate the need to enter your authentication information every time you push.  You can add your SSH key to your account by navigating to https://github.com/settings/ssh and pasting the contents of your public key.  Then set the url for your git repository as followed

```
$ git remote set-url origin git@github.com:crdunwel/cs132_final.git
```

Now you will no longer be prompted for a username/password when pushing.

###FINAL REMARKS

You will learn to love versioning control (and hopefully Git as well).  Let me know if you have any issues setting up Git or connecting with the repository.  I believe I will need to add you to the contributor list for the project in order for you to be able to push so let me know what your username is and I can add you.

##Project Structure

Since this isn't a very large project the structure is pretty basic.  The backend server is comprisedly of three files, server.js, views.js, and models.js.  The server.js file is where the server is instantiated and urls are mapped to views in views.js.  The views can generate templated-HTML but also can handle ajax request.  The models.js file contains the javascript representation for our database (see http://www.sequelizejs.com/).

The "static/" directory contains subdirectories for "css/", "js/", "images/", and "resources/".  Place files accordingly.

The "template/" directory contains our html templates.  The syntax for the templates is that of the Python-powered jinja2 templating engine and the node module handling this is nunjucks (http://nunjucks.jlongster.com/).  It's really easy once you get used to it.

###SASS

Check out http://sass-lang.com/.  SASS allows for more abstracted and concise CSS and you should definitely use it.

###WEB SOCKETS

You've seen this guide before in my email but here's the link for sockets for nodejs http://socket.io/.  Read through "How To Use" page.  It's pretty basic and self explanatory but here's a basic run through.

```
$ npm install socket.io
```

Include socket.io.js client-side in the <header> of html document

```
<script src="/socket.io/socket.io.js"></script>
```

Include (and install if they aren't) these files at top of your server.js file

```
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
```

Set up socket events in your server.js file.  Below is an example from a simple multiplayer game I made.

```
server.listen(8080, function()
{
    console.log('- Server listening on port 8080');

    // Attach events to client's socket when they connect.
    io.sockets.on('connection', function (client)
    {

        // Event to run when a player first connects
        client.on('connected', function (name, fn)
        {
            players[player_id] = {'x':0,'y':0};
            socketMap[client] = player_id;
            // return data to only the client that connected
            fn(JSON.stringify({'new_id':player_id++,'players':players}));
        });

        // Event to run when player sends his new coordinates
        client.on('message', function (msg)
        {
            var obj = JSON.parse(msg);
            if (players.hasOwnProperty(obj.idnum))
            {
                players[obj.idnum]['x'] = obj['x'];
                players[obj.idnum]['y'] = obj['y'];
            }
            // send all player coordinates as JSON
            io.sockets.emit('message', JSON.stringify(players));
        });

        // Event to run when player disconnects from game
        client.on('disconnect', function ()
        {
            // send to all players that a player left the game
            io.sockets.emit('playerLeft',socketMap[client]);
            delete players[socketMap[client]];
        });
    });
});
```

And finally on the client side (either in html file or separate client-side .js file)


``` 
    // socket.send is a built-in wrapper for the 'message' event.  
    // You could use socket.emit('message','data', function(returnedData){});
    socket.send(JSON.stringify({'idnum':this.idnum,'x':this.realX,'y':this.realY}));

    // connect to server localhost on port 8080
    var socket = io.connect('http://localhost:8080');
    socket.on('connect', function ()
    {
        // Event to run on successful 'connected' event
        socket.emit('connected', ' ', function (data)
        {
            var obj = JSON.parse(data);
            playerChar.setID(obj['new_id']);
            createNewPlayers(obj['players']);
        });
    });

    // Event to run when server sends data from 'message' event
    // Updates other player's coordinates
    socket.on('message', function(message)
    {
        var obj = JSON.parse(message);
        createNewPlayers(obj['players']);
        updatePlayerCoords(obj['players']);
    });

    // Event to run when server sends data from 'playerLeft' event
    // Run when another player leaves the game.
    socket.on('playerLeft', function(message)
    {
        gravityScene.removeChild(otherPlayers[message]);
        delete otherPlayers[message];
    });
```

If you've worked with sockets in Java before then the idea is essentially the same except we use an event-driven model here.  The server listens for connecting sockets and attaches event handlers on connection.  The client sends data with an event name and the server runs the callback for the corresponding event, often returning data back to the client (or all currently connected clients).  You're basically playing catch, pushing and pulling from client to server to client with callback functions to process the data (often passed in JSON format).

##Conclusion

Let me know if you have any questions or can't get something in this guide to work properly.  I'm in no way an expert on git or nodejs or any of the modules I've listed by I have some knowledge and experience that I can share.  Also please let me know if you find better modules or if I'm doing something wrong or "the long way" - I'm always up for learning and improving!
