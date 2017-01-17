var express = require ('express');
var http = require ('http');
var app = express ();
var multer = require('multer');
var rand1 = Math.random().toString(36).substr(2, 5);
var rand2 = (new Date%9e6).toString(36);
var rand3 = (0|Math.random()*6.04e7).toString(36);
var RandomID = rand1+"-"+rand2+"-"+rand3;
// console.log(RandomID);

module.exports =
{
 // WebServiceIP: "10.0.0.100",
 // WebServiceURLDIR: "/BRMDataReader",
 // WebServiceSessionID: "ANbw_QADTf05Q431aWUVj6FmPvzGRPww",
 WebServiceSessionID: RandomID,
 WebServiceIP: "bitnova.ro",
 WebServiceURLDIR: "/brm",
 WebServicePORT: 80,
 WebServiceUserName: "SaleLicitatiiServer",
 WebServiceUserPassword: "thispasswordislongand140$secure*!",
 WebServiceReady: false,
 WebServiceUserID: 7315,
 NodeCacheServerTimeUpdate: (1 * 60000),   // Minutes
 NodeCacheMinProcedures: 100,
 NodeCacheMaxProcedures: 100,
 NodeCacheCleanInterval: (0.02 * 60000),   // Minutes
}

console.log("Webservice -> "+module.exports.WebServiceIP+":"+module.exports.WebServicePORT+module.exports.WebServiceURLDIR);

function ConnectToWebService()
{
    var timerStart=Date.now();
    var WSoptions =
  {
        host: module.exports.WebServiceIP,
        path: module.exports.WebServiceURLDIR+"/BRMLogin.svc/login",
        port: module.exports.WebServicePORT,
        method: 'POST',
        headers:
          {
            'Content-Type': 'text/plain'
          }
  };

var reqData =JSON.stringify(
    {
          "SessionId": module.exports.WebServiceSessionID,
          "currentState": 'login',
          "objects": [{
                          "Login":
                                  {
                                    "LoginName": module.exports.WebServiceUserName,
                                    "LoginPassword": module.exports.WebServiceUserPassword,
                                    "Language": "RO",
                                    "EntryPoint": "SALE"
                                  }
             }]
      }
    );


WSrequest = http.request(WSoptions, function(WSres)
  {
      var data = '';
      WSres.on('data', function(chunk)
        {
            data += chunk;
        });
      WSres.on('end', function()
        {
          data = JSON.parse(data);
          // if(typeof data !== 'undefined' && data !== '' && data.Success == true && typeof data.Result !== 'undefined' && data.Result.Success == true && data.Result.Error == '')
          if(data.Result.User !== "undefined" && data.Result.User !== null)
            {
              console.log("Logged in with "+JSON.stringify(data.Result.User.LoginName)+" ID: "+module.exports.WebServiceSessionID);
              module.exports.WebServiceReady = true;
            }
          else
            {
              console.log("LOGIN ERROR! "+JSON.stringify(data));
            }
        });
  });

WSrequest.write(reqData);
WSrequest.end();
};

ConnectToWebService();
