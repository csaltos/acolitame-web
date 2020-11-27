var express = require('express');
var router = express.Router();
var ruta = 'https://jarjarbinks.herokuapp.com/';
var request = require('request');

router.get('/catalogo-empresas', function(req, res, next) {
  res.render('catalogoEmpresas', {title: 'Acolitame - Catalogo Empresas'});
});

router.get('/catalogo-productos/:idCategoria', function(req, res, next) {
    request({
        method: 'GET',
        uri: ruta + "categoria/todos",
    }, function (error, response, body){
        if(!error && response.statusCode == 200){
          //console.log('body: ',JSON.parse(body));
            dataCategoria = JSON.parse(body);
            idInicial = req.params.idCategoria;
            if(idInicial == 0){
                idInicial = dataCategoria[0].idCategoria;
            }
            positionCategory = 0;
            for (var x=0;x<dataCategoria.length;x++){
              if (dataCategoria[x].idCategoria == idInicial){
                positionCategory = x;
                break;
              }
            }
            return res.render('catalogoProductos', { title: 'Acolitame - Catalogo de Productos' , categoria: dataCategoria, positionCategory: positionCategory});
        }
    })
});

module.exports = router;
