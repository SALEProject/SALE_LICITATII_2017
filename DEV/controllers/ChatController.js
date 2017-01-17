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
// var SecurityCheck = require('../controllers/SecurityCheck.js');

exports.getChatHistory = function(req, res, next)
{

var WSoptions =
  {
        host: ConfigFile.WebServiceIP,
        path: ConfigFile.WebServiceURLDIR+'/BRMRead.svc/select/Messages/getChatHistory',
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

            data = JSON.parse(data);

              if(data.Result == "Security Audit Failed" || data === 'undefined')
                  {
                        console.log(" CHAT CONTROLLER FAILED !! "+JSON.stringify(data));
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




exports.addChatMessage = function(req, res, next)
{

var WSoptions =
  {
        host: ConfigFile.WebServiceIP,
        path: ConfigFile.WebServiceURLDIR+'/BRMWrite.svc/execute/Messages/addChatMessage',
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
          "objects":
              [
                  {
                    "Arguments":
              			   {
              				       "Message": req.body.Message
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

          data = JSON.parse(data);

            if(data.Result == "Security Audit Failed" || data === 'undefined')
                {
                      console.log("FAILED !!"+data);
                      res.redirect ('/logout');
                }

            else if (data.ErrorCode != 0 || data === 'undefined')
                {
                    res.sendStatus("ErrorCode: "+data.Result);
                }
          else
            {
                var OldLen = ServerCache.Chat.length;
                ServerCache.updateCacheChat();

                var check = setInterval(function()
                {
                  if(OldLen < ServerCache.Chat.length)
                  {
                      clearInterval(check);
                      res.sendStatus(200);
                      res.io.emit("socketToMe", "updateChat");
                      return true;
                  }
                  else {
                    // console.log(OldLen+'/'+ServerCache.Chat.length)
                  }
                }, 100);


                // var output = ''
                // //res.send(output);
                // for (var i = 0; i < ServerCache.Chat.length; i++)
                // {
                //   if(ServerCache.Chat[i] == "undefined")
                //       {
                //         console.log("Chat "+i+" is undefined")
                //       }
                //   else
                //       {
                //           output += '<li class="chat-message" id=chat-item-' + ServerCache.Chat[i].ID + '><div class=' + ServerCache.Chat[i].Date + '>' + moment(ServerCache.Chat[i].Date).format("HH:mm") + ' ' + ServerCache.Chat[i].LoginName + ': ' + ServerCache.Chat[i].Message + '</li>';
                //       }
                // }
                //     res.send(output);
                // ServerCache.Chat.push("Kiwi");
                // ChatCache.push()

            }

        });

  });

WSrequest.write(reqData);
WSrequest.end();

};
