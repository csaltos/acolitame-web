var urlData = 'http://localhost:8080/';
//urlData = "https://jarjarbinks.herokuapp.com/";
var home = 'http://localhost:3000/';

function cleanProducto() {
    $('#myModalProducto').modal('hide');
    var element = document.getElementById("forModalProd");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function appendResultProduct(resultProductos){
    for (var j = 0; j < resultProductos.length; j++) {
        producto = resultProductos[j];
        productos.push(producto);
        console.log(producto);
        let resultado = '<div class="row align-items-center justify-content-center p-3 m-3 bg-light"><div class="col">' +
            '<div class="row align-items-center justify-content-center"><p>' + producto.nombreEmpresa + '</p></div>' +
            '<div class="row align-items-center justify-content-center"><a href="#" onclick=\'return goProducto('+j+')\'><img src="' + 'data:image/png;base64,' + producto.foto + '" alt="" class="img-responsive pr-2" height=150 width=150></a></div>' +
            '<div class="row align-items-center justify-content-center"><a href="#" onclick=\'return goProducto('+j+')\'><p>' + producto.nombre + '</p></a></div></div></div>';
        $('#listaProductos').append(resultado);
    }
    
}


function showInfoProducto(productoSelected, extra_button, pagina){
    let codigo = '<div class="modal" id="myModalProducto">' +
        '<div class="modal-dialog p-5" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<h5 class="modal-title">' + productoSelected.nombreEmpresa + '</h5>' +
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
    /*if (getCookie('tipoCuenta') != 'administrador') {
        codigo += '<button type="button" onclick="saveCarrito(\'' + codE + '\',\'' + productoSelected.idProducto + '\')" class="btn btn-info mr-3">Añadir al carrito</button>';
    }*///codigo+='<form id="theFormCarrito"  method="post" action="'+home+'catalogo/saveCarrito"  hidden><input type="text" value="'+productoSelected.id_empresa+'"><input type="text" value="'+productoSelected.id_producto+'"><input type="text" value="'+pagina+'"></form>';
    usuarioEmpresa = (document.getElementById('usuarioEmpresa').value === 'true')
    console.log('userEmp', usuarioEmpresa);
    if(!usuarioEmpresa){
        codigo += '<button type="button" onclick="saveCarrito('+productoSelected.id_empresa+', '+productoSelected.id_producto+')" class="btn btn-info">Añadir al carrito</button>';
    }
    if (extra_button){
        codigo += '<button type="button" onclick="goEmpresa(\''+home+'catalogo/empresa/'+productoSelected.id_empresa+'\')" class="btn btn-success ml-3">Visitar empresa</button></div></div>';
    }
    codigo += '<div class="row align-items-center justify-content-center">' +
    '<div class="col-auto col-md-auto ">' + '<div class="modal-footer ">' +
        '<button type="button" onclick="cleanProducto()" class="btn btn-secondary" >Cerrar</button>' +
        '</div></div></div></div></div>';
    $("#forModalProd").append(codigo);
    $('#errorCarrito').hide();
    $('#myModalProducto').modal('show');
}

function saveCarrito(id_empresa, id_producto) {
    var data = {};
    data.id_empresa = parseInt(id_empresa);
    data.id_producto = parseInt(id_producto);
    token = localStorage.getItem("token");
    console.log(token);
    if (token == null){
        console.log('Iniciar sesion');
        cleanProducto();
    }else{
        console.log('Save carrito');
        /*let xhr = new XMLHttpRequest();
        xhr.open('POST', urlData + 'pedido/insertarCarrito', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.setRequestHeader('Authorization', token);
        xhr.onload = function() {
            if (xhr.readyState == 4 && xhr.status == "200") {
                cleanProducto();
            }
            if (xhr.readyState == 4 && xhr.status == "404") {
                $('#errorCarrito').show();
            }
            if (xhr.readyState == 4 && xhr.status == "403") {
                cleanProducto();
                console.log('iniciar sesion');
            }
        }
        xhr.send(JSON.stringify(data));*/
    }
    
}

function initImageRead(){
    const boton = document.getElementById("cargarfoto");
    const otro = document.getElementById("imgInp");
    boton.addEventListener("click", function() {
        otro.click();
    });
    $("#imgInp").change(function() {
        console.log(this);
        readImage(this);
    });
}

function readImage(input) {

    enviar = /\.(gif|jpg|png)$/i.test(document.getElementById('imgInp').value);
    console.log(enviar);
    if (!enviar) {
        alert("No seleccionó imagen o el formato no es válido");
        $('#imagen').attr('src', '');
    } else {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#imagen').attr('src', e.target.result); // Renderizamos la imagen

            }
            reader.readAsDataURL(input.files[0]);
        }
    }

}


function actSesion() {
    retorno = window.location.href;
    $('#errorCorreo').hide();
    $('#errorData').hide();
    $('#errorValidar').hide();
    $('#myModalSesion').modal('show');
}

function crearCuenta() {
    $('#myModalSesion').modal('hide');
    $('#myModalCrear').modal('show');
}


