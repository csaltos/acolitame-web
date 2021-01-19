var express = require('express');
var router = express.Router();
var request = require('request');
var middleware = require('../middleware');
const r=require('../app');


/*
router.post('/', function(req, res){
   console.log(req.body);
   nombre = req.body.fname;
   //res.send(nombre);
   res.send(nombre);
});*/

function getType(user){
  typeUser = 0;
  if(user.sub != -1){
    if(user.admin){
      typeUser = 1;
    }else{
      typeUser = 2;
    }
  }
  return typeUser;
}

router.get('/', middleware.decodePayload, function(req, res, next) {
  request({
    method: 'GET',
    uri: r.ruta + "categoria/todos",
  }, function (error, response, body){
    if(!error && response.statusCode == 200){
      return res.render('index', { title: 'Acolitame' , categoria: JSON.parse(body), home: r.home, userType: getType(req.user)});
    }
  })
});

router.get('/quienesSomos', middleware.decodePayload, function(req, res, next) {
  res.render('quienesSomos', {title: 'Acolitame - Quienes Somos', home: r.home, userType: getType(req.user)});
});

router.get('/soyEmprendedor', middleware.decodePayload, function(req, res, next) {
  res.render('soyEmprendedor', {title: 'Acolitame - Soy Emprendedor', home: r.home, userType: getType(req.user)});
});

router.get('/miUbicacion/:idCategoria', function(req, res, next) {
  console.log(req.params.idCategoria);
  res.render('ubicacionEmpresas', {idCategoria: req.params.idCategoria});
});

router.get('/test',function(req,res,next){
  //console.log(req.user);
  //console.log(req.isAuthenticated());
  console.log(req.user)
  console.log(req.isAuthenticated())
  //res.render('index', { title: 'Express' });
  res.send('Bruh');
})

module.exports = router;
