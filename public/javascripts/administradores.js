var id_empresa = -1;
var id_admin = -1;

function setData(idEmpresa, idAdmin) {
    id_admin = idAdmin
    id_empresa = idEmpresa
    token = 'Bearer ' + localStorage.getItem('token');
    let ruta = urlData + "administrador/alla/"+idEmpresa ;//+ correoS;
    console.log(ruta);
    let xhr = new XMLHttpRequest();
    xhr.open("GET", ruta, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.setRequestHeader('Authorization',token);
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            admins = JSON.parse(xhr.responseText);
            for (var i = 0; i < admins.length; i++) {
                if (admins[i].id_administrador != id_admin ) {
                    let newAdmin = '<tr><td>' + admins[i].correo+ '</td>' +
                        // '<td><button posA=' + i + ' codA="' + admins[i].correo + '"type="button" class="btn btn-info" onclick="modificar($(this))">Modificar</button></td>' +
                        '<td><button posA=' + i + ' codA="' + admins[i].correo+ '"type="button" class="btn btn-danger" onclick="eliminar($(this))">Eliminar</button></td></tr>';
                    $('#tablaAdmins').append(newAdmin);
                }
            }
        }
    }
    xhr.send(null);
}

function guardarAdmin() {
    console.log("inserting");
    token = 'Bearer ' + localStorage.getItem('token');
    correoNewAdmin = document.getElementById("correoAdmin").value;
    let data = {};
    data.id_empresa = id_empresa;
    data.correo = correoNewAdmin
    let ruta= urlData + "administrador/insertar"
    var xhr = new XMLHttpRequest();
    xhr.open('POST', ruta) 
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.setRequestHeader('Authorization',token);
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.onload = function() {
        console.log("Here admin"); 
        var emp = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            console.log(emp);
            if (emp){
                let newAdmin = '<tr><td>' + correoNewAdmin+ '</td>' +
                    // '<td><button posA=' + i + ' codA="' + admins[i].correo + '"type="button" class="btn btn-info" onclick="modificar($(this))">Modificar</button></td>' +
                    '<td><button posA=' + '' + ' codA="' +correoNewAdmin+ '"type="button" class="btn btn-danger" onclick="eliminar($(this))">Eliminar</button></td></tr>';
                $('#tablaAdmins').append(newAdmin);
            }
            // sendImage(urlData,emp.id_empresa);
            // sendAdmin(idEmpresa);
            
        } else {
            console.error(emp);
        }
    }
    // console.log("Here");
    xhr.send(JSON.stringify(data));
}

function eliminar(etiqueta) {
    console.log("inserting");
    token = 'Bearer ' + localStorage.getItem('token');
    let adminE = $(etiqueta)[0].getAttribute("codA");
    let ruta = urlData + "administrador/borrar";
    console.log($(etiqueta)[0].parentElement.parentElement);
    let data = {};
    data.id_empresa = id_empresa;
    data.correo = adminE;
    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;
    xhr.open("POST", ruta, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.setRequestHeader('Authorization',token);
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.onload = function() {
        var prod = (xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            console.log(prod);

            document.getElementById("tablaAdmins").removeChild($(etiqueta)[0].parentElement.parentElement);

        } else {
            console.error(prod);
        }
    }
    xhr.send(JSON.stringify(data));
}

function cancelar() {
    window.close();
}