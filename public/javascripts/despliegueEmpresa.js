


function managingProduct(id_producto, id_empresa){
    let ruta = urlData + "producto/id/" + id_producto;
    console.log(ruta);
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", ruta, true);
    ajaxRequest.onreadystatechange = function() {
        if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {

            var productoSelected = JSON.parse(ajaxRequest.responseText);
            productoSelected.nombreEmpresa = document.getElementById("nombreEmpresaT").innerHTML;
            productoSelected.id_empresa = id_empresa;
            productoSelected.id_producto = id_producto;
            showInfoProducto(productoSelected, false, window.location.href);
        }
    }
    ajaxRequest.send(null);
    
}