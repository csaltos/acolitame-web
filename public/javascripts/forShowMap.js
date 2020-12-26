var geocoder;
var infoWindow;
var marker;
var latitud;
var longitud;

window.onload = function () {
    latitud = document.getElementById('latitud').value ;
    longitud = document.getElementById('longitud').value ;
    var latLng;
    var opciones;
    if(latitud!=''){
        latLng = new google.maps.LatLng(parseFloat(latitud), parseFloat(longitud));
        opciones = {
        center: latLng,
        zoom: 14
        };

    }else{
        latLng = new google.maps.LatLng(-2.8994259, -79.0053617);
        opciones = {
        center: latLng,
        zoom: 14
        };
    }
    

    var map = new google.maps.Map(document.getElementById('map_canvas'), opciones);
    geocoder = new google.maps.Geocoder();
    infowindow = new google.maps.InfoWindow();
    if(latitud!=''){
        if (marker) {
            marker.setPosition(latLng);
        } else {
            marker = new google.maps.Marker({
                position: latLng,
                map: map});
        }
        infowindow.setContent('Ubicacion del local');
        infowindow.open(map, marker);
    }
    
}



