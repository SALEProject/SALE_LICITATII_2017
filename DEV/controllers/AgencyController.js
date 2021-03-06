var express = require('express');
var http = require('http');
var app = express();
var flash = require('connect-flash');
var session		=	require('express-session');
var sessionStore = new session.MemoryStore();
var AppFile = require('../app.js');
var ConfigFile = require('../config.js');
// var host = ConfigFile.WebServiceIP;

exports.getAgencyDetails = function(req, res, next)
    {
    var WSoptions =
    {
        host: ConfigFile.WebServiceIP,
        path: ConfigFile.WebServiceURLDIR+'/BRMRead.svc/select/Agencies/getAgencies',
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
            "SessionId": req.sessionID,
            "currentState": "login",
            "method": "/select",
            "objects": [
                {
                    "Arguments":
                    {
                        ID_Agency: req.session.User.ID_Agency
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
                    console.log("Agency Controller FAILED !! "+JSON.stringify(data));
                    res.redirect ('/logout');
                }

            else if (data.ErrorCode != 0 || data === 'undefined')
                {
                    res.sendStatus("ErrorCode: "+data.Result);
                }

            else
                {
                    res.send(data.Result.Rows);
                }

        });

    });

    WSrequest.write(reqData);
    WSrequest.end();

};
