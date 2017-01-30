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

exports.getFormFile = function (req, res, next)
{
  var filename = "";
  switch(req.body.filename) {
  case "Referat de necesitate":
      filename = "Referat de necesitate.doc";
      break;
  case "Nota de fundamentare":
      filename = "Nota de fundamentare.doc";
      break;
  case "Fisa de date":
      filename = "Fisa de date.doc";
      break;
  case "CS":
      filename = "Caietul de sarcini.doc";
      break;
  default:
      filename = "Document.doc";
}

    if( filename == "") {
      throw new Error('Invalid FileName requested'+filename);
    }

    var content = '<html><head><meta http-equiv="content-type" content="text/html;charset=UTF-8" /><meta charset="utf-8" /></head><body>';
    content += req.body.content;
    content += '</body><html>';
    res.set({'Content-Disposition': 'attachment;  filename='+filename+'','content-type': 'application/force-download; charset=utf-8'});
    // res.set({'Content-Disposition': 'attachment;  filename=\"2015.doc\"','content-type': 'application/force-download; charset=utf-8'});
    res.end( content );
};

exports.Document = function (req, res, next)
{
  var FileName = "Document.pdf";
  if( req.body.filename )
      {
        FileName = req.body.filename;
      }

  if( req.body.path )
  {
      // res.download( req.body.path, FileName);
      //var ext = fileName.substr(fileName.lastIndexOf('.') + 1);
      res.download('D:\\deving\\uploads\\t6xyg1484736091818.doc', FileName);
  }

  else {
      // res.send(500);
      res.download('D:\\deving\\uploads\\t6xyg1484736091818.doc', FileName);
  }
}

exports.getDocument = function (req, res, next)
{
  var DocumentID = parseInt(req.body.DocumentID);
  var ProcedureID = parseInt(req.body.ProcedureID);

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
          "SessionId": req.sessionID,
          "currentState": "login",
          "objects":
                [
                  {
                    "Arguments":
                                     {
                                      "ID_Procedure": ProcedureID,
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

              else if (data.Success == false || data.ErrorCode != 0 || data === 'undefined')
                  {
                      res.sendStatus("ErrorCode: "+JSON.stringify(data.Result));
                  }

            else
              {
                  var DocumentURL = "";
                  var DocumentName = "";
                  for (var i = 0; i < data.Result.Rows.length; i++) {
                    if(data.Result.Rows[i].ID == DocumentID)
                    {
                      DocumentURL = data.Result.Rows[i].DocumentURL;
                      DocumentName = data.Result.Rows[i].Name;
                    }
                  }
                    if(DocumentURL !== "" || DocumentURL !== "undefined" || DocumentName !== "" || DocumentName !== "undefined")
                        {
                          res.download(DocumentURL, DocumentName+".pdf");
                        }
                    else
                        {
                          res.sendStatus(500);
                        }
              }
          });
    });

  WSrequest.write(reqData);
  WSrequest.end();
}
