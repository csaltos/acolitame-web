var express = require('express');
var router = express.Router();
var ruta = 'https://jarjarbinks.herokuapp.com/';
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//var xhr = new XMLHttpRequest();
/* GET home page. */

/*router.get('/', function(req, res, next) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", ruta + "categoria/todos", true);
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var categoria = JSON.parse(xhr.responseText);
        res.render('index', { title: 'Acolitame' , categoria: categoria});
      }else{
        var categoria = [];
        res.render('index', { title: 'Acolitame' , categoria: categoria});
      }
  }
  xhr.send(null);
  var categoria = [];
  res.render('index', { title: 'Acolitame' , categoria: categoria});
});*/

router.get('/', function(req, res, next) {
  async.parallel({
    book: function(callback) {
        Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
    },
    book_bookinstances: function(callback) {
        BookInstance.find({ 'book': req.params.id }).exec(callback);
    },
    
    categoria: function(callback){
      let xhr = new XMLHttpRequest();
      xhr.open("GET", ruta + "categoria/todos", true);
      xhr.onreadystatechange = function() {
          if (xhr.readyState == 4 && xhr.status == 200) {
            var categoria = JSON.parse(xhr.responseText);
            
          }
      }
      xhr.send(null);
    }
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.book==null) { // No results.
          res.redirect('/catalog/books');
      }
      // Successful, so render.
      res.render('book_delete', { title: 'Delete Book', book: results.book, book_instances: results.book_bookinstances } );
  });
});



 

module.exports = router;
