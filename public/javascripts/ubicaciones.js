var map;
var markers = [];
var infoWindow;
var latitud;
var longitud;

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
                        ruta = urlData + "empresa/getCercanas/usuario/" + latitud + "/" + longitud + "/" + idCategoria;
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
            //console.log(ubicaciones);
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

