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

const externalLog = (req, res) => { //Here the token is issued when the login is made with google/facebook 
    console.log("Redirect External")
    console.log(req.user);
    const token =  utils.issueJWT({
        "id": req.user.id,
        "name": req.user.displayName,
    });
    // res.redirect('/?token='+token.token)
    res.status(200).json({succes: true , profile: req.user ,token: token.token , expiresIn: token.expires});
}

router.get("/",function (req,res){
    res.send("Bruh");
})

router.post("/", function (req,res) {
    const {correo, clave} = req.body;
    if(utils.isValidEntry(clave) && utils.isValidEntry(correo)){
        const query =  `SELECT U.id_usuario, U.nombre, U.clave, U.sal from public.usuario_registrado U 
                            WHERE U.correo = '${correo}' ;`;
        dataBase.query(query)
        .then(function (dbRes) {
            console.log(dbRes);
            if (dbRes.rowCount > 0){
                const idUsuario = parseInt(dbRes.rows[0].id_usuario);
                const nombre = dbRes.rows[0].nombre;
                const claveH = dbRes.rows[0].clave;
                const sal = dbRes.rows[0].sal;
                console.log(idUsuario,nombre,claveH,sal);
                const valid = utils.validPassword(clave,claveH,sal);
                if(valid){
                    const token =  utils.issueJWT({
                        "id": idUsuario,
                        "name": nombre 
                    });
                    // res.redirect('/?token='+token.token)
                    res.status(200).json({succes: true ,token: token.token , expiresIn: token.expires});
                }else{
                    res.send("Nope");
                }
            }else{
                res.send("Not found");
            }
        })
        .catch(function (err) {
            console.log(err);
            // dataBase.end();
            res.send('Something went wrong');
        });
    }else{
        res.send("Bad Parameters");
    }
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
            // dataBase.end();
            res.send(msg);
        })
        .catch(function (err) {
            console.log(err);
            // dataBase.end();
            res.send("Something went wrong");
        });
    }
    else{
        res.send("Nice try");
    }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/test/failed' }), externalLog);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/test/failed' }), externalLog);

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