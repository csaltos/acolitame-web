

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

function saveCarrito(idEmpresa, idProducto) {
    console.log(idEmpresa, idProducto);
    /*if (getCookie('tipoCuenta') == 'outsider') {
        cleanProducto();
        actSesion('/catalogo');
    } else {
        var data = {};
        data.idEmpresa = parseInt(idEmpresa);
        data.idUsuario = usuarioActual.idUsuario;
        data.idProducto = parseInt(idProducto);
        let xhr = new XMLHttpRequest();
        xhr.open('POST', urlData + 'pedido/insertarCarrito', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.onload = function() {
            var emp = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {
                console.log(emp);

                cleanProducto();
            }
            if (xhr.readyState == 4 && xhr.status == "404") {
                $('#errorCarrito').show();
            }
        }
        xhr.send(JSON.stringify(data));
    }*/

}

function actSesion(retorno) {

    let estado = "Iniciar Sesion";
    console.log(estado);
    if (estado == "Iniciar Sesion") {
        let codigo = '<div class="modal" id="myModalSesion">' +
            '<div class="modal-dialog p-5" role="document">' +
            '<div class="modal-content">' +
            '<div class="modal-header justify-content-center">' +
            '<h5 class="modal-title ">INICIAR SESION</h5>' +
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>' +
            '</div>' +
            '<div class="modal-body">' +
            '<div class="md-form my-5 form-group">' +
            '<label>Correo:</label><input type="text" id="correo" name="correo" class="form-control" required style="border: 1px solid black;"/>' +
            '<label>Contraseña: </label><input type="password" id="clave" name="clave" class="form-control" style="border: 1px solid black;" required />' +
            '<div class="alert alert-dismissible alert-danger" id="errorData">' +
            '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
            '<strong>Correo o contraseña incorrectos.</strong>' +
            '</div>' +
            '<div class="alert alert-dismissible alert-danger" id="errorValidar">' +
            '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
            '<strong>Verifique su correo.</strong>' +
            '</div>' +
            '<div class="row align-items-center justify-content-center mt-3 my-5">' +
            '<div class="col-md-auto ">' +
            '<button type="button" onclick="validarSesion(\'' + retorno + '\')" class="btn btn-success mr-3">Iniciar Sesion</button>' +
            '<button type="button" onclick="crearCuenta()" class="btn btn-primary" data-dismiss="modal">Crear cuenta</button></div>' +
            '</div>' +
            '<hr class="my-4">' +
            '<div class="row align-items-center justify-content-center">' +
            '<div class="col-md-auto ">' +
            '<button type="button" onclick="iniciarFacebook()" class="btn btn-info mr-3">Facebook</button>' +
            '<button type="button" onclick="iniciarGoogle()" class="btn btn-danger mr-3">Google</button></div>' +
            '</div></div></div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-secondary" data-dismiss="modal" >Cerrar</button>' +
            '</div></div></div></div>';
        $("#forModalSesion").append(codigo);
        $('#errorCorreo').hide();
        $('#errorData').hide();
        $('#errorValidar').hide();
        $('#errorSubscripcion').hide();
        $('#myModalSesion').modal('show');
        console.log(codigo);

    } else {
        window.location.href = home;

    }
}

function validarSesion(retorno) { //Validar dentro de nuestra base
    
    let correo = document.getElementById("correo").value;
    let clave = document.getElementById("clave").value;
    window.location.href = retorno;
}
