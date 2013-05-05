(function(){
var markers = new Array();
var map;
var viewFires = true;
var socket = io.connect();

socket.emit("techConnect");

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
			socket.emit('newFire', e.latLng.lat(), e.latLng.lng());
		}
		else{
			socket.emit('newSpeaker', e.latLng.lat(), e.latLng.lng());
		}
	}); 

	updateData();

	//var firesdata = JSON.parse(firesJSON);
	//for (var i = 0; i < firesdata.length; i++){
	//	socket.emit('newFire', firesdata[i].latitude, firesdata[i].longitude);
	//}

	var togglebutton = document.getElementById("toggleView");
	togglebutton.onclick = function(e){
		viewFires = !viewFires;
		updateData();
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

	socket.on('data', function (data)
    {
		resetMarkers();
		if (viewFires)
        {
			for (var i = 0; i < data.fires.length; i++)
            {
				createFireMarker(data.fires[i]);
			}
		}
		else
        {
			for (var i = 0; i < data.speakers.length; i++)
            {
				createSpeakerMarker(data.speakers[i]);
			}
		}
	});
}

initialize();

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
			infopane.innerHTML += "<p>Volume Up: " + _speaker.volumeUp + "</p>";
			infopane.innerHTML += "<p>Volume Down: " + _speaker.volumeDown + "</p>";
			infopane.innerHTML += "<p>Net: " + (_speaker.volumeUp - _speaker.volumeDown) + "</p>";
			infopane.innerHTML += "<p>Radius: " + _speaker.radius + "</p>";
			selectedSpeaker = _speaker.id;
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
			infopane.innerHTML += "<p>NeedsFed: " + _fire.needsFed + "</p>";
			selectedFire = _fire.id;
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

function resetData(){
	if (viewFires){
		socket.emit('resetFireData', null);
	}
	else{
		socket.emit('resetSpeakerData', null);
	}
	updateData()
}

function updateData(){
	//pull the most recent feedback data from the server
	//update the information for each speaker
	socket.emit('updateTechData');
}

socket.on('sendMobileData', function(data)
{
    var obj = JSON.parse(data);
    console.log(data);
    var shortest_dist = Number.POSITIVE_INFINITY;
    var shortest_node = -1;
    for (var item in markers)
    {
        var lat = markers[item].position.lat();
        var lng = markers[item].position.lng();
        var lat_diff = lat - obj.latitude;
        var lng_diff = lng - obj.longitude;
        var dist = Math.sqrt(lat_diff*lat_diff + lng_diff*lng_diff);
        if (dist < shortest_dist)
        {
            shortest_dist = dist;
            shortest_node = item;
        }
    }
    // creates marker on map where location of sender is
    createFireMarker({"id":2343,"needsFed":50,"latitude":obj.latitude,"longitude":obj.longitude});
    //markers[shortest_node].fire.needsFed += 1;
});


})();
