
//Poner en el catalogo de productos que unicamente cargue un grupo de productos/empresas. Luego con javascript ver que ha llegado al
//final del scroll y ahi hacer una nueva request para cargar el resto de productos/empresas(un numero estatico) --- repetir hasta que no haya mas que cargar

$(document).ready(function() {
    $('#listaEmpresas').hide();
});

function changeView(cambio) {
    if (cambio == 'productos') {
        $('#listaEmpresas').hide();
        $('#listaProductos').show();
    } else {
        $('#listaProductos').hide();
        $('#listaEmpresas').show();
    }
    return false;
}

function goProducto(etiqueta){
    console.log(etiqueta[0]);
}

function goEmpresa(etiqueta){
    console.log(etiqueta[0]);
}
