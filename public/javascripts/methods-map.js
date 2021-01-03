var map;
var markers = [];
var marker;
var infoWindow;
var latitud;
var longitud;
var geocoder;


function initMap() {
    let idCategoria = document.getElementById('idCategoria').value;
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -2.8922687, lng: -79.0243997 },
        zoom: 14
    });
    infoWindow = new google.maps.InfoWindow();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                latitud = pos.lat;
                longitud = pos.lng;
                map.setCenter(pos);
                //console.log(latitud, longitud, idCategoria);

                let ruta;
                if (idCategoria != "") {
                    idCategoria = parseInt(idCategoria);
                    //console.log("*******------");
                    //console.log(idCategoria);
                    if (idCategoria == 0) {
                        ruta = urlData + "empresa/getCercanas/usuario/" + latitud + "/" + longitud;
                    } else {
                        ruta = urlData + "empresa/getCercanas/" + latitud + "/" + longitud + "/" + idCategoria;
                    }
                    showEmpresas(ruta);
                }

            },
            () => {
                handleLocationError(true, infoWindow, map.getCenter());
            }
        );


    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function showEmpresas(ruta) {
    clearLocations();
    //console.log(ruta);
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", ruta, true);
    ajaxRequest.onreadystatechange = function() {
        if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
            let ubicaciones = JSON.parse(ajaxRequest.responseText);
            console.log(ubicaciones);
            for (var i = 0; i < ubicaciones.length; i++) {
                let ubicacion = ubicaciones[i].ubicacion;
                let nombre = ubicaciones[i].nombreEmpresa;
                setMarkers(ubicacion[0], ubicacion[1], nombre);
            }
        }
    }
    ajaxRequest.send(null);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation ?
        "Error: The Geolocation service failed." :
        "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}

function setMarkers(latitud, longitud, nombre) {

    // var bounds = new google.maps.LatLngBounds();
    console.log(latitud, longitud, nombre, google);
    var latlng = new google.maps.LatLng(parseFloat(latitud), parseFloat(longitud));
    createMarker(latlng, nombre);
    //bounds.extend(latlng);
    //map.fitBounds(bounds);
}

function addMarker(){
    latitud = document.getElementById('latitud').value ;
    longitud = document.getElementById('longitud').value ;
    nombre = document.getElementById('nombre').value ;
    setMarkers(latitud, longitud, nombre);
}

function clearLocations() {
    if(infoWindow != undefined){
        infoWindow.close();
    }
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

function forShowMap() {
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


