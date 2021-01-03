


function managingProduct(id_producto, id_empresa){
    let ruta = urlData + "producto/id/" + id_producto;
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
            '<h5 class="modal-title">' + document.getElementById("nombreEmpresaT").innerHTML + '</h5>' +
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
            '<img src="' + "data:image/png;base64," + productoSelected.foto + '" alt="" class="img-responsive pr-2"></div></div>' +
            '</div>' +
            '<div class="alert alert-dismissible alert-danger" id="errorCarrito">' +
            '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
            '<strong>Ya tiene este producto en el </strong><a href="pedidos" class="alert-link" >CARRITO</a>' +
            '</div>';

            /*if (getCookie('tipoCuenta') != 'administrador') {
                codigo += '<div class="row align-items-center justify-content-center mb-5">' +
                    '<div class="col-md-auto ">' +
                    '<button type="button" onclick="saveCarrito()" class="btn btn-info mr-3">Añadir al carrito</button></div>' +
                    '</div>';
            }*/
            codigo += '<div class="row align-items-center justify-content-center mb-5">' +
                    '<div class="col-md-auto ">' +
                    '<button type="button" onclick="saveCarrito(\'' + id_empresa + '\',\'' + id_producto + '\')" class="btn btn-info mr-3">Añadir al carrito</button></div>' +
                    '</div>';
            codigo += '<div class="modal-footer">' +
                '<button type="button" onclick="cleanProducto()" class="btn btn-secondary" >Cerrar</button>' +
                '</div></div></div></div>';
            $("#forModalProd").append(codigo);
            $('#errorCarrito').hide();
            $('#myModalProducto').modal('show');
        }
    }
    ajaxRequest.send(null);
    
}