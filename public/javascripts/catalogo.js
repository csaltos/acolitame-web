
//Poner en el catalogo de productos que unicamente cargue un grupo de productos/empresas. Luego con javascript ver que ha llegado al
//final del scroll y ahi hacer una nueva request para cargar el resto de productos/empresas(un numero estatico) --- repetir hasta que no haya mas que cargar

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
    
    if(idCategoria !== undefined){
        let ruta = urlData + "empresa/categoria/" + idCategoria+"/"+positionEmpresa+"/"+maximo;
        console.log(ruta);
        let ajaxRequest = new XMLHttpRequest();
        ajaxRequest.open("GET", ruta, true);
        ajaxRequest.onreadystatechange = function() {
            if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
                empresas = JSON.parse(ajaxRequest.responseText);
                console.log(empresas);
                appendResultEmpresa(empresas, idCategoria);
                positionEmpresa+=maximo;
                cargarProductos(idCategoria);
            }
        }
        ajaxRequest.send(null);
    }
}

function appendResultEmpresa(empresas, idCategory){
    for (var i = 0; i < empresas.length; i++) {

        let resultado = '<div class="row align-items-center justify-content-center p-3 m-3 bg-light"><div class="col">' +
            '<div class="row align-items-center justify-content-center"><a href="'+home+'catalogo/empresa/' + empresas[i].idEmpresa + '" ><img src="' + "data:image/png;base64," + empresas[i].foto + '" alt="" class="img-responsive pr-2" height=150 width=150></a></div>' +
            '<div class="row align-items-center justify-content-center"><a href="'+home+'catalogo/empresa/' + empresas[i].idEmpresa + '" ><p>' + empresas[i].nombre + '</p></a></div></div></div>';

        console.log(resultado);
        $('#listaEmpresas').append(resultado);
        if(idCategory < 0){
            setMarkers(empresas[i].lat, empresas[i].lon, empresas[i].nombre);
        }
    }
    if(idCategory > 0){
        var iframe = document.getElementById('MapaShow');
        iframe.src = home+'miUbicacion/'+idCategory;
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
            positionProductos+=maximo;
        }
    }
    ajaxRequest.send(null);
}

function appendResultProduct(productos){
    for (var j = 0; j < productos.length; j++) {
        producto = productos[i];
        let resultado = '<div class="row align-items-center justify-content-center p-3 m-3 bg-light"><div class="col">' +
            '<div class="row align-items-center justify-content-center"><p>' + producto.nombreEmpresa + '</p></div>' +
            '<div class="row align-items-center justify-content-center"><a href="#" idProducto='+producto.idProducto+' idEmpresa="' + producto.idEmpresa + '" onclick=goProducto($(this))><img src="' + 'data:image/png;base64,' + producto.foto + '" alt="" class="img-responsive pr-2" height=150 width=150></a></div>' +
            '<div class="row align-items-center justify-content-center"><a href="#" idProducto='+producto.idProducto+' idEmpresa="' + producto.idEmpresa + '" onclick=goProducto($(this))><p>' + producto.nombre + '</p></a></div></div></div>';
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
                clearLocations();
                appendResultEmpresa(empresasResult, -1);
                searchProducto(busqueda);
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
    positionEmpresa = 0;
    positionProductos = 0;
}

function goProducto(etiqueta){
    console.log(etiqueta[0]);
    let codE = $(etiqueta)[0].getAttribute("idEmpresa");
    let codP = $(etiqueta)[0].getAttribute("idProducto");
    let ruta = urlData + "producto/idProducto/" + codP + "/idEmpresa/" + codE;
    console.log(ruta);
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", ruta, true);
    ajaxRequest.onreadystatechange = function() {
        if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {

            var productoSelected = JSON.parse(ajaxRequest.responseText);
            let codigo = '<div class="modal" id="myModalProducto">' +
                '<div class="modal-dialog p-5" role="document">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h5 class="modal-title">' + nombre + '</h5>' +
                '<button type="button" onclick="cleanProducto()" class="close" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span>' +
                '</button>' +
                '</div>' +
                '<div class="modal-body">' +
                '<div class="md-form mb-5 form-group">' +
                '<label>Nombre del producto:</label><p>' + productoSelected.nombre + '</p>' +
                '<label>Descripcion del producto: </label>' + productoSelected.descripcion + '</p>' +
                '<label>Precio del producto: </label><p>' + productoSelected.precio + '</p></div>' +

                '<div class="row align-items-center justify-content-center mb-5">' +
                '<div class="col-md-auto ">' +
                '<img src="' + 'data:image/png;base64,' + productoSelected.foto + '" alt="" class="img-responsive pr-2"></div></div>' +
                '</div>' +
                '<div class="alert alert-dismissible alert-danger" id="errorCarrito">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>Ya tiene este producto en el </strong><a href="pedidos" class="alert-link" >CARRITO</a>' +
                '</div>' +
                '<div class="row align-items-center justify-content-center mb-5">' +
                '<div class="col-auto col-md-auto ">';
            if (getCookie('tipoCuenta') != 'administrador') {
                codigo += '<button type="button" onclick="saveCarrito(\'' + codE + '\',\'' + productoSelected.idProducto + '\')" class="btn btn-info mr-3">Añadir al carrito</button>';
            }
            codigo += '<button type="button" onclick="goEmpresaB(\'' + correo + '\')" class="btn btn-success">Visitar empresa</button></div>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<div class="col-auto col-md-auto "><button type="button" onclick="cleanProducto()" class="btn btn-secondary">Cerrar</button></div>' +
                '</div></div></div></div>';
            $("#forModalProd").append(codigo);
            $('#errorCarrito').hide();
            $('#myModalProducto').modal('show');
            console.log(codigo);
        }
    }
    ajaxRequest.send(null);
}
