var cookieParser = require('cookie-parser');
var express = require('express');
var http = require('http');
var app = express();
var flash = require('connect-flash');
var session = require('express-session');
var sessionStore = new session.MemoryStore();
var AppFile = require('../app.js');
var ConfigFile = require('../config.js');
var CacheController = require('../controllers/CacheController.js')
var ServerCache = CacheController.ServerCache;
var moment = require('moment');

exports.getAlerts = function(req, res, next)
{
  var Language = "RO";
  var output = "";
      if (typeof req.session.User == "undefined" || req.session.User == null)
        {
            res.redirect('/login');
            return false;
        }
    else
        {
           Language = req.session.Language;
        }

  // var LabelDetalii = {"Value_RO": "Detalii","Value_EN":"Details"};

  if (ServerCache["Ready"] !== true || typeof ServerCache.Alerts == "undefined")
    {
      res.send("Cache Not Complete");
    }
      else
          {
            for (var i = 0; i < ServerCache.Alerts.length; i++)
            {
              if(ServerCache.Alerts[i] == "undefined")
                  {
                    console.log("Alert "+i+" is undefined");
                  }
              else
                  {
                      output += '<li class="Alerts-message" id=Alerts-item-' + ServerCache.Alerts[i].ID + '><div class=' + ServerCache.Alerts[i].Date + '>' + moment(ServerCache.Alerts[i].Date).format("HH:mm") + ': ' + ServerCache.Alerts[i].Message + '</li>';
                  }
              }
                res.send(output);
          }
;}
