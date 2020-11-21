var express = require('express');
var router = express.Router();
var passport = require('passport');
const { use } = require('passport');
//const { use } = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy; 
const FacebookStrategy = require('passport-facebook').Strategy;
//const urlData = "https://jarjarbinks.herokuapp.com/";
const urlData = "http://localhost:8080/";
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

/*
    TODO:
        *Refactor LocalStrategy login
        *Add retrieve user from database on deserializeUse
        *Check if user is register at login with google and facebook
*/

passport.serializeUser(function(user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    console.log("Serialized")
    console.log(user)
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    console.log("Deserialized")
    console.log(id)
    done(null, id);
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
        console.log(profile);
        return done(null, profile);
    }
));

passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        //callbackURL: "https://showcase69.herokuapp.com/login/facebook/callback",
        callbackURL: "localhost:3000/auth/facebook/callback",
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
        return done(null, profile);
    }
));

const externalLog = (req, res) => {
    /*if (!req.externalIsPresent) {
        sendNewUser(req.user);
    } else {
        sendLogInRegister(req.user.emails[0].value);
    }
    res.cookie('correoSesionActual', req.user.emails[0].value, { maxAge: 86400000 });
    res.cookie('tipoCuenta', 'normal', { maxAge: 86400000 });
    res.cookie('sourceInicio', 'externo', { maxAge: 86400000 });
    res.cookie('sesion', 'Cerrar Sesion', { maxAge: 86400000 });
    res.cookie('sourceLink', req.user.photos[0].value);
    var url = '/setSesion/' + req.user.emails[0].value + '/normal/externo';*/
    res.redirect('/');
    
}


function logOut(req) { //
    req.logout();
    req.session = null;
};

function sendNewUser(profile) { //Profile -> Objeto con informacion de usuario recuperada de cuenta de google o facebook.
    var data = {};
    data.clave = "";
    data.correo = profile.emails[0].value;
    data.nombre = profile.displayName;
    data.telefono = "";
    console.log(data);
    console.log(JSON.stringify(data));
    let ruta = baselink + "/usuario/insertar";
    console.log(ruta);
    fetch(ruta, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));
    console.log("Register");
}

function sendLogInRegister(correo) {
    var data = {};
    data.correo = correo;
    let ruta = baselink + "/inicioSesion/externo"
    fetch(ruta, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));
}

router.get("/", function (req,res) {
    res.send("Que transas perro")
})

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/test/failed' }), externalLog);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/test/failed' }), externalLog);

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

module.exports = router