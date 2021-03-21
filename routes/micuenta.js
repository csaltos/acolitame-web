var express = require('express');
var router = express.Router();
const dataBase = require('../config/database');
const passport = require('passport');
const middleware = require('../middleware');
const r = require('../app'); 
var request = require('request');
const fetch = require('node-fetch');
const {Headers} = require('node-fetch');

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


router.get("/", passport.authenticate('jwt',{session: false, failureRedirect: '/'}),function(req,res){ //Secured endpoint by JWT
    // console.log("Hacking in process");
    // console.log("Hello", req.user); //Injected Object from database result
    // console.log(req.user.admin);j
    const id = req.user.sub 
    const query = `select ae.correo AS correoAdmin, e.id_categoria, e.nombre , e.correo AS correoEmpresa, 
                    e.telefono, e.direccion , e.latitud , e.longitud, e.id_empresa, e.id_empresa as idEmpresa 
                    from administrador_empresa ae FULL OUTER JOIN empresa e on ae.id_empresa = e.id_empresa 
                    where ae.id_administrador = '${id}';`;
    dataBase.query(query)
    .then( function (dbRes){
        console.log("Por aqui");
        // console.log(dbRes)
        if (dbRes.rowCount > 0 && dbRes.rows[0].idempresa != null){
            console.log(dbRes.rows[0]);
            qResult =  dbRes.rows[0];
            if (req.user.admin){
                request({
                    method: 'GET',
                    uri: r.rutaL + "categoria/todos",
                }, function (error, response, body){
                    if(!error && response.statusCode == 200){
                    // return res.render('index', { title: 'Acolitame' , categoria: JSON.parse(body), home: r.home, userType: getType(req.user)});
                    res.render('miCuentaEmpresa',{title: 'Mi Cuenta',typeUser: 1, 
                        home : r.home, ext: false,ruta: r.ruta,idEmpresa: qResult.id_empresa,
                        nombre:qResult.nombre , correo: qResult.correoempresa, telefono: qResult.telefono,
                        direccion:qResult.direccion , latitud: qResult.latitud , longitud: qResult.longitud,
                        categorias: JSON.parse(body), categoria: qResult.id_categoria, correoAdmin: qResult.correoadmin
                        });
                    }
                })
            }else{
                // res.render('miCuentaUsuario',{title: 'Mi Cuenta',typeUser: 2,home: r.home, ext: false});
                console.log("Scuik");
                res.redirect('/');
            }
        }else{
            res.redirect("/auth/session")
        }
    })
    // res.send(`Hello ${req.user.name}, I see you are a man of culture as well`);
});

router.get('/test',middleware.decodePayload,function (req,res){
    console.log("TEsting");
    console.log(req.user);
    res.send('Testing');
})

router.get('/administradores',passport.authenticate('jwt',{session: false, failureRedirect: '/micuenta/test'}), function(req, res, next) {
    tipo = req.user.admin;
    if(tipo){
        res.render('administrador', {title: 'Acolitame - Administradores'});
    }else{
        res.send('You don\'t have access');
    }
});

router.get('/carrito', passport.authenticate('jwt',{session: false, failureRedirect: '/'}), middleware.decodePayload, function(req, res, next) {
    tipo = getType(req.user);
    if (tipo == 2){
        res.render('carritoCompras', {title: 'Acolitame - Carrito de Compras', tipo: tipo, home: r.home, usuarioEmpresa:req.user.admin});
    }else{
        res.send('You don\'t have access');
    }
});

router.get('/mivitrina', passport.authenticate('jwt',{session: false, failureRedirect: '/'}), function(req, res, next) {
    console.log(req.user);
    console.log(req.cookies["token"]);
    var myHeaders = new Headers();
    myHeaders.append('Authorization','Bearer '+ req.cookies["token"]);
    console.log(myHeaders);
    console.log("Mi Vitrina");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        // body: raw,
        // redirect: 'follow'
    };

    fetch(r.rutaL+"empresa/admin/", requestOptions)
    .then(response => response.text())
    .then(function (result){
        empresa = JSON.parse(result);
        console.log(empresa);
        usuarioEmpresa = req.user.admin;
        res.render('vitrinaEmpresa', {title: 'Acolitame - Mi vitrina', typeUser: 1, home: r.home, usuarioEmpresa: true, empresa: empresa});
//       console.log(result))
    })
    .catch(error => console.log('error', error));
//     request({
//         method: 'GET',
//         uri: r.ruta + "empresa/admin/",
//         headers: myHeaders,
//     }, function (error, response, body){
//         console.log("response");
//         console.log(response.statusCode);
//         // console.log("error");
//         // console.log(error);
//       if(!error && response.statusCode == 200){
//         //console.log('body: ',JSON.parse(body));
//         empresa = JSON.parse(body);
//         usuarioEmpresa = req.user.admin;
//         return res.render('despliegueEmpresa', { title: 'Acolitame - Empresa' , home: r.home, empresa:empresa,  usuarioEmpresa:usuarioEmpresa, userType: getType(req.user)});
//       }
//   })
  });

router.get('/mivitrina/test',function(req, res, next) {
    tipo = 1;
    var empresa = {};
    empresa.id_empresa = 6;
    empresa.nombre = "nombre";
    empresa.facebook = "face";
    empresa.twitter = "twitter";
    empresa.instagram = "instagram";
    res.render('vitrinaEmpresa', {title: 'Acolitame - Mi vitrina', typeUser: tipo, home: r.home, usuarioEmpresa: true, empresa: empresa});
});

// router.get("/", function(req,res){ //Secured endpoint by JWT
//     console.log("Hacking in process");
//     console.log("Hello", req.user); //Injected Object from database result
//     res.send(`Hello ${req.user.nombre}, I see you are a man of culture as well`); 
// });
module.exports = router