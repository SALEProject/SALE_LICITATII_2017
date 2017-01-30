var fileUpload = require('express-fileupload');
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
var multer = require('multer')


exports.Upload = function(req, res, next)
{
  console.log(req.sessionID);
  var WSoptions =
    {
          host: ConfigFile.WebServiceIP,
          path: ConfigFile.WebServiceURLDIR+'/BRMWrite.svc/execute/Procedures/addProcedureDocument',
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
          "method": "execute",
          "procedure": "addProcedureDocument",
          "service": "/BRMWrite.svc",
          "objects":
                [
                  {
                    "Arguments":
                                     {
                                      "ID_Procedure": parseInt(req.body.ProcedureID),
                                      "Name": req.body.DocName,
                                      "DocumentURL": req.files[0].path,
                                      "Content":"z",
                                      "Value": parseInt(req.body.OfferValue),
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
                      // res.redirect ('/logout');
                        console.log("FAILED !!"+JSON.stringify(data));
                  }

              else if (data.ErrorCode != 0 || data === 'undefined')
                  {
                      res.sendStatus("ErrorCode: "+data.Result);
                  }

            else
              {
                  // res.send("ok");
                  res.send("ok");
              }

          });

    });

  WSrequest.write(reqData);
  WSrequest.end();
}
// exports.post = function(req, res, next)
// {
//   console.log("aici");
//   var sampleFile, uploadPath;
//
// 	if (!req.files) {
// 		res.status(400).send('No files were uploaded.');
// 		return;
// 	}
//
// 	sampleFile = req.files.sampleFile;
//
// 	uploadPath = __dirname + '/uploadedfiles/' + sampleFile.name;
//
// 	sampleFile.mv(uploadPath, function(err) {
// 		if (err) {
// 			res.status(500).send(err);
//       console.log("errrrii"+err);
// 		}
// 		else {
//       var WSoptions =
//         {
//               host: ConfigFile.WebServiceIP,
//               path: ConfigFile.WebServiceURLDIR+'/BRMWrite.svc/execute/Procedures/addProcedureDocument',
//               port: ConfigFile.WebServicePORT,
//               method: 'POST',
//               headers:
//                 {
//                   'Content-Type': 'text/plain'
//                 }
//         };
//
//       var reqData = JSON.stringify
//         (
//           {
//               "SessionId": req.SessionId,
//               "currentState": "login",
//               "method": "execute",
//               "procedure": "addProcedureDocument",
//               "service": "/BRMWrite.svc",
//               "objects":
//                     [
//                       {
//                         "Arguments":
//                                          {
//                                           "ID_Procedure": req.body.ProcedureID,
//                                           "Name": "Referat de Necesitate",
//                                           "DocumentURL":uploadPath,
//                                           "Content":"z"
//                                          }
//                       }
//                     ]
//             }
//         );
//
//       var WSrequest = http.request(WSoptions, function(WSres)
//         {
//             var data = '';
//             WSres.on('data', function(chunk)
//               {
//                   data += chunk;
//               });
//             WSres.on('end', function()
//               {
//                 data = JSON.parse(data);
//
//                   if(data.Result == "Security Audit Failed" || data === 'undefined')
//                       {
//                           // res.redirect ('/logout');
//                             console.log("FAILED !!"+JSON.stringify(data));
//                       }
//
//                   else if (data.Success == false || data.ErrorCode != 0 || data === 'undefined')
//                       {
//                           res.sendStatus("ErrorCode: "+JSON.stringify(data.Result));
//                       }
//
//                 else
//                   {
//                       res.send(data.Result.Rows);
//                   }
//
//               });
//         });
//
//       WSrequest.write(reqData);
//       WSrequest.end();
// 		}
// 	});
// }
