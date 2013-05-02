(function(){
var decreaseCutoff = 200.0;
var increaseCutoff = 200.0;
var minColor = 30;
var speakerRadius = 10;
var selectedSpeaker = -1;
var speakers = new Array();
var fires = new Array();
var markers = new Array();
var map;
var viewFires = true;
var socket = io.connect();

//get request from server to get speaker data and map image
speakers.push({"id" : "BLAH0", "x" : 41.8265, "y" : -71.4140, "radius" : 40, "volumeUp" : 100, "volumeDown" : 200});
speakers.push({"id" : "BLAH1", "x" : 41.8270, "y" : -71.4140, "radius" : 40, "volumeUp" : 0, "volumeDown" : 150});
fires.push({"id" : "FIRE0", "x" : 41.8265, "y" : -71.4140, "needsFed" : 0});
fires.push({"id" : "FIRE1", "x" : 41.8265, "y" : -71.4140, "needsFed" : 0});

function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(41.8265, -71.4140),
          zoom: 18,
          mapTypeId: google.maps.MapTypeId.HYBRID,
	  disableDoubleClickZoom: true,
	  streetViewControl: false
        };
        map = new google.maps.Map(document.getElementById("mappane"),
            mapOptions);
	google.maps.event.addListener(map, "dblclick", function (e) { 
		if (viewFires){
			fire = {"id" : "FIRE2", "x" : e.latLng.lat().toFixed(6), "y" : e.latLng.lng(), "radius" : 40, "needsFed" : 0}
			fires.push(fire);
			createFireMarker(fire);
		}
		else{
			speaker = {"id" : "BLAH2", "x" : e.latLng.lat().toFixed(6), "y" : e.latLng.lng(), "radius" : 40, "volumeUp" : 0, "volumeDown" : 0};
			speakers.push(speaker);
			createSpeakerMarker(speaker);
		}
	}); 

	updateData();

	var togglebutton = document.getElementById("toggleView");
	togglebutton.onclick = function(e){
		viewFires = !viewFires;
		resetMarkers();	
		if (viewFires){
			togglebutton.innerHTML = "View Speakers";
			document.getElementById("fireinfopane").style.display = "block";
			document.getElementById("speakerinfopane").style.display = "none";
		}
		else{
			togglebutton.innerHTML = "View Fires";
			document.getElementById("fireinfopane").style.display = "none";
			document.getElementById("speakerinfopane").style.display = "block";
		}
	};

	socket.on('data', function (data){
		
	});

	socket.on('newSpeaker', function (speaker){
		createSpeakerMarker(speaker);
	});
}

initialize();

function resetMarkers(){
	for (var i = 0; i < markers.length; i++){
		markers[i].setMap(null);
	}
	markers = new Array();
	if (viewFires){
		for (var i = 0; i < fires.length; i++){
			createFireMarker(fires[i])
		}
	}
	else{
		for (var i = 0; i < speakers.length; i++){
			createSpeakerMarker(speakers[i])
		}
	}
}

function createSpeakerMarker(speaker){
	var myLatLng = new google.maps.LatLng(speaker.x, speaker.y);
	var speakerMarker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
	});
	markers.push(speakerMarker);

	//closure to make this work properly
	(function (_speaker) {
		google.maps.event.addListener(speakerMarker, 'click', function(){
			var infopane = document.getElementById("speakerinfopane");
			infopane.innerHTML = "<h3>Speaker Information for:</h3>"
			infopane.innerHTML += "<p>ID: " + _speaker.id + "</p>";
			infopane.innerHTML += "<p>Volume Up: " + _speaker.volumeUp + "</p>";
			infopane.innerHTML += "<p>Volume Down: " + _speaker.volumeDown + "</p>";
			infopane.innerHTML += "<p>Net: " + (_speaker.volumeUp - _speaker.volumeDown) + "</p>";
			infopane.innerHTML += "<p>Radius: " + _speaker.radius + "</p>";
			selectedSpeaker = _speaker.id;
			var button = document.createElement("button");
			button.innerHTML = "Reset Data";
			(function (_button) {
				button.addEventListener('click', function(){
					resetData();
				});
			})(button);
			infopane.appendChild(button);
		});
		google.maps.event.addListener(speakerMarker, 'rightclick', function(){
			if (confirm("Are you sure you want to delete this speaker?")){
				speakerMarker.setMap(null)
			}
		});
	})(speaker);
}

function createFireMarker(fire){
	var myLatLng = new google.maps.LatLng(fire.x, fire.y);
	var fireMarker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
	});
	markers.push(fireMarker);

	//closure to make this work properly
	(function (_fire) {
		google.maps.event.addListener(fireMarker, 'click', function(){
			var infopane = document.getElementById("fireinfopane");
			infopane.innerHTML = "<h3>Fire Information for:</h3>"
			infopane.innerHTML += "<p>ID: " + _fire.id + "</p>";
			infopane.innerHTML += "<p>NeedsFed: " + _fire.needsFed + "</p>";
			selectedFire = _fire.id;
			var button = document.createElement("button");
			button.innerHTML = "Reset Data";
			(function (_button) {
				button.addEventListener('click', function(){
					resetData();
				});
			})(button);
			infopane.appendChild(button);
		});
		google.maps.event.addListener(fireMarker, 'rightclick', function(){
			if (confirm("Are you sure you want to delete this speaker?")){
				fireMarker.setMap(null)
			}
		});
	})(fire);
}

function resetData(){
	if (viewFires){
		socket.emit('resetFireData', null);
	}
	else{
		socket.emit('resetSpeakerData', null);
	}
	updateData()
}

function clearFeedback(){
	//sends a message to the server to clear the feedback for this speaker
	updateData();
}

function updateData(){
	//pull the most recent feedback data from the server
	//update the information for each speaker
	socket.emit('updateTechData');
}

/*
function findSpeaker(id){
	for (var i = 0; i < speakers.length; i++){
		if (speakers[i].id === id){
			return speakers[i];
		}
	}
	return null;
}
*/

/*
function getColorFromFeedback(amount){
	//need to decrease, meaning negative amount
	var red = parseInt(-Math.min(Math.max(amount, -decreaseCutoff), 0)*(255.0 - minColor)/decreaseCutoff) + minColor;
	
	//need to increase, meaning positive amount
	var blue = parseInt(Math.max(Math.min(amount, increaseCutoff), 0)*(255.0 - minColor)/increaseCutoff) + minColor;
	//neutral
	var green = 0;
	if (blue > minColor){
		green = Math.max(0, 255 - minColor - blue) + minColor;
	}
	else{
		if (red > 255/2){
			green = Math.max(0, (255 - red)*2);
		}
		else{
			green = 255;
		}
	}
	
	var redString = red.toString(16);
	var blueString = blue.toString(16);
	var greenString = green.toString(16);
	if (redString.length == 1){
		redString = "0" + redString;
	}
	if (blueString.length == 1){
		blueString = "0" + blueString;
	}
	if (greenString.length == 1){
		greenString = "0" + greenString;
	}
		
	return "#" + redString + greenString + blueString;
}
*/
})();
