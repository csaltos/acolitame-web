
//Poner en el catalogo de productos que unicamente cargue un grupo de productos/empresas. Luego con javascript ver que ha llegado al
//final del scroll y ahi hacer una nueva request para cargar el resto de productos/empresas(un numero estatico) --- repetir hasta que no haya mas que cargar
//urlData = "https://jarjarbinks.herokuapp.com/";
urlData = 'http://localhost:8080/';
let positionEmpresa = 0;
let positionProductos = 0;
let maximo = 10;

$(document).ready(function() {
    setInitial();
});

function setInitial(){
    $('#listaEmpresas').hide();
    $('#MapaShow').hide();
    changeCategory();
}

function changeView(cambio) {
    switch (cambio) {
        case "productos":
            $('#listaEmpresas').hide();
            $('#MapaShow').hide();
            $('#listaProductos').show();
            break;
        case "empresas":
            $('#listaProductos').hide();
            $('#MapaShow').hide();
            $('#listaEmpresas').show();
            break;
        case "mapa":
            $('#listaEmpresas').hide();
            $('#listaProductos').hide();
            $('#MapaShow').show();
            break;
    }
    return false;
}

function changeCategory() {
    let idCategoria = $("#selectCategorias2 option:selected").attr('href');
    //Realizo consulta para obtener las empresas de dicha categoria:
    if (positionEmpresa == 0){
        cleanOldResults();
    }
    let ruta = urlData + "empresa/categoria/" + idCategoria+"/"+positionEmpresa+"/"+maximo;
    console.log(ruta);
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", ruta, true);
    ajaxRequest.onreadystatechange = function() {
        if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
            empresas = JSON.parse(ajaxRequest.responseText);
            console.log(empresas);
            appendResultEmpresa(empresas);
            cargarProductos(idCategoria);
        }
    }
    ajaxRequest.send(null);
}

function appendResultEmpresa(empresas){
    for (var i = 0; i < empresas.length; i++) {

        let resultado = '<div class="row align-items-center justify-content-center p-3 m-3 bg-light"><div class="col">' +
            '<div class="row align-items-center justify-content-center"><a href="#" correo="' + empresas[i].correo + '" onclick=goEmpresa($(this))><img src="' + "data:image/png;base64," + empresas[i].foto + '" alt="" class="img-responsive pr-2" height=150 width=150></a></div>' +
            '<div class="row align-items-center justify-content-center"><a href="#" correo="' + empresas[i].correo + '" onclick=goEmpresa($(this))><p>' + empresas[i].nombre + '</p></a></div></div></div>';

        console.log(resultado);
        $('#listaEmpresas').append(resultado);
    }

}

function cargarProductos(idCategoria){
    let ruta = urlData + "producto/categoria/" + idCategoria + "/"+positionProductos+"/"+maximo;
    console.log(ruta);
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", ruta, true);
    ajaxRequest.onreadystatechange = function() {
        if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {

            let productos = JSON.parse(ajaxRequest.responseText);
            appendResultProduct(productos);

        }
    }
    ajaxRequest.send(null);
}

function appendResultProduct(productos){
    for (var j = 0; j < productos.length; j++) {
        producto = productos[i];
        let resultado = '<div class="row align-items-center justify-content-center p-3 m-3 bg-light"><div class="col">' +
            '<div class="row align-items-center justify-content-center"><p>' + producto.nombreEmpresa + '</p></div>' +
            '<div class="row align-items-center justify-content-center"><a href="#" nombre="' + producto.nombreEmpresa + '" codE="' + producto.idEmpresa + '" codP="' + producto.idProducto + '" onclick=goProducto($(this))><img src="' + 'data:image/png;base64,' + producto.foto + '" alt="" class="img-responsive pr-2" height=150 width=150></a></div>' +
            '<div class="row align-items-center justify-content-center"><a href="#" nombre="' + producto.nombreEmpresa + '" codE="' + producto.idEmpresa + '" codP="' + producto.idProducto + '" onclick=goProducto($(this))><p>' + producto.nombre + '</p></a></div></div></div>';
        $('#listaProductos').append(resultado);

    }
}

function searchEmpresa() {
    let busqueda = document.getElementById('valueSearch').value.toLowerCase();
    document.getElementById('categoriaActualNombre').value = 'Busqueda';
    if (busqueda.length>4){
        cleanOldResults();
        let ruta = urlData + "empresa/nombre/"+busqueda;
        console.log(ruta);
        let ajaxRequest = new XMLHttpRequest();
        ajaxRequest.open("GET", ruta, true);
        ajaxRequest.onreadystatechange = function() {
            if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {

                empresasResult = JSON.parse(ajaxRequest.responseText);

                appendResultEmpresa(empresasResult);
                //Poner para graficar en el mapa

            }
        }
        ajaxRequest.send(null);
    }else{
        window.alert('Ingrese mas de 4 caracteres para la busqueda.')
    }
}

function searchProducto(nombre){
    let ruta = urlData + "producto/nombre/"+nombre;
    console.log(ruta);
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", ruta, true);
    ajaxRequest.onreadystatechange = function() {
        if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
            productosResult = JSON.parse(ajaxRequest.responseText);
            appendResultProduct(productosResult);

        }
    }
    ajaxRequest.send(null);
}

function cleanOldResults() {
    var element = document.getElementById("listaEmpresas");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    var element2 = document.getElementById("listaProductos");
    while (element2.firstChild) {
        element2.removeChild(element2.firstChild);
    }
}

function goProducto(etiqueta){
    console.log(etiqueta[0]);
}

function goEmpresa(etiqueta){
    console.log(etiqueta[0]);
}
