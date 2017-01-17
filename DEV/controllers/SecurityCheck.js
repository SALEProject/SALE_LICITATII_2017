var cookieParser = require('cookie-parser');
var express = require('express');
var http = require('http');
var app = express();
var flash = require('connect-flash');
var session = require('express-session');
var sessionStore = new session.MemoryStore();
var AppFile = require('../app.js');
var ConfigFile = require('../config.js');
var router = express.Router();


exports.CheckSession = function(check) { return res.send(check); }

// module.exports =
// {
//     CheckSession: function(check)
//                     {
//                       console.log("check");
//                       if (typeof check == "undefined")
//                           {
//                             console.log("bad");
//                             return res.redirect("/login");
//                           }
//                       else
//                           {
//                             console.log("good");
//                             console.log(check);
//                             return res.redirect("/");
//                           }
//                     },
// }
