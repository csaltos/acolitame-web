var express = require('express');
var router = express.Router();
var passport = require('passport');
const { use } = require('passport');
const utils = require('../lib/authUtils');
//const { use } = require('passport');
//const urlData = "https://jarjarbinks.herokuapp.com/";
const urlData = "http://localhost:8080/";
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


require('../config/passport/config')(passport); //Pass as argument passport object to configure auth strategies 

router.get("/", function (req,res) {
    res.send("Que transas perro")
})

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