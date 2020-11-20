var express = require('express');
var router = express.Router();
var ruta = 'https://jarjarbinks.herokuapp.com/';
var request = require('request');

router.get('/', function(req, res, next) {
  request({
    method: 'GET',
    uri: ruta + "categoria/todos",
  }, function (error, response, body){
    if(!error && response.statusCode == 200){
      //console.log('body: ',JSON.parse(body));
      return res.render('index', { title: 'Acolitame' , categoria: JSON.parse(body)});
    }
  })
});

module.exports = router;
