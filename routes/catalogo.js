var express = require('express');
var router = express.Router();
var request = require('request');
var middleware = require('../middleware');
const r=require('../app');

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

router.get('/:idCategoria', middleware.decodePayload, function(req, res, next) {
    request({
        method: 'GET',
        uri: r.ruta + "categoria/todos",
    }, function (error, response, body){
        if(!error && response.statusCode == 200){
          //console.log('body: ',JSON.parse(body));
          dataCategoria = [];
          
          dataCategoria = JSON.parse(body);
          console.log(dataCategoria);
          idInicial = req.params.idCategoria;
          if(idInicial == 0 && dataCategoria.length > 0){
              idInicial = dataCategoria[0].idCategoria;
          }

          positionCategory = 0;
          for (var x=0;x<dataCategoria.length;x++){
            if (dataCategoria[x].idCategoria == idInicial){
              positionCategory = x;
              break;
            }
          }
          console.log(positionCategory);
          /* Obtener el tipo de usuario -----> si existe ver si es admin*/
          usuarioEmpresa = req.user.admin;
          return res.render('catalogo', { title: 'Acolitame - Catalogo de Productos' , categoria: dataCategoria, positionCategory: positionCategory, home: r.home, usuarioEmpresa:usuarioEmpresa, userType: getType(req.user)});
        }
    })
});

router.get('/empresa/:idEmpresa', middleware.decodePayload, function(req, res, next) {
  console.log(req.user)
  request({
    method: 'GET',
    uri: r.ruta + "empresa/id/"+req.params.idEmpresa,
}, function (error, response, body){
    if(!error && response.statusCode == 200){
      //console.log('body: ',JSON.parse(body));
      empresa = JSON.parse(body);
      latitud = empresa.latitud;
      longitud = empresa.longitud;
      rutaMapa = r.home+'catalogo/forShowMap/'+latitud+'/'+longitud;
      console.log(rutaMapa);
      /* Obtener el tipo de usuario -----> si existe ver si es admin*/
      usuarioEmpresa = req.user.admin;
      return res.render('despliegueEmpresa', { title: 'Acolitame - Empresa' , home: r.home, rutaMapa: rutaMapa, empresa:empresa,  usuarioEmpresa:usuarioEmpresa, userType: getType(req.user)});
    }
})
});

router.get('/forShowMap/:latitud/:longitud', function(req, res, next) {
  return res.render('forShowMap', {latitud: req.params.latitud, longitud:req.params.longitud });
});

module.exports = router;
