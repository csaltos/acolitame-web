var express = require('express');
var router = express.Router();
const dataBase = require('../config/database');
const passport = require('passport');
const middleware = require('../middleware');
const r = require('../app');
router.get("/", passport.authenticate('jwt',{session: false, failureRedirect: '/'}),function(req,res){ //Secured endpoint by JWT
    // console.log("Hacking in process");
    // console.log("Hello", req.user); //Injected Object from database result
    // console.log(req.user.admin);
    const id = req.user.sub 
    const query = `SELECT u.correo from public.usuario_registrado where u.correo = ${id}`;
    dataBase.query(query)
    .then( function (dbRes){
        if (dbRes.rowCount > 0 ){
            console.log(req.user);
            if (req.user.admin){
                res.render('miCuentaEmpresa',{title: 'Mi Cuenta',typeUser: 1, home : r.home, ext: false});
            }else{
                res.render('miCuentaUsuario',{title: 'Mi Cuenta',typeUser: 2,home: r.home, ext: false});
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