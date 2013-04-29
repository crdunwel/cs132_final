(function(){
var decreaseCutoff = 200.0;
var increaseCutoff = 200.0;
var minColor = 30;
var fireRadius = 10;
var selectedFire = -1;
var fires = new Array();
var map;
function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(41.8265, -71.4140),
          zoom: 18,
          mapTypeId: google.maps.MapTypeId.HYBRID
        };
        map = new google.maps.Map(document.getElementById("mappane"),
            mapOptions);
      }
initialize();
//get request from server to get speaker data and map image

fires.push({"id" : "FIRE0", "x" : 41.8265, "y" : -71.4140, "radius" : 40, "needsFed" : 0});
fires.push({"id" : "FIRE1", "x" : 41.8270, "y" : -71.4140, "radius" : 40, "needsFed" : 0});
//color system may have to be changed
for (var i = 0; i < fires.length; i++){
	var fire = fires[i];
	var myLatLng = new google.maps.LatLng(fire.x, fire.y);
	var fireMarker = new google.maps.Marker({
		position: myLatLng,
		map: map
	});

	var newfire = document.createElement('div');
	fire["element"] = newfire;
	//closure to make this work properly
	(function (_fire) {
		google.maps.event.addListener(fireMarker, 'click', function(){
			console.log("clicked");
			var infopane = document.getElementById("fireInfoPane");
			infopane.innerHTML = "<h3>Fire Information for:</h3>"
			infopane.innerHTML += "<p>ID: " + _fire.id + "</p>";
			infopane.innerHTML += "<p>Needs Fed: " + _fire.needsFed + "</p>";
			infopane.innerHTML += "<p>Radius: " + _fire.radius + "</p>";
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
	})(fire);
	//map.appendChild(newfire);
}
function resetData(){
	console.log(selectedSpeaker);
	//send message to server to reset data for the selected speaker.
	//only remove the amount that the speaker has in the front-end, anything new on the server should remain.
}

function getColorFromFeedback(amount){
	//need to decrease, meaning negative amount
	var red = 255-amount;
	if(red<25){
		red = 25;
	}
	
	//need to increase, meaning positive amount
	var blue = amount/2;
	if(blue>255){
		blue = 255;
	}
	//neutral
	var green = amount/2;
	if(green>255){
		green = 255;
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

function findFire(id){
	for (var i = 0; i < firess.length; i++){
		if (fires[i].id === id){
			return fires[i];
		}
	}
	return null;
}
})();
