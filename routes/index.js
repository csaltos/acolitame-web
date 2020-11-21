var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user)
  console.log(req.isAuthenticated())
  res.render('index', { title: 'Express' });
});

router.get('/test',function(req,res,next){
  //console.log(req.user);
  //console.log(req.isAuthenticated());
  res.send('Bruh');
})

module.exports = router;
