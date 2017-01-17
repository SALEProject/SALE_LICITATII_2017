var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var sessionStore = new session.MemoryStore();
var routes = require('./routes/index');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
// var fileUpload = require('express-fileupload');



// view engine setup
// app.use(compression());


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// cookie-parser

app.use(cookieParser());

// express-session
app.use(session({name :'lic', store: sessionStore, secret: 'ssshhhhh', maxAge:3600000, saveUninitialized: true, resave: true}));

// default options
// app.use(fileUpload());


// var z;
// exports.EditStore = function (ses)
//   {
//     sessionStore.set(ses, {User: 'bar'}, function(err, ses) {});
//   };
//
// exports.SearchInStore = function (ses)
//   {
//     // sessionStore.all(function(err, data)
//     // { return z = data});
//     // return z;
//     sessionStore.get(ses, function(err, data) {
//       return z = data});
//     return z;
//   };


// app.get("/session", function(req, res){
//   sessionStore.all(function(err, data) {
//     res.send({err: err, data:data});
//   });
// });


// Enable Flash
app.use(flash());

app.use(function(req, res, next){
  res.io = io;
  next();
});
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
//was false
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));



//cache
app.get("/1manifest.appcache", function(req, res){
  res.header("Content-Type", "text/cache-manifest");
  res.end("CACHE MANIFEST");
});

// This endpoint reveals it
app.get("/session", function(req, res){
  sessionStore.get(req.session.id, function(err, data) {
    res.send({data:data});
  });
});


app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = {app: app, server: server};
