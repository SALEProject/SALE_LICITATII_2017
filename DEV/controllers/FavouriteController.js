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
// var host = ConfigFile.WebServiceIP;
exports.getFavouriteProcedures = function(req, res, next) {
  // console.log( req.session.User );
  var Language = "RO";
  var output = {};
  var Procedures = "";
  var myProcedures = "";
  var favProcedures = "";
      if (typeof req.session.User == "undefined" || req.session.User == null)
        {
            res.redirect('/login');
            return false;
        }
    else
        {
           Language = req.session.Language;
        }

  var LabelDetalii = {"Value_RO": "Detalii","Value_EN":"Details"};
  if (ServerCache["Ready"] !== true || typeof ServerCache.Procedures == "undefined")
    {
      res.send("Cache Not Complete");
    }
      else
          {
            for (var i = 0; i < ServerCache.Procedures.length; i++)
            {
              if(ServerCache.Procedures[i] == "undefined")
                  {
                    console.log("Procedure "+i+" is undefined")
                  }
              else
                  {
                    if(ServerCache.Procedures[i].Status == "approved" || ServerCache.Procedures[i].ID_Client == req.session.User.ID_Client)
                    {
                      if(typeof req.session.User["FAVID"][ServerCache.Procedures[i].ID] !== "undefined")
                          {
                                favProcedures += '<li id="my-favourite-procedure-' + ServerCache.Procedures[i].ID + '" class="procedure-item">' +
                                    '  <a class="view-procedure" style="cursor: pointer" onclick="generateDetails(' + ServerCache.Procedures[i].ID + ')"><span class="procedure-name">' + ServerCache.Procedures[i].Name + '</span>' +
                                    '    <span class="procedure-status ' + ServerCache.Procedures[i].Status + '" title="' + ServerCache.Procedures[i].Status + '">&nbsp;</span>' +
                                    '  </a>' +
                                    '  <a class="reset-procedure" style="cursor:pointer !important;" onclick=resetFavouriteProcedure(' + ServerCache.Procedures[i].ID + ')>Anuleaza</a>' +
                                    '</li>';

                          }

            }

          }
        }
                        res.send(favProcedures);
      }
    };

exports.setFavouriteProcedure = function(req, res, next) {

    var WSoptions = {
        host: ConfigFile.WebServiceIP,
        path: ConfigFile.WebServiceURLDIR + '/BRMWrite.svc/execute/Procedures/setFavouriteProcedure',
        port: ConfigFile.WebServicePORT,
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        }
    };

    var reqData = JSON.stringify({
        "SessionId": req.sessionID,
        "currentState": "login",
        "objects": [{
            "Arguments": {
                "ID_Procedure": req.body.ID_Procedure
            }
        }]
    });

    var WSrequest = http.request(WSoptions, function(WSres) {
        var data = '';
        WSres.on('data', function(chunk) {
            data += chunk;
        });
        WSres.on('end', function() {

          if( ServerCache.testJSON(data) == false)
          {
            console.log(data);
            res.sendStatus(500);
            return false;
          }

          data = JSON.parse(data);


            if (data.Result == "Security Audit Failed" || data === 'undefined') {
                console.log("FAV CONTROLLER FAILED !! " + JSON.stringify(data));
                res.redirect('/logout');
            } else if (data.ErrorCode != 0 || data === 'undefined') {
                res.sendStatus("ErrorCode: " + data.Result);
            }

            else
            {
                req.session.User.FAVID[req.body.ID_Procedure] = true;
                console.log("FavAdd "+req.body.ID_Procedure);
                console.log(req.session.User.FAVID);
                res.sendStatus(200);
            }

        });

    });

    WSrequest.write(reqData);
    WSrequest.end();

};

exports.resetFavouriteProcedure = function(req, res, next) {

    var WSoptions = {
        host: ConfigFile.WebServiceIP,
        path: ConfigFile.WebServiceURLDIR + '/BRMWrite.svc/execute/Procedures/resetFavouriteProcedure',
        port: ConfigFile.WebServicePORT,
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        }
    };

    var reqData = JSON.stringify({
        "SessionId": req.sessionID,
        "currentState": "login",
        "objects": [{
            "Arguments": {
                "ID_Procedure": req.body.ID_Procedure
            }
        }]
    });

    var WSrequest = http.request(WSoptions, function(WSres) {
        var data = '';
        WSres.on('data', function(chunk) {
            data += chunk;
        });
        WSres.on('end', function() {

          if( ServerCache.testJSON(data) == false)
          {
            console.log(data);
            res.sendStatus(500);
            return false;
          }

          data = JSON.parse(data);


            if (data.ErrorCode != 0 || data === 'undefined') {
                res.sendStatus("ErrorCode: " + data.Result);
            } else {
                delete req.session.User.FAVID[req.body.ID_Procedure];
                console.log("removing fav "+req.body.ID_Procedure);
                console.log(req.session.User.FAVID);
                res.sendStatus(200);
            }

        });

    });

    WSrequest.write(reqData);
    WSrequest.end();

};
