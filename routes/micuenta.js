var express = require('express');
var router = express.Router();

router.get("/",function(req,res){
    if (req.isAuthenticated()){
        res.send("You're Allow Here")
    }else{
        res.send("You Shall No Pass")
    }
});

module.exports = router