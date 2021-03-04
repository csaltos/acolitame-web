

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
    initImageRead();
    //cargarComentarios(document.getElementById('usuarioEmpresa').value === 'true');
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
            setProductos(resultProductos);
            positionProductos+=maximo;
            console.log(positionProductos);
        }
    }
    ajaxRequest.send(null);
} 

function setProductos(productosResult) {
    console.log(productosResult);
    for (var i = 0; i < productosResult.length; i++) {
        prod = productosResult[i];
        if(document.getElementById(prod.id_producto) == undefined){
            let resultado = '<div class="row align-items-center justify-content-center p-3 m-3 bg-light" ><div class="col-auto col-md-auto"><div id="'+prod.id_producto+'" posP="' + i + '">' +
            '<div class="row align-items-center justify-content-center"><a href="#" onclick="managing('+i+')" class=""><img src="' + prod.foto + '" alt="" class="img-responsive pr-2" height=150 width=150></a></div>' +
            '<div class="row align-items-center justify-content-center"><a href="#" class="" onclick="managing('+i+')"><p>' + prod.nombre + '</p></a></div></div></div></div>'; //+
            //'<p>$ '+productos[i].precio+'</p></div>';
            $('#listaProductos').append(resultado);
            productos.push(prod);
        }
        
    }

}

function agregarProducto() {
    idEmpresa = 6;
    let codigo = "guardarCambios(\'POST\', \'producto/insertar/"+idEmpresa+"\', true)";
    $("#btnSaveProd").attr('onclick', codigo);
    $('#mensajeAlerta').hide();
    document.getElementById("btnProdEliminar").innerHTML = "Cancelar";
    $("#btnProdEliminar").attr('onclick', "cleanStuffProd()");
    $('#myModalProducto').modal('show');
}

function managing(posP) {
    console.log(productos[posP]);
    let productoSelected = productos[posP];
    $("#codP").val(productoSelected.id_producto);
    document.getElementById("nombre").value = productoSelected.nombre;
    document.getElementById("descripcion").value = productoSelected.descripcion;
    document.getElementById("precioP").value = productoSelected.precio;
    document.getElementById("btnProdEliminar").innerHTML = "Eliminar";
    $("#btnProdEliminar").attr('onclick', "eliminarProducto()");
    let codigo = "guardarCambios(\'POST\', \'producto/actualizar/idProducto/"+ productoSelected.id_producto +"\', false)";
    $("#btnSaveProd").attr('onclick', codigo);
    $('#imagen').attr('src', productoSelected.foto);
    $('#mensajeAlerta').hide();
    $('#myModalProducto').modal('show');
}

