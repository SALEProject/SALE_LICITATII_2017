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
var Mailer = require('./MailerController.js');



exports.DocumentDetails = function(req, res, next)
{

  if( req.session.User == "undefined" || req.session.User == "" || req.session.User.ID_Client == "undefined" || req.session.User.ID_Client == "" )
  {
    console.log("Session Not Found");
    res.redirect("/logout");
    return false;
  }

  var DocumentID = parseInt(req.body.id);

  var WSoptions =
  {
      host: ConfigFile.WebServiceIP,
      path: ConfigFile.WebServiceURLDIR+'/BRMRead.svc/select/Procedures/getProcedureDocuments',
      port: ConfigFile.WebServicePORT,
      method: 'POST',
      headers:
        {
          'Content-Type': 'text/plain'
        }
  };

  var reqData = JSON.stringify
  (
  {
        "SessionId": ConfigFile.WebServiceSessionID,
        "currentState": "login",
        "objects":
                  [
                    {
                      Arguments:
                      {
		                     "ID_Document": DocumentID,
                      }
                    }
                  ]
    }
  );

  var WSrequest = http.request(WSoptions, function(WSres)
  {
      var data = '';
      WSres.on('data', function(chunk)
        {
            data += chunk;
        });
      WSres.on('end', function()
        {
          if( ServerCache.testJSON(data) == false)
          {
            console.log(data);
            res.sendStatus(500);
            return false;
          }

          data = JSON.parse(data);

            if(data.Result == "Security Audit Failed" || data === 'undefined')
                {
                      console.log(" CHAT CONTROLLER FAILED !! "+JSON.stringify(data));
                      res.redirect ('/logout');
                }

            else if (data.ErrorCode != 0 || data === 'undefined')
                {
                    res.send("ErrorCode: "+JSON.stringify(data.Result));
                }

            else
              {
                Result = {'message':'Desemneaza castigator ofertantul '+data.Result.Rows[0].AgencyName+' cu oferta de '+ data.Result.Rows[0].Value +' lei?',"ID_Procedure":data.Result.Rows[0].ID_Procedure,"ID_Agency":data.Result.Rows[0].ID_Agency};
                res.send(Result);
              }

          });

    });

  WSrequest.write(reqData);
  WSrequest.end();

  };
