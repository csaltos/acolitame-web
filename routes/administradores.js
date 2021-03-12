var express = require('express');
var router = express.Router();
var passport = require('passport');
const { use, authenticate } = require('passport');
const utils = require('../lib/authUtils');
const database = require('../config/database');
//const { use } = require('passport');
//const urlData = "https://jarjarbinks.herokuapp.com/";
// const urlData = "http://localhost:8080/";
const urlData = "http://192.168.1.23/api/"
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const dataBase = require('../config/database');
const { json } = require('body-parser');
const middleware = require('../middleware');
var request = require('request');
const r=require('../app');

router.get("/",passport.authenticate('jwt',{session: false, failureRedirect: '/'}),function (req,res) {
    console.log("admins");
    console.log(req.user);
    if (req.user.admin){
        const query = `select u.id_empresa from public.administrador_empresa u where u.id_administrador = '${req.user.sub}'`;
        dataBase.query(query)
        .then(function (dbRes){    
            if (dbRes.rowCount > 0 && dbRes.rows[0].id_empresa){
                res.render('administrador', { title: 'Acolitame - Administradores',idEmpresa:dbRes.rows[0].id_empresa, idAdmin: req.user.sub});
            }else{
                res.redirect("/");
            }
        })
    }else{
        res.status(403);
    }
})

module.exports = router