

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
    setValoracion();
    cargarProductos();
    cargarComentarios(document.getElementById('usuarioEmpresa').value === 'true');
}

function cargarProductos(){
    let ruta = urlData + "producto/empresa/" + id_empresa + "/"+positionProductos+"/"+maximo;
    //let ruta = urlData + "producto/categoria/" + '1' + "/"+positionProductos+"/"+maximo;
    console.log(ruta);
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", ruta, true);
    ajaxRequest.onreadystatechange = function() {
        if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {

            let resultProductos = JSON.parse(ajaxRequest.responseText);
            for (var j = 0; j < resultProductos.length; j++) {
                producto = resultProductos[j];
                productos.push(producto);
                console.log(producto);
                let resultado = '<div class="row align-items-center justify-content-center p-3 m-3 bg-light"><div class="col">' +
                    '<div class="row align-items-center justify-content-center"><p>' + document.getElementById("nombreEmpresaT").innerHTML + '</p></div>' +
                    '<div class="row align-items-center justify-content-center"><a href="#" onclick=\'return goProducto('+j+','+id_empresa+')\'><img src="' + producto.foto + '" alt="" class="img-responsive pr-2" height=150 width=150></a></div>' +
                    '<div class="row align-items-center justify-content-center"><a href="#" onclick=\'return goProducto('+j+','+id_empresa+')\'><p>' + producto.nombre + '</p></a></div></div></div>';
                $('#listaProductos').append(resultado);
            }
            positionProductos+=maximo;
        }
    }
    ajaxRequest.send(null);
} 

function goProducto(pos, id_empresa){
    
    var productoSelected = productos[pos];
    productoSelected.nombreEmpresa = document.getElementById("nombreEmpresaT").innerHTML;
    productoSelected.id_empresa = id_empresa;
    console.log(productoSelected);
    showInfoProducto(productoSelected, false, window.location.href);
        
}

