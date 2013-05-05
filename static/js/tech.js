//entire code is in closure to make it run right away
(function(){
//array of markers so they can be managed
var markers = new Array();
var map;
//boolean determining the view
var viewFires = true;
var selected = -1;
var socket = io.connect();

socket.emit("techConnect");

function initialize() {
        var mapOptions = {
	//these are approximate coordinates for waterfire
          center: new google.maps.LatLng(41.8265, -71.4140),
          zoom: 18,
          mapTypeId: google.maps.MapTypeId.HYBRID,
	//want double click to add things
	  disableDoubleClickZoom: true,
	  streetViewControl: false
        };
        map = new google.maps.Map(document.getElementById("mappane"),
            mapOptions);
	google.maps.event.addListener(map, "dblclick", function (e) { 
		if (viewFires){
			socket.emit('newFire', e.latLng.lat(), e.latLng.lng());
		}
		else{
			socket.emit('newSpeaker', e.latLng.lat(), e.latLng.lng());
		}
	}); 

	updateData();

	var togglebutton = document.getElementById("toggleView");
	togglebutton.onclick = function(e){
		viewFires = !viewFires;
		updateData();
		//hide the appropriate pane
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

	//receiving data from server
	//clear markers and recreate them
	socket.on('data', function (data){
		resetMarkers();
		if (viewFires){
			var selectedFire = null;
			for (var i = 0; i < data.fires.length; i++){
				createFireMarker(data.fires[i]);
				if (selected === data.fires[i].id){
					selectedFire = data.fires[i];
				}
			}
			//update the selected fire's displayed info without having to click it
			if (selectedFire){
				var infopane = document.getElementById("fireinfopane");
				infopane.innerHTML = "<h3>Fire Information for:</h3>";
				infopane.innerHTML += "<p>ID: " + selectedFire.id + "</p>";
				infopane.innerHTML += "<p>Feed Requests: " + selectedFire.needsFed + "</p>";
				var button = document.createElement("button");
				button.innerHTML = "Reset Data";
				(function (_button) {
					button.addEventListener('click', function(){
						socket.emit('resetFireData', selectedFire);
					});
				})(button);
				infopane.appendChild(button);
			}
		}
		else{
			var selectedSpeaker = null;
			for (var i = 0; i < data.speakers.length; i++){
				createSpeakerMarker(data.speakers[i]);
				if (selected === data.speakers[i].id){
					selectedSpeaker = data.speakers[i];
				}
			}
			//update the selected speaker's displayed info without having to click it
			if (selectedSpeaker){
				var infopane = document.getElementById("speakerinfopane");
				infopane.innerHTML = "<h3>Speaker Information for:</h3>"
				infopane.innerHTML += "<p>ID: " + selectedSpeaker.id + "</p>";
				infopane.innerHTML += "<p>Volume Up Requests: " + selectedSpeaker.volumeUp + "</p>";
				infopane.innerHTML += "<p>Volume Down Requests: " + selectedSpeaker.volumeDown + "</p>";
				infopane.innerHTML += "<p>Net Requests: " + (selectedSpeaker.volumeUp - selectedSpeaker.volumeDown) + "</p>";
				var button = document.createElement("button");
				button.innerHTML = "Reset Data";
				(function (_button) {
					button.addEventListener('click', function(){
						socket.emit('resetSpeakerData', selectedSpeaker);
					});
				})(button);
				infopane.appendChild(button);
			}
		}
	});
}

initialize();

//clear the markers by setting their maps to null
function resetMarkers(){
	for (var i = 0; i < markers.length; i++)
    	{
		markers[i].setMap(null);
	}
	markers = new Array();
}

function createSpeakerMarker(speaker){
	var myLatLng = new google.maps.LatLng(speaker.latitude, speaker.longitude);
	var icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
	if (speaker.volumeUp - speaker.volumeDown > 100 || speaker.volumeUp - speaker.volumeDown < -100){
		icon = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
	}
	var speakerMarker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		icon: icon
	});
	markers.push(speakerMarker);

	//closure to make this work properly
	(function (_speaker) {
		google.maps.event.addListener(speakerMarker, 'click', function(){
			var infopane = document.getElementById("speakerinfopane");
			infopane.innerHTML = "<h3>Speaker Information for:</h3>"
			infopane.innerHTML += "<p>ID: " + _speaker.id + "</p>";
			infopane.innerHTML += "<p>Volume Up Requests: " + _speaker.volumeUp + "</p>";
			infopane.innerHTML += "<p>Volume Down Requests: " + _speaker.volumeDown + "</p>";
			infopane.innerHTML += "<p>Net Requests: " + (_speaker.volumeUp - _speaker.volumeDown) + "</p>";
			selected = _speaker.id;
			var button = document.createElement("button");
			button.innerHTML = "Reset Data";
			(function (_button) {
				button.addEventListener('click', function(){
					socket.emit('resetSpeakerData', _speaker);
				});
			})(button);
			infopane.appendChild(button);
		});
		google.maps.event.addListener(speakerMarker, 'rightclick', function(){
			if (confirm("Are you sure you want to delete this speaker?")){
				//speakerMarker.setMap(null)
				socket.emit('removeSpeaker', _speaker);
			}
		});
	})(speaker);
}

function createFireMarker(fire){
	var myLatLng = new google.maps.LatLng(fire.latitude, fire.longitude);
	var icon = 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
	if (fire.needsFed > 50){
		icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
	}
	var fireMarker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		icon: icon,
        fire: fire
	});
	markers.push(fireMarker);

	//closure to make this work properly
	(function (_fire) {
		google.maps.event.addListener(fireMarker, 'click', function(){
			var infopane = document.getElementById("fireinfopane");
			infopane.innerHTML = "<h3>Fire Information for:</h3>";
			infopane.innerHTML += "<p>ID: " + _fire.id + "</p>";
			infopane.innerHTML += "<p>Feed Requests: " + _fire.needsFed + "</p>";
			selected = _fire.id;
			var button = document.createElement("button");
			button.innerHTML = "Reset Data";
			(function (_button) {
				button.addEventListener('click', function(){
					socket.emit('resetFireData', _fire);
				});
			})(button);
			infopane.appendChild(button);
		});
		google.maps.event.addListener(fireMarker, 'rightclick', function(){
			if (confirm("Are you sure you want to delete this speaker?")){
				socket.emit('removeFire', _fire);
			}
		});
	})(fire);
}

function updateData(){
	//pull the most recent feedback data from the server
	//update the information for each speaker
	socket.emit('updateTechData');
}

//debug code to display the location of a user when they send a request
socket.on('sendMobileData', function(data)
{
    var obj = JSON.parse(data);
    // creates marker on map where location of sender is
    createFireMarker({"id":2343,"needsFed":50,"latitude":obj.latitude,"longitude":obj.longitude});
    //markers[shortest_node].fire.needsFed += 1;
});


})();
