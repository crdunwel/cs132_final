(function(){
var decreaseCutoff = 200.0;
var increaseCutoff = 200.0;
var minColor = 30;
var speakerRadius = 10;
var selectedSpeaker = -1;
var speakers = new Array();

//get request from server to get speaker data and map image

speakers.push({"id" : "BLAH0", "x" : 120, "y" : 170, "radius" : 40, "volumeUp" : 100, "volumeDown" : 200});
speakers.push({"id" : "BLAH1", "x" : 120, "y" : 250, "radius" : 40, "volumeUp" : 0, "volumeDown" : 150});
speakers.push({"id" : "BLAH2", "x" : 190, "y" : 240, "radius" : 40, "volumeUp" : 1000, "volumeDown" : 1100});
speakers.push({"id" : "BLAH3", "x" : 280, "y" : 200, "radius" : 40, "volumeUp" : 100, "volumeDown" : 150});
speakers.push({"id" : "BLAH4", "x" : 400, "y" : 200, "radius" : 40, "volumeUp" : 300, "volumeDown" : 100});
speakers.push({"id" : "BLAH5", "x" : 670, "y" : 390, "radius" : 40, "volumeUp" : 100, "volumeDown" : 100});
speakers.push({"id" : "BLAH6", "x" : 680, "y" : 420, "radius" : 40, "volumeUp" : 100, "volumeDown" : 200});
speakers.push({"id" : "BLAH7", "x" : 695, "y" : 450, "radius" : 40, "volumeUp" : 100, "volumeDown" : 300});
speakers.push({"id" : "BLAH8", "x" : 710, "y" : 500, "radius" : 40, "volumeUp" : 100, "volumeDown" : 200});

var map = document.getElementById("map");
document.getElementById("mappane").style.backgroundImage = "url(map.png)";
for (var i = 0; i < speakers.length; i++){
	var speaker = speakers[i];
	var newspeaker = document.createElement('div');
	speaker["element"] = newspeaker;
	newspeaker.id = speaker.id;
	newspeaker.className = "speaker"
	newspeaker.style.position = "absolute";
	newspeaker.style.left = speaker.x + "px";
	newspeaker.style.top = speaker.y + "px";
	newspeaker.style.width = speakerRadius*2 + "px";
	newspeaker.style.height = speakerRadius*2 + "px";
	newspeaker.style.backgroundColor = getColorFromFeedback(speaker.volumeUp - speaker.volumeDown);
	//closure to make this work properly
	(function (_speaker) {
		_speaker["element"].addEventListener('click', function(){
			var infopane = document.getElementById("infopane");
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
	})(speaker);
	map.appendChild(newspeaker);
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
