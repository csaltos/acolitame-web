var express = require('express');
var router = express.Router();
var ruta = 'https://jarjarbinks.herokuapp.com/';
var request = require('request');


/*
router.post('/', function(req, res){
   console.log(req.body);
   nombre = req.body.fname;
   //res.send(nombre);
   res.send(nombre);
});*/

router.get('/catalogo-productos', function(req, res, next) {
    request({
      method: 'GET',
      uri: ruta + "categoria/todos",
    }, function (error, response, body){
      if(!error && response.statusCode == 200){
        //console.log('body: ',JSON.parse(body));
        dataCategoria = JSON.parse(body);
        idInicial = dataCategoria[0].idCategoria;
        return res.render('catalogoProductos', { title: 'Acolitame - Catalogo de Productos' , categoria: dataCategoria});
      }
    })
});

router.get('/catalogo-productos/:idCategoria', function(req, res, next) {
    request({
        method: 'GET',
        uri: ruta + "categoria/todos",
    }, function (error, response, body){
        if(!error && response.statusCode == 200){
          //console.log('body: ',JSON.parse(body));
            dataCategoria = JSON.parse(body);
            console.log(req.params);
            idInicial = 0;
            if(idInicial == 0){
                idInicial = dataCategoria[0].idCategoria;
            }
            positionCategory = 0;
            console.log(idInicial);
            for (var i=0;i<dataCategoria.length;i++){
                if(dataCategoria[i].idCategoria == idInicial){
                    positionCategory = i;
                }
            }
            return res.render('catalogoProductos', { title: 'Acolitame - Catalogo de Productos' , categoria: dataCategoria, positionCategory: positionCategory});
        }
    })
});

module.exports = router;
