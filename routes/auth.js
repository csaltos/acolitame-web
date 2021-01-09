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

const externalLogIn = (req, res) => { //Here the token is issued when the login is made with google/facebook 
    console.log("Redirect External")
    console.log(req.user);
    const token =  utils.issueJWT({
        "id": req.user.id,
        "name": req.user.displayName,
        "admin": false
    });
    // res.redirect('/?token='+token.token)
    // res.status(200).json({succes: true , profile: req.user ,token: token.token , expiresIn: token.expires});
    // res.redirect('/auth?token='+token.token+'&expires='+token.expires);
    res.cookie('token',token.token);
    res.redirect('/auth/session');
}

const localLogIn = (req,res,valid , user) =>{
    if(valid){
        const token =  utils.issueJWT({
            "id": user.id,
            "name": user.nombre,
            "admin": user.admin
        });
        // res.redirect('/?token='+token.token)
        // res.status(200).json({succes: true ,token: token.token , expiresIn: token.expires})
        res.cookie('token',token.token);
        res.redirect('/auth/session');
    }else{
        res.send("Nope");
    }
}

router.get("/session",function (req,res){
    res.render('setAuth');
});

router.post("/", function (req,res) {
    const {correo, clave} = req.body;
    if(utils.isValidEntry(clave) && utils.isValidEntry(correo)){
        const query1 =  `SELECT A.id_administrador, A.id_empresa, A.clave, A.sal from public.administrador_empresa A 
                            WHERE A.correo = '${correo}' ;`;
        const query2 =  `SELECT U.id_usuario, U.nombre, U.clave, U.sal from public.usuario_registrado U 
                            WHERE U.correo = '${correo}' ;`;
        dataBase .query(query1)
        .then(function (dbRes1) {
            console.log(dbRes1);
            if (dbRes1.rowCount > 0){
                console.log("You are admin");
                const idAdmin = dbRes1.rows[0].id_administrador;
                const valid = utils.valAuth({
                    "clave" : clave,
                    "nombre" : dbRes1.rows[0].nombre,
                    "claveH" : dbRes1.rows[0].clave,
                    "sal" : dbRes1.rows[0].sal
                });
                localLogIn(req,res,valid,{
                    "nombre": dbRes1.rows[0].nombre,
                    "id":idAdmin,
                    "admin": true
                });
            }else{
                dataBase.query(query2)
                .then(function (dbRes2){
                    console.log("Are you a user?")
                    if (dbRes2.rowCount > 0){ 
                        console.log(dbRes2)
                        console.log("Yes you are");
                        const idUsuario = dbRes2.rows[0].id_usuario;
                        const valid = utils.valAuth({
                            "clave": clave,
                            "nombre" : dbRes2.rows[0].nombre,
                            "claveH" : dbRes2.rows[0].clave,
                            "sal" : dbRes2.rows[0].sal
                        });
                        localLogIn(req,res,valid,{
                            "nombre":dbRes2.rows[0].nombre,
                            "id":idUsuario,
                            "admin": false
                        });
                    }else
                        res.send("Not found");
                })
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

router.post("/singinu",function (req,res) {
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

router.post("/singina",function (req,res) {
    const {correo , clave , idEmpresa: idempresa} = req.body;
    if(utils.isValidEntry(clave) && utils.isValidEntry(correo)){
        const hashPair = utils.genPassword(clave);
        const hash = hashPair.hash;
        const salt = hashPair.salt;
        const query = `INSERT INTO public.administrador_empresa(clave, sal, correo, id_empresa, verificado)
                        VALUES ('${hash}','${salt}','${correo}','${idempresa}',false);`
        console.log(query);
        dataBase.query(query)
        .then(function (dbRes) {
            var succes;
            if (dbRes.rowCount > 0 ){    
                succes = true;
            }else{
                succes = false;
            }
            // dataBase.end();
            // res.send(msg);
            res.status(200).json({resultado:succes})
        })
        .catch(function (err) {
            console.log(err);
            // dataBase.end();
            // res.send("Something went wrong");
            res.status(200).json({resultado: false})
        });
    }
    else{
        // res.successend("Nice try");
        res.status(200).json({resultado: false})
    }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/test/failed' }), externalLogIn);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/test/failed' }), externalLogIn);

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