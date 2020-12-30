var express = require('express');
var router = express.Router();
var passport = require('passport');
const { use, authenticate } = require('passport');
const utils = require('../lib/authUtils');
const database = require('../config/database');
//const { use } = require('passport');
//const urlData = "https://jarjarbinks.herokuapp.com/";
const urlData = "http://localhost:8080/";
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const dataBase = require('../config/database');


require('../config/passport/config')(passport); //Pass as argument passport object to configure auth strategies 

router.get("/", function (req,res) {
    res.send("Que transas perro");
});

router.post("/singin",function (req,res) {

    const {correo , clave , nombre, telefono } = req.body;
    if(utils.isValidEntry(clave) && utils.isValidEntry(nombre)){
        const hashPair = utils.genPassword(clave);
        const hash = hashPair.hash;
        const salt = hashPair.salt;
        const query = `INSERT INTO public.usuario_registrado(clave, sal, correo, nombre, telefono, verificado)
                        VALUES ('${hash}','${salt}','${correo}','${nombre}','${telefono}',false);`
        console.log(query);
        dataBase.query(query)
        .then(function (dbRes) {
            var msg;
            if (dbRes.rowCount > 0 ){    
                msg ="Succesful sing in";
            }else{
                msg = "Something went wrong";
            }
            dataBase.end();
            res.send(msg);
        })
        .catch(function (err) {
            console.log(err);
            dataBase.end();
            res.send("Something went wrong");
        });
    }
    else{
        res.send("Nice try");
    }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/test/failed' }), utils.externalLog);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/test/failed' }), utils.externalLog);

//TODO:
//  Delete JWT
router.get('/logout',function(req,res){
    /*sesionEstado = "Iniciar Sesion";
    tipo = "outsider";
    correoSesion = "";
    empresaS = "";
    if (req.cookies('sourceIncio') == 'externo') {
        logOut(req);
        for (var [key, value] of mapitaDatosDefault) {
            res.cookie(key, value, { maxAge: 86400000 }); //Age de la cookie = 1 día;
            //alert(key + " = " + value);
        }
    }
    sourceInicioS = "";
    firstTimeS = '1';
    res.render("index", { sesion: sesionEstado, correoSesionActual: correoSesion, tipoCuenta: tipo, sourceInicio: sourceInicioS, firstTime: firstTimeS });*/
    req.logOut()
    req.session.destroy()
    console.log("Session Endend")
    res.redirect('/')
});

module.exports = router;