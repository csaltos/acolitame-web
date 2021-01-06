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

router.get('/cuentaemprendedor', function(req, res, next) {
    request({
        method: 'GET',
        uri: r.ruta + "categoria/todos",
    }, function (error, response, body){
        if(!error && response.statusCode == 200){
          //console.log('body: ',home);
          return res.render('registrarEmprendedor', { title: 'Acolitame - Registar Emprendedor' , categoria: JSON.parse(body), home: r.home});
        }
    })
    
});

router.get('/forChoose', function(req, res, next) {
    return res.render('forChoose');
});

router.get('/cuenta', function(req, res, next) {
    return res.render('registrarUsuario', { title: 'Acolitame - Registrar Usuario' , home: r.home});
});

module.exports = router;