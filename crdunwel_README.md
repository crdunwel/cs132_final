cs132_final
===========

The goal of this project is to create an app for Providence's WaterFire that allows participants to customize and/or enhance their experience at the event remotely through their mobile smartphone.  We will be implementing two crowdsourcing features, one that allows participants to suggest a change in volume by region and the other for feeding the fires.  The app will be extendable to allow more features to be added in the future.

## Technologies

### NODEJS SERVER

We use nodejs with a number of modules such as the framework express, ORM sequelize, and socket.io for websockets.   

### HTML5 GEOLOCATION

HTML5 has built in geolocation functionality that allow us to easily extract the longitude and latitude using the GPS of a mobile device.  We supply the {enableHighAccuracy:true} option in the optionsMap of navigator.geolocation.getCurrentPosition(successCallback,errorCallback,optionsMap) so there is a higher chance that the closest fire is indeed the closest fire to the user. 

We found this guide http://diveintohtml5.info/geolocation.html very useful in utilizing geolocation functionality in HTML5.

### SASS

Although we used minimal CSS in this project, we used SASS (http://sass-lang.com/) to write more concise and abstract CSS.

### WEB SOCKETS

We use http://socket.io/ to manage web socket functionality.  When the client clicks the "Feed Fire" button or the  increase/decrease volume buttons a socket event is fired which the server reads, saves in a sqlite database, and sends the data along to the technician side.  

### SEQUELIZE

To simplify SQL and JavaScript object mapping we use the ORM Sequelize (http://www.sequelizejs.com/).

### NUNJUCKS

A nodejs port from python jinja2 templating engine that allows us to write and piece together HTML templates.

### GOOGLE MAPS

## Project Structure

The root directory contains our server in server.js.  We separate views (presentation logic and HTML generation), models (JavaScript representation for SQL), and socketEvents (self explanatory) into separate files named respectively.  Additional directories in the root contain the following

### /static

Contains static frontend files such as css, javascript, images, and resources such as fonts.

### /templates

Contains HTML templates.  As indicated in the Technologies section, we use the nodejs module Nunjucks to render our templates. 

### /node_nodules

Where all the node modules are installed.



## FUTURE FEATURES

We built this app with extendability in mind.  That being said ... 

