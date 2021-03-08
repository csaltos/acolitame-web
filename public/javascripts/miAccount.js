var idEmpresa = "";
var correoAdmin = "";

function initLoad(id,correoa) {
    console.log(id,correoa);
    idEmpresa = id; 
    correoAdmin = correoa;
    initImageRead();
}

function guardar() {
    console.log(idEmpresa);
    token = 'Bearer ' + localStorage.getItem('token');
    let nombre = document.getElementById("nombre").value;
    let correo = document.getElementById("correo").value;
    let telefono = document.getElementById("telefono").value;
    let direccion = document.getElementById("direccion").value;
    let latitud = document.getElementById("latitud").value;
    let longitud = document.getElementById("longitud").value;
    let categoria = $("#selectCategorias option:selected").text().trim();
    if (!/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(correo) || nombre.length == 0 || /^\s+$/.test(nombre) || direccion.length == 0 || /^\s+$/.test(direccion) || telefono.length == 0 || !(/^\d{7}$/.test(telefono) || /^\d{10}$/.test(telefono) || /^\d{12}$/.test(telefono))) {
        alert("Error en el ingreso de datos");

    } else {
        var data = {};
        data.nombre = nombre;
        data.correo = correo;
        data.telefono = telefono;
        data.direccion = direccion;
        data.categoria = categoria;
        data.latitud = parseFloat(latitud);
        data.longitud = parseFloat(longitud);
        data.correoAdmin = correoAdmin;
        let ruta = urlData + "empresa/actualizar/idEmpresa/" + idEmpresa;
        console.log(ruta);
        let xhr = new XMLHttpRequest();
        xhr.open("POST", ruta, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.setRequestHeader('Authorization',token);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.onload = function() {
            var empresaR = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {
                console.log(empresaR);
                enviar = /\.(gif|jpg|png)$/i.test(document.getElementById('imgInp').value);
                if (enviar) {
                    sendImage();
                }
                document.getElementById('frameUbicacion').contentDocument.location.reload(true);

            } else {
                console.error(empresaR);
            }
        }
        xhr.send(JSON.stringify(data));
    }
}

function sendImage() {
    token = 'Bearer ' + localStorage.getItem('token');
    var form = new FormData();
    console.log($('#imgInp')[0].files[0]);
    form.append('fileImage', $('#imgInp')[0].files[0]);
    console.log(JSON.stringify(form));
    var ruta = urlData + "empresa/image/" + idEmpresa;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', ruta);
    // xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.setRequestHeader('Authorization',token);
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.onload = function() {
        var prod = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            console.log(prod);

        } else {
            console.error(prod);
        }
    }
    xhr.send(form);
}