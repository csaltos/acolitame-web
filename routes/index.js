var express = require('express');
var router = express.Router();
var request = require('request');
const r=require('../app');


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
    uri: r.ruta + "categoria/todos",
  }, function (error, response, body){
    if(!error && response.statusCode == 200){
      //console.log('body: ',home);
      return res.render('index', { title: 'Acolitame' , categoria: JSON.parse(body), home: r.home});
    }
  })
});

router.get('/quienesSomos', function(req, res, next) {
  res.render('quienesSomos', {title: 'Acolitame - Quienes Somos', home: r.home});
});

router.get('/soyEmprendedor', function(req, res, next) {
  res.render('soyEmprendedor', {title: 'Acolitame - Soy Emprendedor', home: r.home});
});

router.get('/miUbicacion/:idCategoria', function(req, res, next) {
  console.log(req.params.idCategoria);
  res.render('ubicacionEmpresas', {idCategoria: req.params.idCategoria});
});

module.exports = router;
