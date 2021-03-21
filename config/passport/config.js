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
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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

function registerUser(req,profile, done) {
    console.log("ñam"+req.cookies['type'])
    console.log("After Google/Facebook Auth");
    // console.log(admin);
    // var query
    // if( admin)
        const query1 = `select U.id_administrador from public.administrador_empresa U where U.id_administrador = '${profile.id}';`;
    // else
        const query2 = `select U.id_usuario from public.usuario_registrado U where U.id_usuario = '${profile.id}';`;
    // console.log("quering, ",query);
    console.log("Before Database");
    dataBase.query(query1)
    .then(function (dbRes) {
        console.log(dbRes);
        if (dbRes.rowCount > 0 ){
            console.log("I found it :3,admin");
            // dataBase.end();
            var data = {};
            data.correo = profile.emails[0].value;
            data.displayName = profile.displayName;
            data.extAuth = true;
            data.id = profile.id;
            data.admin = true;
            return done(null, data);
        }else{
            console.log(query2);
            dataBase.query(query2)
            .then(function (deRes){
                // console.log(deRes.rows[0])
                if (deRes.rowCount > 0){
                    console.log("I found it :3,user");
                    // dataBase.end();
                    var data = {};
                    data.correo = profile.emails[0].value;
                    data.displayName = profile.displayName;
                    data.extAuth = true;
                    data.id = profile.id;
                    data.admin = false;
                    return done(null, data);
                }else{
                    if (req.cookies['type']){
                        admin = ( req.cookies['type'] === 'true');
                        console.log("Who are you?");
                        utils.sendNewUser(profile,done,admin);
                    }
                    else{
                        return done(null,false); //TODO: Redirigir a pantalla de registro
                    }
                }
            }).catch(function (err) {
                    // dataBase.end();
                    return done(err,false); 
                })

            }
    }).catch(function (err) {
        // dataBase.end();
        return done(err,false); 
    })
    // console.log(profile);
}

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
            callbackURL: "/auth/google/callback",
            proxy: true,
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            registerUser(req,profile,done);
        }
    ));

    passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            //callbackURL: "https://showcase69.herokuapp.com/login/facebook/callback",
            callbackURL: "/auth/facebook/callback",
            proxy: true,
            passReqToCallback: true,
            profileFields: ['id', 'displayName', 'photos', 'email']
        },
        function(req, accessToken, refreshToken, profile, done) {
            registerUser(req,profile,done);
        }
    ));

    passport.use(new JwtSrategy(options, function(payload,done) { //This is called when an endpoint is secured with JWT
        console.log("JWT good");
        console.log(payload);
        // const query = `select U.id_usuario, U.nombre from public.usuario_registrado U ;`;
        var query
        if (payload.admin)
            query = `select U.id_administrador, U.correo from public.administrador_empresa U where U.id_administrador = '${payload.sub}';`
        else
            query = `select U.id_usuario, U.nombre from public.usuario_registrado U where U.id_usuario = '${payload.sub}';`
        console.log("Checking JWT");
        console.log(query)
        dataBase.query(query)
        .then(function(res){
            console.log(res);
            console.log(res.rows[0]);
            // dataBase.end();
            // done(null,res.rows[0]); //The response is injected into the pipeline in the request object as user 
            done(null,payload);
        }).catch(function (err) {
            done(err,false);
        });

    }));
}