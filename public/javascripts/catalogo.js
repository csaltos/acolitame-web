
//Poner en el catalogo de productos que unicamente cargue un grupo de productos/empresas. Luego con javascript ver que ha llegado al
//final del scroll y ahi hacer una nueva request para cargar el resto de productos/empresas(un numero estatico) --- repetir hasta que no haya mas que cargar

let positionEmpresa = 0;
var empresas = [];
var productos = [];
let positionProductos = 0;
let maximo = 10;
var id_categoria;

$(document).ready(function() {
    setInitial();
});

function setInitial(){
    $('#empresas').hide();
    $('#MapaShow').hide();
    changeCategory();
}

function changeView(cambio) {
    switch (cambio) {
        case "productos":
            $('#empresas').hide();
            $('#MapaShow').hide();
            $('#productos').show();
            break;
        case "empresas":
            $('#productos').hide();
            $('#MapaShow').hide();
            $('#empresas').show();
            break;
        case "mapa":
            $('#empresas').hide();
            $('#productos').hide();
            $('#MapaShow').show();
            break;
    }
    return false;
}

function changeCategory() {
    id_categoria = $("#selectCategorias2 option:selected").attr('href');
    console.log($("#selectCategorias2 option:selected").attr('name'));
    //Realizo consulta para obtener las empresas de dicha categoria:
    document.getElementById('categoriaActualNombre').innerHTML = $("#selectCategorias2 option:selected").attr('name');
    positionEmpresa = 0;
    positionProductos = 0;
    cleanOldResults();
    $('#frameUbicacion').attr('src', 'http://localhost:3000/miUbicacion/'+id_categoria);
    cargarEmpresas();
    $('.btn-secondary').show();
}

function cargarEmpresas(){
    if(id_categoria !== undefined){
        let ruta = urlData + "empresa/categoria/" + id_categoria+"/"+positionEmpresa+"/"+maximo;
        console.log(ruta);
        let ajaxRequest = new XMLHttpRequest();
        ajaxRequest.open("GET", ruta, true);
        ajaxRequest.onreadystatechange = function() {
            if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
                resultEmpresas = JSON.parse(ajaxRequest.responseText);
                console.log(resultEmpresas);
                appendResultEmpresa(resultEmpresas, id_categoria);
                positionEmpresa+=maximo;
                cargarProductos();
            }
        }
        ajaxRequest.send(null);
    }
    
}

function appendResultEmpresa(resultEmpresas, idCategory){
    console.log(resultEmpresas, idCategory);
    for (var i = 0; i < resultEmpresas.length; i++) {
        empresa = resultEmpresas[i];
        empresas.push(empresa);
        let resultado = '<div class="row align-items-center justify-content-center p-3 m-3 bg-light"><div class="col">' +
            '<div class="row align-items-center justify-content-center"><a href="'+home+'catalogo/empresa/' + empresa.id_empresa + '" ><img src="'+ empresa.foto + '" alt="" class="img-responsive pr-2" height=150 width=150></a></div>' +
            '<div class="row align-items-center justify-content-center"><a href="'+home+'catalogo/empresa/' + empresa.id_empresa + '" ><p>' + empresa.nombre + '</p></a></div></div></div>';

        console.log(resultado);
        $('#listaEmpresas').append(resultado);
        if(idCategory < 0){
            frame = document.getElementById('frameUbicacion').contentWindow.document;
            frame.getElementById('latitud').value = empresa.latitud;
            frame.getElementById('longitud').value = empresa.longitud;
            frame.getElementById('nombre').value = empresa.nombre;
            frame.getElementById('addMarker').click();
        }
    }
    if(idCategory > 0){
        var iframe = document.getElementById('MapaShow');
        iframe.src = home+'miUbicacion/'+idCategory;
    }
}

function cargarProductos(){
    if(id_categoria !== undefined){
        let ruta = urlData + "producto/categoria/" + id_categoria + "/"+positionProductos+"/"+maximo;
        console.log(ruta);
        let ajaxRequest = new XMLHttpRequest();
        ajaxRequest.open("GET", ruta, true);
        ajaxRequest.onreadystatechange = function() {
            if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
    
                let resultProductos = JSON.parse(ajaxRequest.responseText);
                appendResultProduct(resultProductos);
                positionProductos+=maximo;
            }
        }
        ajaxRequest.send(null);
    }
    
}

function searchEmpresa() {
    $('.btn-secondary').hide();
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
                console.log(empresasResult);
                //console.log(document.getElementById('frameUbicacion').contentWindow.document.getElementById('cleanMarkers'));
                document.getElementById('frameUbicacion').contentWindow.document.getElementById('cleanMarkers').click();
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
    empresas = [];
    productos = [];
}

function goProducto(pos){
    
    var productoSelected = productos[pos];
    showInfoProducto(productoSelected, true, window.location.href);
        
}

function goEmpresa(ruta){
    window.location.href = ruta;
}
