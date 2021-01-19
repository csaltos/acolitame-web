var express = require('express');
var router = express.Router();
const passport = require('passport');
const middleware = require('../middleware');
router.get("/", passport.authenticate('jwt',{session: false, failureRedirect: '/micuenta/test'}),function(req,res){ //Secured endpoint by JWT
    console.log("Hacking in process");
    console.log("Hello", req.user); //Injected Object from database result
    console.log(req.user.admin);
    res.send(`Hello ${req.user.name}, I see you are a man of culture as well`); 
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