function guardarCambios(option, medio, nuevo) {
    
    console.log(document.getElementById("nombre"));
    var data = {};
    data.nombre = document.getElementById("nombre").value;
    data.descripcion = document.getElementById("descripcion").value;
    if (document.getElementById("precioP").value == '') {
        data.precio = 0;
    } else {
        data.precio = parseFloat(document.getElementById("precioP").value);
    }
    console.log(urlData + medio);
    if (validateForm(data, nuevo)) {
        console.log(JSON.stringify(data));
        let ruta = urlData + medio;
        console.log(ruta);
        let xhr = new XMLHttpRequest();
        //option = "T";
        xhr.open(option, ruta, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        token = "Bearer "+localStorage.getItem("token");
        xhr.setRequestHeader('Authorization', token);
        xhr.onload = function() {
            var prod = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {
                console.log(prod);
                enviar = /\.(gif|jpg|png)$/i.test(document.getElementById('imgInp').value);
                console.log('enviar', enviar);
                if (enviar) {
                    sendImage(prod.id_producto);
                } else{
                    if(prod.id_producto === undefined){
                        prod.id_producto = prod.idProducto;
                    }
                    setChanges(prod);
                    cleanStuffProd();
                }
            } else {
                console.error(prod);
            }
        }
        xhr.send(JSON.stringify(data));
    }else{
        $('#mensajeAlerta').show();
    }

}

function eliminarProducto() {
    idProd = document.getElementById("codP").value;
    let ruta = urlData + "producto/borrar/idProducto/" + idProd;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", ruta, true);
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    token = "Bearer "+localStorage.getItem("token");
    xhr.setRequestHeader('Authorization', token);
    xhr.onload = function() {
        var prod = (xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            console.log(prod);
            /*var element = document.getElementById(prod.id_producto).parentElement.parentElement;
            console.log(element);
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
            cleanStuffProd();*/
            window.location.href = home+"micuenta/mivitrina";
        } else {
            console.error(prod);
        }
    }
    xhr.send(null);
}

function validateForm(data, nuevo) {
    console.log(nuevo);
    imagen = /\.(gif|jpg|png)$/i.test(document.getElementById('imgInp').value);
    if (data.nombre == '' || data.precio < 0) {
        $('#mensajeAlerta').show();
        return false;
    } else if (!imagen && nuevo) {
        return false;
    }
    return true;
}

function setChanges(prod){
    id = prod.id_producto;
    i =  $('#'+id).attr('posP');
    console.log(id, i, prod)
    if (i == undefined){
        p = [prod];
        setProductos(p);
        cleanStuffProd();
    }else{
        productos[i] = prod;
        let resultado = '<div class="row align-items-center justify-content-center"><a href="#" onclick="managing('+i+')" class=""><img src="' + prod.foto + '" alt="" class="img-responsive pr-2" height=150 width=150></a></div>' +
                '<div class="row align-items-center justify-content-center"><a href="#" class="" onclick="managing('+i+')"><p>' + prod.nombre + '</p></a></div>'; 
        var element = document.getElementById(id);
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        $('#'+id).append(resultado);
        cleanStuffProd();
    }
    
}


function cleanStuffProd() {
    $('#myModalProducto').modal('hide');
    document.getElementById("nombre").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("precioP").value = "";
    document.getElementById('imgInp').value = "";
    $('#imagen').attr('src', "" );
    $('#mensajeAlerta').hide();
}

function sendImage(idProducto) {
    console.log("toy aqui", idProducto);
    var forma = new FormData();
    console.log($('#imgInp')[0].files[0]);
    forma.append("fileImage", $('#imgInp')[0].files[0]);
    //forma.append("hola", "q mas");
    for (var pair of forma.entries()) {
        console.log(pair[0], pair[1]); 
        //console.log()
    }
    var ruta = urlData + "producto/image/" + idProducto
    var xhr = new XMLHttpRequest();
    xhr.open('POST', ruta);
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    token = "Bearer "+localStorage.getItem("token");
    xhr.setRequestHeader('Authorization', token);
    //xhr.open('GET', ruta);
    xhr.onload = function() {
        var prod = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            console.log(prod);
            if(prod.id_producto === undefined){
                prod.id_producto = prod.idProducto;
            }
            //prod.foto = "data:image/png;base64,"+prod.test;
            setChanges(prod);
        } else {
            console.error(prod);
        }
    }
    xhr.send(forma);
}

function cargarHeaderComentario(comentario){
    let codigo = '<div class="row align-items-start justify-content-start px-3"><div class"col-sm-auto">' +
    '<div class="row"><p><b>Usuario: ' + comentario.usuario + '</b></p></div>' +
    '<div class="row"><p class="text-muted"><small>Fecha: ' + comentario.fecha + '</small></p></div>' +
    '<div class="row"><p class = "text-justify">Comentario: ' + comentario.contenido + '</p></div>' +
    '</div></div><hr>';
    codigo += '<div class="'+comentario.idComentario+'"></div>'
    $('#comentariosEmpresa').append(codigo);
    let final = '<div class="row align-items-start justify-content-start px-3">' +
        '<div class="col-sm-10">' +
        '<input type="text" class="form-control form-control-sm" placeholder="Responder" id="' + comentario.idComentario + '" style="border: 1px solid black;">' +
        '</div><div class="col-sm-2"><button class="btn-sm btn btn-primary" onclick="sendRespuesta(' + parseInt(comentario.idComentario) + ')">Responder</button>' +
        '</div></div></div><hr>';
        $('#comentariosEmpresa').append(final);
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

function cargarComentarios() {
    console.log(urlData + "comentarios/getComentarios/" + id_empresa + '/' + positionComentarios + '/' +maximo);
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", urlData + "comentarios/getComentarios/" + id_empresa + '/' + positionComentarios + '/' +maximo, true);
    ajaxRequest.onreadystatechange = function() {

        if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
            var resultComentarios = JSON.parse(ajaxRequest.responseText);
            for (var i = 0; i < resultComentarios.length; i++) {
                comentario = resultComentarios[i];
                cargarHeaderComentario(comentario);
                let respuestas = comentario.respuestas;
                console.log(respuestas.length);
                
                for (var j = 0; j < respuestas.length; j++) {
                    cargarRespuestaComentario(respuestas[j], comentario.idComentario);
                }
            }
            positionComentarios+=maximo;
            console.log('posComen', positionComentarios);
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

function sendComentario(){
    let comentario = document.getElementById("comentario").value;
    token = 'Bearer ' + localStorage.getItem('token');
    console.log(token);
    if (comentario.length > 0) {
        let ruta = urlData + 'comentarios/insertar';
        if (token === null){
            actSesion();
        }else{
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
                    cargarHeaderComentario(comentario);
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