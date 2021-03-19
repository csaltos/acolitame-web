require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogoRouter = require('./routes/catalogo');
var registrarRouter = require('./routes/registrar');
var administradoresRouter = require('./routes/administradores');

// var ruta = 'http://localhost:8080/';
var ruta = "http://192.168.1.2/api/";
// var home = 'http://localhost:3000/';
var home = 'http://localhost/';
//var ruta = 'https://jarjarbinks.herokuapp.com/';
var authRouter = require('./routes/auth');
var micuentaRouter = require('./routes/micuenta')
var database = require('./config/database')



//console.log("here")
//console.log(process.env.GOOGLE_CLIENT_ID)
// console.log(JSON.parse('{"sub":"108629160905849921115","name":"DAVID MARCELO PECAFIEL MORA","admin":false,"local":false,"iat":1614720866.13,"exp":1614807266}'));
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var rfs = require('rotating-file-stream');
  var errorLogStream = rfs.createStream('http-errors.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'logs/http-morgan'),
    maxFiles: 9
  });
app.use(logger('combined', { stream: errorLogStream, skip: function (req, res) { return res.statusCode < 400 } })); // Solo escribe errores 
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({
//   secret: '177013',
//   resave: false,
//   saveUninitialized: false,
//   //cookie: {secure: true}
// }))
app.use(passport.initialize()); //
// app.use(passport.session()); //

console.log("Here");
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalogo', catalogoRouter);
app.use('/registrar', registrarRouter);
app.use('/auth',authRouter)
app.use('/micuenta',micuentaRouter)
app.use('/administradores',administradoresRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
exports.ruta = ruta;
exports.home = home;
