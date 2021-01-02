var express = require('express');
var router = express.Router();
var request = require('request');
const r=require('../app');

router.get('/:idCategoria', function(req, res, next) {
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
          return res.render('catalogo', { title: 'Acolitame - Catalogo de Productos' , categoria: dataCategoria, positionCategory: positionCategory, home: r.home});
        }
    })
});

router.get('/empresa/:idEmpresa', function(req, res, next) {
  //console.log(req.params)
  request({
    method: 'GET',
    uri: r.ruta + "empresa/correo/"+req.params.idEmpresa,
}, function (error, response, body){
    if(!error && response.statusCode == 200){
      //console.log('body: ',JSON.parse(body));
      empresa = JSON.parse(body);
      latitud = empresa.latitud;
      longitud = empresa.longitud;
      rutaMapa = r.home+'catalogo/forShowMap/'+latitud+'/'+longitud;
      console.log(rutaMapa);
      return res.render('despliegueEmpresa', { title: 'Acolitame - Empresa' , home: r.home, rutaMapa: rutaMapa, empresa:empresa });
    }
})
});

router.get('/forShowMap/:latitud/:longitud', function(req, res, next) {
  return res.render('forShowMap', {latitud: req.params.latitud, longitud:req.params.longitud });
});

module.exports = router;
