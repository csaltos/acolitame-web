var express = require('express');
var router = express.Router();
var passport = require('passport');
const { use } = require('passport');
const fs = require('fs');
const path = require('path');
const utils = require('../../lib/authUtils');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const JwtSrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const dataBase = require('../database');

const pathPubKey = path.join(__dirname,'../..','publicKey.pem');
const PUB_KEY = fs.readFileSync(pathPubKey,'utf8');
//const urlData = "https://jarjarbinks.herokuapp.com/";
const urlData = "http://localhost:8080/";
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { platform } = require('os');

const cookieExtractor = req => {
    let jwt = null
    if (req && req.cookies['token']){
        jwt = req.cookies['token'].replace('Bearer ','').trim();
    }
    return jwt;
}

const headerExtractor = req => {
    let jwt = null;
    if (req && req.header('Authorization')){    
        jwt = req.header('Authorization').replace('Bearer ', '').trim();
    }
    return jwt;
}

const options = {
    // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    jwtFromRequest : ExtractJwt.fromExtractors([headerExtractor,cookieExtractor]),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
};

module.exports = (passport) => {
    passport.serializeUser(function(user, done) {   //In principle this doesnt do anything, just pass through
        console.log("Serialized")
        console.log(user)
        done(null, user);
    });

    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            //callbackURL: "https://showcase69.herokuapp.com/login/google/callback",
            callbackURL: "http://localhost:3000/auth/google/callback",
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            /*
            use the profile info (mainly profile id) to check if the user is registerd in ur db
            If yes select the user and pass him to the done callback
            If not create the user and then select him and pass to callback
            */
            //console.log(profile);
            //let correoS = document.getElementById('correoH').value;
            //console.log(profile.emails[0].value);
            /*var correoS = profile.emails[0].value;
            let ruta = urlData + "usuario/correo/" + correoS;
            console.log(ruta);
            console.log("**********");
            let xhr = new XMLHttpRequest();
            xhr.open("GET", ruta, false);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    user = JSON.parse(xhr.responseText);
                    req.externalIsPresent = true;
                } else if (xhr.readyState == 4 && xhr.status == 404) {
                    //sendNewUser(profile);
                    req.externalIsPresent = false;
                }
            }
            xhr.send(null);*/
            console.log("After Google Auth");
            const query = `select U.id_usuario, U.nombre from public.usuario_registrado U where U.id_usuario = ${profile.id};`;
            console.log("quering, ",query);
            dataBase.query(query)
            .then(function (dbRes) {
                console.log(dbRes);
                if (dbRes.rowCount > 0 ){
                    console.log("I found it :3");
                    // dataBase.end();
                    return done(null, profile);
                }else{
                    console.log("Who are you?");
                    utils.sendNewUser(profile,done);                    
                }
            }).catch(function (err) {
                // dataBase.end();
                return done(err,false); 
            })
            // console.log(profile);
        }
    ));

    passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            //callbackURL: "https://showcase69.herokuapp.com/login/facebook/callback",
            callbackURL: "http://localhost:3000/auth/facebook/callback",
            passReqToCallback: true,
            profileFields: ['id', 'displayName', 'photos', 'email']
        },
        function(req, accessToken, refreshToken, profile, done) {
            /*correoS = profile.emails[0].value;
            let ruta = urlData + "usuario/correo/" + correoS;
            console.log(ruta);
            var xhrG = new XMLHttpRequest();
            xhrG.open("GET", ruta, false);
            xhrG.setRequestHeader('Content-type', 'application/json;charset=utf-8');
            xhrG.onreadystatechange = function() {
                if (xhrG.readyState == 4 && xhrG.status == 200) {

                    user = JSON.parse(xhrG.responseText);
                    req.externalIsPresent = true;
                } else if (xhrG.readyState == 4 && xhrG.status == 404) {
                    //console.log(xhr);
                    //console.log(xhr.getAllResponseHeaders());
                    req.externalIsPresent = false;
                    //console.log("lllllllllllllllllllllllllllllll");
                    console.log(externalIsPresent);
                    //console.log("llllllllllllllllllllllllllllllll");
                }
            }
            xhrG.send(null);*/
            console.log("After Facebook Auth");
            const query = `select U.id_usuario, U.nombre from public.usuario_registrado U where U.id_usuario = ${profile.id};`;
            console.log("quering, ",query);
            dataBase.query(query)
            .then(function (dbRes) {
                console.log(dbRes);
                if (dbRes.rowCount > 0 ){
                    console.log("I found it :3");
                    // dataBase.end();
                    return done(null, profile);
                }else{
                    console.log("Who are you?");
                    utils.sendNewUser(profile,done);                    
                }
            }).catch(function (err) {
                // dataBase.end();
                return done(err,false); 
            })
        }
    ));

    passport.use(new JwtSrategy(options, function(payload,done) { //This is called when an endpoint is secured with JWT

        console.log(payload);
        // const query = `select U.id_usuario, U.nombre from public.usuario_registrado U ;`;
        const query = `select U.id_usuario, U.nombre from public.usuario_registrado U where U.id_usuario = ${payload.sub};`
        console.log(query)
        dataBase.query(query)
        .then(function(res){
            console.log(res.rows[0]);
            // dataBase.end();
            // done(null,res.rows[0]); //The response is injected into the pipeline in the request object as user 
            done(null,payload);
        });
    }));
}