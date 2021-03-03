

let producto = [];
var pedidos = [];

function setData() {
    token = "Bearer "+localStorage.getItem("token");
    let xhr = new XMLHttpRequest();
    console.log(token);
    
    xhr.open('GET', urlData + "pedido/getCarrito", true);
    xhr.setRequestHeader('Authorization', token);
    xhr.onreadystatechange = function() {

        if (xhr.readyState == 4 && xhr.status == 200) {
            var carrito = JSON.parse(xhr.responseText);
            for (var i = 0; i < carrito.length; i++) {
                let codigo = '<tr><td><img src="'+carrito[i].foto+'" height=100 width=100 class="img-responsive"></td>' +
                    '<td>' + carrito[i].nombre + '</td>' +
                    '<td>' + carrito[i].precio + '</td>' +
                    '<td>' + carrito[i].descripcion + '</td>' +
                    '<td><button codPedido="' + carrito[i].idPedido + '" type="button" class="btn btn-danger" onclick="eliminar($(this))">Eliminar</button></td>' +
                    '<td><button codPedido="' + carrito[i].idPedido + '" type="button" class="btn btn-info" onclick="changePedido($(this))">Guardar Pedido</button></td>';
                $('#tablaCarro').append(codigo);
                producto.push(parseInt(carrito[i].idProducto));
                //console.log(carrito[i].foto);
            }
        }
    }
    xhr.send(null);
}

function changePedido(etiqueta) {
    let id = parseInt($(etiqueta)[0].getAttribute('codPedido'));
    pedidos.push(id);
    let codigo = $(etiqueta)[0].parentElement.parentElement;
    codigo.removeChild($(etiqueta)[0].parentElement);
    console.log(codigo);
    $('#tablaPedidos').append(codigo);
    $('#tablaCarro').remove(codigo);
    console.log(document.getElementById('tablaCarro'));
}

function eliminar(etiqueta) {
    let codigo = $(etiqueta)[0].parentElement.parentElement.parentElement;
    console.log($(codigo)[0].getAttribute('id'));
    let padre = $(codigo)[0].getAttribute('id');
    let cod = $(etiqueta)[0].parentElement.parentElement;
    let id = parseInt($(etiqueta)[0].getAttribute('codPedido'));
    console.log(id);
    if (padre == 'tablaPedidos') {
        var index = pedidos.indexOf(id);
        if (index > -1) {
            pedidos.splice(index, 1);
        }
        $(cod).append('<td><button codPedido="' + id + '" type="button" class="btn btn-info" onclick="changePedido($(this))">Guardar Pedido</button></td>');
        console.log(cod);
        $('#tablaPedidos').remove(cod);
        console.log(document.getElementById('tablaCarro'));
        $('#tablaCarro').append(cod);

    } else {
        let ruta = urlData + "pedido/borrarCarro/" + id;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", ruta, true);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        token = "Bearer "+localStorage.getItem("token");
        xhr.setRequestHeader('Authorization', token);
        xhr.onload = function() {
            var prod = (xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {
                document.getElementById('tablaCarro').removeChild(cod);
            } else {
                console.error(prod);
            }
        }
        xhr.send(null);
    }

}

function sendPedido() {
    let mensaje = document.getElementById('mensaje').value;
    if (mensaje != '') {
        if (pedidos.length == 0) {
            alert('No hay productos en pedido.');
        } else {
            data = {};
            data.idpedidos = pedidos;
            data.mensaje = mensaje;
            $('#myModalWait').modal('show');
            let xhr = new XMLHttpRequest();
            xhr.open('POST', urlData + 'pedido/realizarPedido', true);
            token = "Bearer "+localStorage.getItem("token");
            xhr.setRequestHeader('Authorization', token);
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            console.log(JSON.stringify(data));
            xhr.onload = function() {
                let subs = JSON.parse(xhr.responseText);

                if (xhr.readyState == 4 && xhr.status == 200) {
                    console.log(subs);
                    var element = document.getElementById("tablaPedidos");
                    while (element.firstChild) {
                        element.removeChild(element.firstChild);
                    }
                    document.getElementById('mensaje').value = '';
                    $('#myModalWait').modal('hide');

                } else {
                    $('#myModalWait').modal('hide');
                    alert('Ha ocurrido un error. No se envio el pedido.');
                }

            }
            xhr.send(JSON.stringify(data));
        }
    } else {
        alert('Escriba un mensaje que especifique que informacion necesita.');
    }
}



