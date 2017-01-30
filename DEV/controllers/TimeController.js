var express = require('express');
var http = require('http');
var app = express();
var AppFile = require('../app.js');
var ConfigFile = require('../config.js');
// var host = ConfigFile.WebServiceIP;

exports.servertime = function(req, res, next)
{

var WSoptions =
  {
        host: ConfigFile.WebServiceIP,
        path: ConfigFile.WebServiceURLDIR+'/BRMRead.svc/servertime',
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
                      console.log("TIME FAILED !! "+JSON.stringify(data));
                      res.redirect ('/logout');
                }

            else if (data.ErrorCode != 0 || data === 'undefined')
                {
                    res.sendStatus("ErrorCode: "+data.Result);
                }

          else
            {
              res.send(data.Result);
            }

        });

  });

WSrequest.write(reqData);
WSrequest.end();

};
