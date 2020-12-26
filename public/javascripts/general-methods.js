

var urlData = 'http://localhost:8080/';
//urlData = "https://jarjarbinks.herokuapp.com/";
var home = 'http://localhost:3000/';

function setMarkers(latitud, longitud, nombre) {

    // var bounds = new google.maps.LatLngBounds();
    var latlng = new google.maps.LatLng(parseFloat(latitud), parseFloat(longitud));
    createMarker(latlng, nombre);
    //bounds.extend(latlng);
    //map.fitBounds(bounds);

}

function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}

function createMarker(latlng, name) {
    var html = "<b>" + name + "</b>";
    var marker = new google.maps.Marker({
        map: map,
        position: latlng
    });
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    markers.push(marker);
}