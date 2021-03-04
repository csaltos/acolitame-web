var express = require('express');
var router = express.Router();
const dataBase = require('../config/database');
const passport = require('passport');
const middleware = require('../middleware');
const r = require('../app');
var request = require('request');

router.get("/", passport.authenticate('jwt',{session: false, failureRedirect: '/'}),function(req,res){ //Secured endpoint by JWT
    // console.log("Hacking in process");
    // console.log("Hello", req.user); //Injected Object from database result
    // console.log(req.user.admin);j
    const id = req.user.sub 
    const query = `select ae.correo AS correoAdmin, e.id_categoria, e.nombre , e.correo AS correoEmpresa, 
                    e.telefono, e.direccion , e.latitud , e.longitud, e.id_empresa 
                    from administrador_empresa ae FULL OUTER JOIN empresa e on ae.id_empresa = e.id_empresa 
                    where ae.id_administrador = '${id}';`;
    dataBase.query(query)
    .then( function (dbRes){
        console.log("Por aqui");
        // console.log(dbRes)
        if (dbRes.rowCount > 0 ){
            console.log(dbRes.rows[0]);
            qResult =  dbRes.rows[0];
            if (req.user.admin){
                request({
                    method: 'GET',
                    uri: r.ruta + "categoria/todos",
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

// router.get("/", function(req,res){ //Secured endpoint by JWT
//     console.log("Hacking in process");
//     console.log("Hello", req.user); //Injected Object from database result
//     res.send(`Hello ${req.user.nombre}, I see you are a man of culture as well`); 
// });
module.exports = router