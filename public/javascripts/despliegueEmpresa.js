

let positionComentarios = 0;
var id_empresa;
var productos = [];
let positionProductos = 0;
let maximo = 10;

function setInitialData(idEmpresa){
    id_empresa = idEmpresa;
    console.log(id_empresa);
    positionComentarios = 0;
    positionProductos = 0;
    cargarProductos();
    cargarComentarios(document.getElementById('usuarioEmpresa').value === 'true');
}

function cargarProductos(){
    //let ruta = urlData + "producto/idEmpresa/" + id_empresa + "/"+positionProductos+"/"+maximo;
    let ruta = urlData + "producto/categoria/" + '1' + "/"+positionProductos+"/"+maximo;
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

function goProducto(pos){
    
    var productoSelected = productos[pos];
    showInfoProducto(productoSelected, false, window.location.href);
        
}

function cargarComentarios(usuarioEmpresa) {

    let ajaxRequest = new XMLHttpRequest();
    //ajaxRequest.open("GET", urlData + "comentarios/getComentarios/" + id_empresa + '/' + positionComentarios + '/' +maximo, true);
    ajaxRequest.open("GET", "https://jarjarbinks.herokuapp.com/" + "comentarios/getComentarios/" + '64', true);
    ajaxRequest.onreadystatechange = function() {

        if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
            var resultComentarios = JSON.parse(ajaxRequest.responseText);
            for (var i = 0; i < resultComentarios.length; i++) {
                comentario = resultComentarios[i];
                let codigo = '<div class="row align-items-start justify-content-start px-3"><div class"col-sm-auto">' +
                    '<div class="row"><p><b>Usuario: ' + comentario.usuario + '</b></p></div>' +
                    '<div class="row"><p class="text-muted"><small>Fecha: ' + comentario.fecha + '</small></p></div>' +
                    '<div class="row"><p class = "text-justify">Comentario: ' + comentario.contenido + '</p></div>' +
                    '</div></div><hr>';
                $('#comentariosEmpresa').append(codigo);
                let respuestas = comentario.respuestas;
                console.log(respuestas.length);
                codigo += '<div class="'+comentario.idComentario+'"></div>'
                for (var j = 0; j < respuestas.length; j++) {
                    let codigo = '<div class="row align-items-start justify-content-start px-3">' +
                        '<div class="col-sm-auto ml-5">' +
                        '<div class="row"><p><b>Usuario: ' + respuestas[j].autor + '</b></p></div>' +
                        '<div class="row"><p class="text-muted"><small>Fecha: ' + respuestas[j].fecha + '</small></p></div>' +
                        '<div class="row"><p class = "text-justify">Respuesta: ' + respuestas[j].contenido + '</p></div>' +
                        '</div></div><hr>';
                    $('.'+comentario.idComentario).append(codigo);
                }
                
                if (!usuarioEmpresa){
                    let final = '<div class="row align-items-start justify-content-start px-3">' +
                    '<div class="col-sm-10">' +
                    '<input type="text" class="form-control form-control-sm" placeholder="Responder" id="' + comentario.idComentario + '" style="border: 1px solid black;">' +
                    '</div><div class="col-sm-2"><button class="btn-sm btn btn-primary" onclick="sendRespuesta(' + parseInt(comentario.idComentario) + ')">Responder</button>' +
                    '</div></div></div><hr>';
                    $('#comentariosEmpresa').append(final);
                }
            }
            positionComentarios+=maximo;
        }
    }
    ajaxRequest.send(null);
}

function sendRespuesta(id_comentario){
    let comentario = document.getElementById(id_comentario + "").value;
    let ruta = urlData + 'respuesta/responder';
    
    if (comentario.length > 0) {
        var data = {};
        data.idComentario = id_comentario; // el id del usuario se recupera del header del auth
        data.contenido = comentario;
        let xhr = new XMLHttpRequest();
        console.log(ruta);
        xhr.open('POST', ruta, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.setRequestHeader('Authorization', token);
        xhr.onload = function() {
            var respuesta = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {
                console.log(respuesta);
                document.getElementById(id_comentario + "").value = "";
                let codigo = '<div class="row align-items-start justify-content-start px-3">' +
                        '<div class="col-sm-auto ml-5">' +
                        '<div class="row"><p><b>Usuario: ' + respuesta.autor + '</b></p></div>' +
                        '<div class="row"><p class="text-muted"><small>Fecha: ' + respuesta.fecha + '</small></p></div>' +
                        '<div class="row"><p class = "text-justify">Respuesta: ' + respuesta.contenido + '</p></div>' +
                        '</div></div><hr>';

                    $('.'+comentario.id_comentario).append(codigo);
            } 
            if (xhr.readyState == 4 && xhr.status == "403") {
                console.log('iniciar sesion');
            }
        }
        xhr.send(JSON.stringify(data));
    } else {
        alert('Ingrese un comentario/respuesta');
    }
}

function sendComentario(usuarioEmpresa){
    let comentario = document.getElementById("comentario").value;
    let ruta = urlData + 'comentarios/insertar';
    
    if (comentario.length > 0) {
        var data = {};
        // el id del usuario se recupera del header del auth
        data.contenido = comentario;
        let xhr = new XMLHttpRequest();
        console.log(ruta);
        xhr.open('POST', ruta, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.setRequestHeader('Authorization', token);
        xhr.onload = function() {
            var comentario = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {
                console.log(comentario);
                document.getElementById("comentario").value = "";
                let codigo = '<div class="row align-items-start justify-content-start px-3"><div class"col-sm-auto">' +
                    '<div class="row"><p><b>Usuario: ' + comentario.usuario + '</b></p></div>' +
                    '<div class="row"><p class="text-muted"><small>Fecha: ' + comentario.fecha + '</small></p></div>' +
                    '<div class="row"><p class = "text-justify">Comentario: ' + comentario.contenido + '</p></div>' +
                    '</div></div><hr><div class="'+comentario.idComentario+'"></div>';
                $('#comentariosEmpresa').append(codigo);
                if (!usuarioEmpresa){
                    let final = '<div class="row align-items-start justify-content-start px-3">' +
                    '<div class="col-sm-10">' +
                    '<input type="text" class="form-control form-control-sm" placeholder="Responder" id="' + comentario.idComentario + '" style="border: 1px solid black;">' +
                    '</div><div class="col-sm-2"><button class="btn-sm btn btn-primary" onclick="sendRespuesta(' + parseInt(comentario.idComentario) + ')">Responder</button>' +
                    '</div></div></div><hr>';
                    $('#comentariosEmpresa').append(final);
                }
            } 
            if (xhr.readyState == 4 && xhr.status == "403") {
                console.log('iniciar sesion');
            }
        }
        xhr.send(JSON.stringify(data));
    } else {
        alert('Ingrese un comentario/respuesta');
    }
}