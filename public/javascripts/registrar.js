// const createHttpError = require("http-errors");

var correoAdmmin = '';

function validateDataEmpresa(){
    var enterpriseName = document.getElementById('inputNegocio').value;
    var selectedCat = document.getElementById('selectCategorias').value;
    var location = document.getElementById('direccion').value;
    // var pass = document.getElementById('inputPass').value;
    var mail = document.getElementById("inputCorreo").value;
    var telefono = document.getElementById("telefono").value;


    if (enterpriseName.length == 0 || /^\s+$/.test(enterpriseName) || telefono.length == 0 || location.length == 0 || /^\s+$/.test(location) || selectedCat == "Seleccione" ){ //|| pass.length == 0 || /^\s+$/.test(pass)) {
        alert("Error en el ingreso de datos. Campos vacios.");
    } else if (!/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(mail)) {
        alert("Error en el ingreso de correo");
    // } else if(pass.length <8 ){
    //     alert("Contraseña muy corta (minimo 8 caracteres).");
    }else{
        enviar = /\.(gif|jpg|png)$/i.test(document.getElementById('imgInp').value);
        console.log(enviar);
        if (!enviar) {
            alert("No seleccionó imagen o el formato no es válido");
            // return false;
        } else {
       
        validarExistencia(enterpriseName);
        // console.log('validar existencia');
        // registrarEmpresa();
            /*let ajaxRequest = new XMLHttpRequest();
            ajaxRequest.open("GET", urlData + "usuario/verificarExistencia/" + mail, true);
            ajaxRequest.onreadystatechange = function() {

                    if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
                        res = JSON.parse(ajaxRequest.responseText);
                        console.log(res);
                        if (res == true) {
                            alert("Ya existe una empresa o usuario con ese correo.");
                        } else {
                            console.log('validado');
                            registrarEmpresa();
                        }

                    }
                    if (ajaxRequest.readyState == 4 && ajaxRequest.status == 404) {
                        res = JSON.parse(ajaxRequest.responseText);
                        console.log(res);
                    }
                }
            ajaxRequest.send(null);*/
        }
    }

}

function validarExistencia(nombre) {
    let xhr = new XMLHttpRequest();

    xhr.open('GET', urlData + 'empresa/getnombre/'+nombre,true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    // xhr.setRequestHeader('Authorization',token);
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.onload = function() {
        console.log("ValName");
        var emp = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            console.log(emp);
            if (emp){
                var nameAlert = document.getElementById("alertNegocio");
                nameAlert.classList.remove("d-none");
                window.scrollTo(0,0);
            }else{
                registrarEmpresa()
            }
            // sendImage(urlData,emp.idEmpresa);
            // sendAdmin(idEmpresa);
            
        } else {
            console.error(emp);
        }
    }
    console.log("Here");
    xhr.send();
}

