var decreaseCutoff = 200.0;
var increaseCutoff = 200.0;
var minColor = 20;
var speakerRadius = 10;
var selectedSpeaker = -1;
var g = new jsGraphics("map");
var speakers = new Array();

speakers.push({"id" : "BLAH0", "x" : 120, "y" : 170, "radius" : 40, "volumeRecommendation" : -200});
speakers.push({"id" : "BLAH1", "x" : 120, "y" : 250, "radius" : 40, "volumeRecommendation" : -150});
speakers.push({"id" : "BLAH2", "x" : 190, "y" : 240, "radius" : 40, "volumeRecommendation" : -100});
speakers.push({"id" : "BLAH3", "x" : 280, "y" : 200, "radius" : 40, "volumeRecommendation" : -50});
speakers.push({"id" : "BLAH4", "x" : 400, "y" : 200, "radius" : 40, "volumeRecommendation" : 0});
speakers.push({"id" : "BLAH5", "x" : 670, "y" : 390, "radius" : 40, "volumeRecommendation" : 50});
speakers.push({"id" : "BLAH6", "x" : 680, "y" : 420, "radius" : 40, "volumeRecommendation" : 100});
speakers.push({"id" : "BLAH7", "x" : 695, "y" : 450, "radius" : 40, "volumeRecommendation" : 150});
speakers.push({"id" : "BLAH8", "x" : 710, "y" : 500, "radius" : 40, "volumeRecommendation" : 200});

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
	newspeaker.style.backgroundColor = getColorFromFeedback(speaker.volumeRecommendation);
	//closure to make this work properly
	if (typeof window.addEventListener === 'function'){
        (function (_speaker) {
            speaker["element"].addEventListener('click', function(){
                console.log("clicked" + _speaker["element"].id);
				var infopane = document.getElementById("infopane");
				infopane.innerHTML = "<h3>Speaker Information for:</h3>"
				infopane.innerHTML += "<p>ID: " + _speaker.id + "</p>";
				infopane.innerHTML += "<p>Volume Rec: " + _speaker.volumeRecommendation + "</p>";
				infopane.innerHTML += "<p>Radius: " + _speaker.radius + "</p>";
            });
        })(speaker);
    }
	map.appendChild(newspeaker);
}

// var info = document.getElementById("infopane");
// info.addEventListener('click', function(e){
	// console.log("clicked");
// }, false);

function getColorFromFeedback(amount){
	//need to decrease
	var red = parseInt(-Math.min(Math.max(amount, -decreaseCutoff), 0)*(255.0 - minColor)/decreaseCutoff) + minColor;
	//need to increase
	var blue = parseInt(Math.max(Math.min(amount, increaseCutoff), 0)*(255.0 - minColor)/increaseCutoff) + minColor;
	//neutral
	var green = Math.max(0, 255 - minColor - red - blue) + minColor;
	
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

// function drawRadius(id){
	// var speaker = findSpeaker(id);
	// g.setColor(getColorFromFeedback(speaker.volumeRecommendation));
	// g.fillEllipse(speaker.x - speaker.radius + speakerRadius, speaker.y - speaker.radius + speakerRadius, speaker.radius*2, speaker.radius*2); 
	// g.paint(); 
// }

// function updateGraphics(){
	// var g = new jsGraphics("map");
	// for (var i = 0; i < speakers.length; i++){
		// var speaker = speakers[i];
		// g.setColor(getColorFromFeedback(speaker.volumeRecommendation));
		// g.fillEllipse(speaker.x, speaker.y, speakerRadius*2, speakerRadius*2); 
		// g.paint(); 
	// }
	// if (selectedSpeaker !== -1){
		// var speaker = speakers[selectedSpeaker];
		// g.setColor(getColorFromFeedback(speaker.volumeRecommendation));
		// g.fillEllipse(speaker.x, speaker.y, speaker.radius*2, speaker.radius*2);
		// g.paint(); 
	// }
// }

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