function cargarHeaderComentario(comentario, usuarioEmpresa){
    let codigo = '<div class="row align-items-start justify-content-start px-3"><div class"col-sm-auto">' +
    '<div class="row"><p><b>Usuario: ' + comentario.usuario + '</b></p></div>' +
    '<div class="row"><p class="text-muted"><small>Fecha: ' + comentario.fecha + '</small></p></div>' +
    '<div class="row"><p class = "text-justify">Comentario: ' + comentario.contenido + '</p></div>' +
    '</div></div><hr>';
    codigo += '<div class="'+comentario.idComentario+'"></div>'
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

function cargarRespuestaComentario(respuesta, idComentario){
    let codigo = '<div class="row align-items-start justify-content-start px-3">' +
                        '<div class="col-sm-auto ml-5">' +
                        '<div class="row"><p><b>Usuario: ' + respuesta.autor + '</b></p></div>' +
                        '<div class="row"><p class="text-muted"><small>Fecha: ' + respuesta.fecha + '</small></p></div>' +
                        '<div class="row"><p class = "text-justify">Respuesta: ' + respuesta.contenido + '</p></div>' +
                        '</div></div><hr>';
    $("."+idComentario).append(codigo);
}

function cargarComentarios(usuarioEmpresa) {
    console.log('here');
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", urlData + "comentarios/getComentarios/" + id_empresa + '/' + positionComentarios + '/' +maximo, true);
    console.log(urlData + "comentarios/getComentarios/" + id_empresa + '/' + positionComentarios + '/' +maximo);
    ajaxRequest.onreadystatechange = function() {

        if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
            var resultComentarios = JSON.parse(ajaxRequest.responseText);
            for (var i = 0; i < resultComentarios.length; i++) {
                comentario = resultComentarios[i];
                cargarHeaderComentario(comentario, usuarioEmpresa);
                let respuestas = comentario.respuestas;
                console.log(respuestas.length);
                
                for (var j = 0; j < respuestas.length; j++) {
                    cargarRespuestaComentario(respuestas[j], comentario.idComentario);
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
        /*Solo para probar*/
        var respuesta = {};
        respuesta.autor = 'autor';
        respuesta.fecha = '6/1/2020';
        respuesta.contenido = 'contenido';
        document.getElementById(id_comentario + "").value = "";
        //cargarRespuestaComentario(respuesta, id_comentario);
        token = 'Bearer ' + localStorage.getItem('token');
        let xhr = new XMLHttpRequest();
        console.log(ruta);
        xhr.open('POST', ruta, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('Authorization', token);
        xhr.onload = function() {
            var respuesta = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {
                console.log(respuesta);
                document.getElementById(id_comentario + "").value = "";
                cargarRespuestaComentario(respuesta, id_comentario);
            } 
            if (xhr.readyState == 4 && xhr.status == "403") {
                console.log('iniciar sesion');
            }
        }
        xhr.send(JSON.stringify(data));
    } else {
        alert('Ingrese una respuesta');
    }
}

function sendComentario(usuarioEmpresa){
    let comentario = document.getElementById("comentario").value;
    token = 'Bearer ' + localStorage.getItem('token');
    console.log(token);
    if (comentario.length > 0) {
        let ruta = urlData + 'comentarios/insertar';
        if (token === null){
            actSesion();
        }else if (!usuarioEmpresa){
            var data = {};
            // el id del usuario se recupera del header del auth
            data.contenido = comentario;
            data.idEmpresa = parseInt(id_empresa);
            console.log(data);
            /*prueba 
            var respuesta = {};
            respuesta.idComentario = 56;
            respuesta.usuario = 'autor';
            respuesta.fecha = '6/1/2020';
            respuesta.contenido = 'contenido';
            cargarHeaderComentario(respuesta, usuarioEmpresa);*/
    
            let xhr = new XMLHttpRequest();
            console.log(ruta);
            xhr.open('POST', ruta, true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');//importante cors :3 2/3/2021
            xhr.setRequestHeader('Authorization', token);
            xhr.onload = function() {
                var comentario = JSON.parse(xhr.responseText);
                console.log(xhr.status);
                if (xhr.readyState == 4 && xhr.status == "200") {
                    console.log(comentario);
                    document.getElementById("comentario").value = "";
                    cargarHeaderComentario(comentario, usuarioEmpresa);
                    document.getElementById('comentariosEmpresa').scrollIntoView(false);
                } 
                if (xhr.status == "403") {
                    actSesion();
                }
            }
            xhr.send(JSON.stringify(data));
        }
        
    } else {
        alert('Ingrese un comentario.');
    }
}

function setValoracion() {
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", urlData + "calificacion/getCalificacion/idEmpresa/" + parseInt(id_empresa), true);
    ajaxRequest.onreadystatechange = function() {
        let puntaje = Math.floor(ajaxRequest.responseText);
        console.log('puntaje', puntaje)
        if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
            var codigo = '<input type="radio" name="estrellas" value="5" ><label id="radio5" style="color: grey;">&#9733;</label><input type="radio" name="estrellas" value="4"><label id="radio4" style="color: grey;">&#9733;</label><input type="radio" name="estrellas" value="3"><label id="radio3" style="color: grey;">&#9733;</label><input type="radio" name="estrellas" value="2"><label id="radio2" style="color: grey;">&#9733;</label><input type="radio" name="estrellas" value="1"><label id="radio1" style="color: grey;">&#9733;</label>';
            $('.clasificacion').append(codigo);
            if (puntaje > 0) {
                for (var i = 1; i <= puntaje; i++) {
                    let rad = 'radio' + i;
                    document.getElementById(rad).style = 'color: orange';
                }
            }
            document.getElementsByName('estrellas').disabled = true;
            
        } else {
            console.log(puntaje);
        }
    }
    ajaxRequest.send(null);

}

function darValoracion(usuarioEmpresa) {
    token = 'Bearer ' + localStorage.getItem('token');
    if ( token == null) {
        actSesion();
    } else if (!usuarioEmpresa){
        let codigo = '<div class="modal" id="myModalValor">' +
            '<div class="modal-dialog p-5" role="document">' +
            '<div class="modal-content">' +
            '<div class="modal-header justify-content-center">' +
            '<h5 class="modal-title ">Valoracion</h5>' +
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>' +
            '</div>' +
            '<div class="modal-body">' +
            '<div class="row align-items-center justify-content-center mb-5">' +
            '<p class="clasificacion" id="clasificacion1">' +
            '<input id="radio5m" type="radio" name="estrellas" value="5"><label for="radio5m" class="label-v">&#9733;</label><input id="radio4m" type="radio" name="estrellas" value="4"><label for="radio4m" class="label-v">&#9733;</label><input id="radio3m" type="radio" name="estrellas" value="3"><label for="radio3m" class="label-v">&#9733;</label><input id="radio2m" type="radio" name="estrellas" value="2"><label for="radio2m" class="label-v">&#9733;</label><input id="radio1m" type="radio" name="estrellas" value="1"><label for="radio1m" class="label-v">&#9733;</label>' +
            '</p></div>' +
            '<div class="row align-items-center justify-content-center mb-5"><div class="col-sm-auto">' +
            '<button type="button" onclick="saveCalificacion()"  data-dismiss="modal" class="btn btn-success mr-3">Guardar</button>' +
            '<button type="button" data-dismiss="modal" class="btn btn-danger mr-3">Cancelar</button>' +
            '</div></div>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-secondary" data-dismiss="modal" >Cerrar</button>' +
            '</div></div></div></div>';
        $("#forModalValor").append(codigo);
        $('#myModalValor').modal('show');
    } else {
        window.alert("Solo los clientes pueden calificar una empresa.");
    }
}

function saveCalificacion() {
    var calificacion = 0;
    for (var i = 1; i < 6; i++) {
        if (document.getElementById('radio' + i + 'm').checked) {
            calificacion = i;
        }
    }

    console.log(calificacion);
    var data = {};
    data.idEmpresa = parseInt(id_empresa);
    data.valor = parseInt(calificacion);
    console.log(JSON.stringify(data));
    let xhr = new XMLHttpRequest();
    console.log(urlData + 'calificacion/calificar');
    xhr.open('POST', urlData + 'calificacion/calificar', true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');//importante cors :3 2/3/2021
    xhr.setRequestHeader('Authorization', token);
    xhr.onload = function() {
        var emp = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            console.log(emp);
            var element = document.getElementById("clasificacion");
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
            var element2 = document.getElementById("forModalValor");
            while (element2.firstChild) {
                element2.removeChild(element2.firstChild);
            }
            setValoracion();
            
            //window.location.href = 'despliegueEmpresa';
        } else {
            console.error(emp);
        }
    }
    xhr.send(JSON.stringify(data));

}