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

A nodejs port from python jinja2 templating engine that allows us to write and easily piece together HTML templateshttp://nunjucks.jlongster.com/

### GOOGLE MAPS

## Project Structure

The root directory contains our server in server.js.  We separate views (presentation logic and HTML generation), models (JavaScript representation for SQL), and socketEvents (self explanatory) into separate files named respectively.  Additional directories in the root contain the following

### /static

Contains static frontend files such as css, javascript, images, and resources such as fonts.

### /templates

Contains HTML templates.  As indicated in the Technologies section, we use the nodejs module Nunjucks to render our templates. 

### /node_nodules

Where all the node modules are installed.

## Technician Page

The technician page is designed to allow a sound engineer or fire manager (whatever their job title is) to manage the fire and speaker feedback.

The main part of the page is a map, using google maps api. On the map, speakers/fires are shown using markers to show where they are.

Clicking on a markers brings up information about that marker on an information pane on the side. The information is basically what the technician needs to make a decision to call someone to feed a fire or change volume of a speaker, namely the aggregated feedback from front-ends. This information changes in real time as feedback comes in.

The markers change color when the amount of feedback (either feed fire requests or net volume change requests) exceeds a certain threshold. This allows the technician to be alerted visually when a speaker or fire needs attention.

The thresholds can be changed by clicking the change threshold button. This is useful because we don't have data to determine what good thresholds would be, and allows the technician to adjust the threshold so that they aren't getting too many notifications and also getting enough.


## FUTURE FEATURES

We built this app with extendability in mind.  That being said ... 

