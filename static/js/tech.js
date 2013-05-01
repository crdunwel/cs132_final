(function(){
var decreaseCutoff = 200.0;
var increaseCutoff = 200.0;
var minColor = 30;
var speakerRadius = 10;
var selectedSpeaker = -1;
var speakers = new Array();
var map;
function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(41.8265, -71.4140),
          zoom: 18,
          mapTypeId: google.maps.MapTypeId.HYBRID,
	  disableDoubleClickZoom: true
        };
        map = new google.maps.Map(document.getElementById("mappane"),
            mapOptions);
	google.maps.event.addListener(map, "dblclick", function (e) { 
        	speaker = {"id" : "BLAH2", "x" : e.latLng.lat().toFixed(6), "y" : e.latLng.lng(), "radius" : 40, "volumeUp" : 0, "volumeDown" : 0};
		speakers.push(speaker);
		createMarker(speaker);
	}); 
      }
initialize();

//get request from server to get speaker data and map image

speakers.push({"id" : "BLAH0", "x" : 41.8265, "y" : -71.4140, "radius" : 40, "volumeUp" : 100, "volumeDown" : 200});
speakers.push({"id" : "BLAH1", "x" : 41.8270, "y" : -71.4140, "radius" : 40, "volumeUp" : 0, "volumeDown" : 150});

for (var i = 0; i < speakers.length; i++){
	createMarker(speakers[i])
}

function createMarker(speaker, lat, lng){
	var myLatLng = new google.maps.LatLng(speaker.x, speaker.y);
	var speakerMarker = new google.maps.Marker({
		position: myLatLng,
		map: map
	});

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

function resetData(){
	console.log(selectedSpeaker);
	//send message to server to reset data for the selected speaker.
	//only remove the amount that the speaker has in the front-end, anything new on the server should remain.
}

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

function clearFeedback(){
	//sends a message to the server to clear the feedback for this speaker
	updateData();
}

function updateData(){
	//pull the most recent feedback data from the server
	//update the information for each speaker
}

function findSpeaker(id){
	for (var i = 0; i < speakers.length; i++){
		if (speakers[i].id === id){
			return speakers[i];
		}
	}
	return null;
}
})();