function registrarEmpresa() {
    token = 'Bearer ' + localStorage.getItem('token');
    var dataEmpresa = {};
    dataEmpresa.nombre = document.getElementById('inputNegocio').value;
    dataEmpresa.categoria = document.getElementById('selectCategorias').value;
    dataEmpresa.direccion = document.getElementById('direccion').value;
    dataEmpresa.correo = document.getElementById("inputCorreo").value;
    dataEmpresa.telefono = document.getElementById("telefono").value;
    dataEmpresa.latitud = parseFloat(document.getElementById("latitud").value);
    dataEmpresa.longitud = parseFloat(document.getElementById("longitud").value);
    dataEmpresa.correoAdmin = correoAdmin;
    // dataEmpresa.correoAdmin = document.getElementById("inputCorreo").value;
    // dataEmpresa.claveAdmin = document.getElementById('inputPass').value;
    console.log("Inserting");
    let xhr = new XMLHttpRequest();
    xhr.open('POST', urlData + 'empresa/insertar', true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.setRequestHeader('Authorization',token);
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.onload = function() {
        console.log("Herex2"); 
        var emp = JSON.parse(xhr.responseText);
        //console.log(xhr.status);
        if (xhr.readyState == 4 && xhr.status == "200") {
            console.log(emp);
            sendImage(urlData,emp.id_empresa);
            // sendAdmin(idEmpresa);
            
        } else {
            console.error(emp);
        }
    }
    console.log("Here");
    xhr.send(JSON.stringify(dataEmpresa));
}

function sendImage(ruta,idEmpresa) {
    enviar = /\.(gif|jpg|png)$/i.test(document.getElementById('imgInp').value);
    token = 'Bearer ' + localStorage.getItem('token');
    if(enviar){
        rutaDatos = ruta + "empresa/image/"+idEmpresa;
        var form = new FormData();
        console.log($('#imgInp')[0].files[0]);
        form.append('fileImage', $('#imgInp')[0].files[0]);
        console.log(JSON.stringify(form));
        var xhr = new XMLHttpRequest();
        xhr.open('POST', rutaDatos);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('Authorization',token);
        xhr.onload = function() {
            var prod = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {
                console.log(prod);
                window.location.href = "/"
            } else {
                console.error(prod);
            }
        }
        xhr.send(form);
    }
}

function sendAdmin(idEmpresa) {
    var dataAdmin = {};
    dataAdmin.clave = document.getElementById('inputPass').value;
    dataAdmin.correo = document.getElementById("inputCorreo").value;
    dataAdmin.idEmpresa = idEmpresa;
    let xhr = new XMLHttpRequest();
    xhr.open('POST', urlData + 'administrador/insertar', true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onload = function() {
        var emp = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            console.log(emp);
            var ruta = urlData + "empresa/image/" + idEmpresa
            sendImage(ruta);
        } else {
            console.error(emp);
        }
    }
    xhr.send(JSON.stringify(dataAdmin));
}

// function validateDataUsuario(){
//     var pass = document.getElementById('inputPass').value;
//     var mail = document.getElementById("inputCorreo").value;
//     var telefono = document.getElementById("telefono").value;
//     var nombre = document.getElementById("nombre").value;

//     if (telefono.length == 0 || pass.length == 0 || /^\s+$/.test(pass) || nombre.length == 0) {
//         alert("Error en el ingreso de datos. Campos vacios.");
//         //return false;
//     } else if (!/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(mail)) {
//         alert("Error en el ingreso de correo");
//     } else if(pass.length <8 ){
//         alert("Contraseña muy corta (minimo 8 caracteres).");
//     }else {
        
//         console.log('correcto')
//         /*let ajaxRequest = new XMLHttpRequest();
//         ajaxRequest.open("GET", urlData + "usuario/verificarExistencia/" + mail, true);
//         ajaxRequest.onreadystatechange = function() {

//             if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
//                 res = JSON.parse(ajaxRequest.responseText);
//                 console.log(res);
//                 if (res == true) {
//                     alert("Ya existe un usuario o empresa con ese correo.");
//                 } else {
//                     saveNewUser();
//                 }
//             }
//         }
//         ajaxRequest.send(null);*/
        

//     }
// }

// function saveNewUser() {
//     var data = {};
//     data.clave = document.getElementById('inputPass').value;
//     data.correo = document.getElementById("inputCorreo").value;
//     data.telefono = document.getElementById("telefono").value;
//     data.nombre = document.getElementById("nombre").value;
//     let xhr = new XMLHttpRequest();
//     xhr.open('POST', home + 'auth/singinU', true);
//     xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
//     xhr.onload = function() {
//         var usuario = JSON.parse(xhr.responseText);
//         if (xhr.readyState == 4 && xhr.status == "200") {
//             console.log(usuario);
//             //var ruta = urlData + "usuario/image/" + usuario.idUsuario;
//             //sendImage(ruta);
//         } 
//     }
//     xhr.send(JSON.stringify(data));
// }

function setMultiple(correo){
  localStorage.setItem('token',getCookie('token'));
  // setSession();
  correoAdmin = correo;
  initImageRead();
}
