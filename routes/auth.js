var express = require('express');
var router = express.Router();
var passport = require('passport');
const { use, authenticate } = require('passport');
const utils = require('../lib/authUtils');
const database = require('../config/database');
//const { use } = require('passport');
//const urlData = "https://jarjarbinks.herokuapp.com/";
// const urlData = "http://localhost:8080/";
const urlData = "http://localhost/api/"
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const dataBase = require('../config/database');
const { json } = require('body-parser');
const middleware = require('../middleware');
var request = require('request');
const r=require('../app');


require('../config/passport/config')(passport); //Pass as argument passport object to configure auth strategies 

const externalLogIn = (req, res) => { //Here the token is issued when the login is made with google/facebook 
    console.log("Redirect External")
    console.log(req.user);
    const token =  utils.issueJWT({
        "id": req.user.id,
        "name": req.user.displayName,
        "admin": req.user.admin,
        "local": false
    });
    // res.redirect('/?token='+token.token)
    // res.status(200).json({succes: true , profile: req.user ,token: token.token , expiresIn: token.expires});
    // res.redirect('/auth?token='+token.token+'&expires='+token.expires);
    console.log(token);
    res.cookie('token',token.token,{
        maxAge:24 * 60 * 60 * 1000,
        // httpOnly: true
    });
    res.redirect('/auth/session');
}

// const localLogIn = (req,res,valid , user) =>{
//     if(valid){
//         const token =  utils.issueJWT({
//             "id": user.id,
//             "name": user.nombre,
//             "admin": user.admin,
//             "local": true
//         });
//         // res.redirect('/?token='+token.token)
//         // res.status(200).json({succes: true ,token: token.token , expiresIn: token.expires})
//         res.cookie('token',token.token,{
//             maxAge:24 * 60 * 60 * 1000,
//             // httpOnly: true
//         });
//         res.redirect('/auth/session');
//     }else{
//         res.send("Not found");
//     }
// }

router.get("/valmail/:correo",function (req,res){
    if(utils.isValidEntry(req.params.correo)){
        mail = req.params.correo.trim();
        console.log(mail);   
        const query = `SELECT a.correo, u.correo from public.administrador_empresa a, usuario_registrado u where a.correo='${mail}' or u.correo='${mail}'`;
        dataBase.query(query)
        .then(function (dbRes){
            console.log(dbRes);
            if (dbRes.rowCount > 0 ){
                res.status(200).json({succes:true, exist:true});
            }else{
                res.status(200).json({succes:true , exist:false});
            }
        })
        .catch(function (err){
            console.log(err);
            res.status(400).json({succes: false , exist : ''});
        });
    }else{
        res.status(400).json({succes: false , exist : ''});
    }
});

router.get('/forChoose', function(req, res, next) { //This helps to render a map
    return res.render('forChoose');
})

router.get("/session",passport.authenticate('jwt',{session: false, failureRedirect: '/'}),function (req,res){
    console.log("Settign session")
    console.log(req.user);
    if (req.user.admin){
        console.log("Yes Admin")
        const query = `SELECT U.id_empresa, U.correo from public.administrador_empresa U where U.id_administrador = '${req.user.sub}';`;
        console.log(query);
        dataBase.query(query)
        .then(function (dbRes) {
            console.log(dbRes);
            if (dbRes.rowCount > 0 && dbRes.rows[0].id_empresa != null){
                res.render('setAuth');
            }else{
                // return res.render('registrarEmprendedor', { title: 'Acolitame - Registar Emprendedor' , categoria: JSON.parse(body), home: r.home});
                console.log('ñam');
                request({
                    method: 'GET',
                    uri: r.rutaL + "categoria/todos",
                }, function (error, response, body){
                    // console.log(response);
                    // console.log(error);
                    qResult = dbRes.rows[0];
                    if(!error && response.statusCode == 200){
                      //console.log('body: ',home);
                    //   console.log(body);
                      res.render('registrarEmprendedor', { title: 'Acolitame - Registar Emprendedor' ,
                      categoria: JSON.parse(body), home: r.home, correoAdmin:qResult.correo});
                    }
                })
            }
        }).catch(function (err) {
            res.send(err);
        })
    }else{
        res.render('setAuth');
    }
    
});

router.post("/updateadmin",passport.authenticate('jwt',{session:false,failureRedirect:'/'}),function (req,res)  {
    console.log("Updating");
    const {idempresa,adminid} = req.body;
    console.log(idempresa,adminid);
    const query = `UPDATE public.administrador_empresa SET id_empresa = '${idempresa}' WHERE id_administrador = '${adminid}';`;
    dataBase.query(query)
    .then(function (dbRes) {
        console.log(dbRes);
        var succes;
        if (dbRes.rowCount > 0 ){    
            succes = true;
        }else{
            succes = false;
        }
        // dataBase.end();
        // res.send(msg);
        res.status(200).json({resultado:succes})
    }).catch(function (err) {
            console.log(err);
            // dataBase.end();
            // res.send("Something went wrong");
            res.status(200).json({resultado: false})
    })
});

router.get('/google',passport.authenticate('google', 
                        { scope: ['profile', 'email'] })
                    );

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), externalLogIn);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), externalLogIn);

router.get('/logout',function(req,res){
    req.logOut();
    console.log("Session Endend");
    res.render('logOut');
});

module.exports = router;