var express = require('express');
var router = express.Router();
const passport = require('passport');

router.get("/",passport.authenticate('jwt',{session: false}),function(req,res){ //Secured endpoint by JWT
    console.log("Hacking in process");
    console.log("Hello", req.user); //Injected Object from database result
    res.send(`Hello ${req.user.nombre}, I see you are a man of culture as well`); 
});

module.exports = router