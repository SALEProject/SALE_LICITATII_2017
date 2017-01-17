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

exports.post = function(req, res, next)
{
  console.log("aici");
  var sampleFile, uploadPath;

	if (!req.files) {
		res.status(400).send('No files were uploaded.');
		return;
	}

	sampleFile = req.files.sampleFile;

	uploadPath = __dirname + '/uploadedfiles/' + sampleFile.name;

	sampleFile.mv(uploadPath, function(err) {
		if (err) {
			res.status(500).send(err);
      console.log("errrrii"+err);
		}
		else {
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
              "SessionId": req.SessionId,
              "currentState": "login",
              "method": "execute",
              "procedure": "addProcedureDocument",
              "service": "/BRMWrite.svc",
              "objects":
                    [
                      {
                        "Arguments":
                                         {
                                          "ID_Procedure": 4169,
                                          "Name": "Referat de Necesitate",
                                          "DocumentURL":uploadPath,
                                          "Content":"z"
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
                          // res.redirect ('/logout');
                            console.log("FAILED !!"+JSON.stringify(data));
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
		}
	});
}
