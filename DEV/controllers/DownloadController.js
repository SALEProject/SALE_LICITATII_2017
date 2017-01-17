var cookieParser = require ('cookie-parser');
var express = require ('express');
var http = require ('http');
var app = express ();
var flash = require ('connect-flash');
var session = require ('express-session');
var sessionStore = new session.MemoryStore ();
var AppFile = require('../app.js');
var ConfigFile = require('../config.js');
var CacheController = require('../controllers/CacheController.js')
var ServerCache = CacheController.ServerCache;

exports.getFormFile = function (req, res, next)
{
  var filename = "";
  switch(req.body.filename) {
  case "Referat de necesitate":
      filename = "Referat de necesitate.doc";
      break;
  case "Nota de fundamentare":
      filename = "Nota de fundamentare.doc";
      break;
  case "Fisa de date":
      filename = "Fisa de date.doc";
      break;
  case "CS":
      filename = "Caietul de sarcini.doc";
      break;
  default:
      filename = "Document.doc";
}

    if( filename == "") {
      throw new Error('Invalid FileName requested'+filename);
    }
    
    var content = '<html><head><meta http-equiv="content-type" content="text/html;charset=UTF-8" /><meta charset="utf-8" /></head><body>';
    content += req.body.content;
    content += '</body><html>';
    res.set({'Content-Disposition': 'attachment;  filename='+filename+'','content-type': 'application/force-download; charset=utf-8'});
    // res.set({'Content-Disposition': 'attachment;  filename=\"2015.doc\"','content-type': 'application/force-download; charset=utf-8'});
    res.end( content );
};
