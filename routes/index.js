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

router.get('/', function(req, res, next) {
  request({
    method: 'GET',
    uri: ruta + "categoria/todos",
  }, function (error, response, body){
    if(!error && response.statusCode == 200){
      //console.log('body: ',JSON.parse(body));
      return res.render('index', { title: 'Acolitame' , categoria: JSON.parse(body)});
    }
  })
});

router.get('/quienesSomos', function(req, res, next) {
  res.render('quienesSomos', {title: 'Acolitame - Quienes Somos'});
});

router.get('/soyEmprendedor', function(req, res, next) {
  res.render('soyEmprendedor', {title: 'Acolitame - Soy Emprendedor'});
});

router.get('/miUbicacion/:idCategoria', function(req, res, next) {
  console.log(req.params.idCategoria);
  res.render('ubicacionEmpresas', {idCategoria: req.params.idCategoria});
});

module.exports = router;
