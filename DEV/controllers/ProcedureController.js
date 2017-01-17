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


exports.getProcedureVariables = function (req, res, next)
{
  var ProcedureID;
  ProcedureID = req.body.id;
  if( ProcedureID == "" || ProcedureID == "undefined" )
  {
    throw new Error('This is not an error. This is just to abort javascript');
    console.log( Error );
  }

    var WSoptions =
      {
            host: ConfigFile.WebServiceIP,
            path: ConfigFile.WebServiceURLDIR+'/BRMRead.svc/select/Procedures/getProcedureVariables',
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
          	"method": "execute",
          	"procedure": "editProcedure",
          	"service": "/BRMWrite.svc",
            "objects":
                	[
                		{"Arguments":{"ID_Procedure": ProcedureID}}
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

exports.getProcedures = function(req, res, next)
  {
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
                                // console.log("favourite "+ServerCache.Procedures[i].ID)
                                Procedures+= '<li id="procedure-' + ServerCache.Procedures[i].ID + '" class="procedure-item">' +
                                  '    <div class="row">' +
                                  '        <div class="col-md-5 toggle-procedure" onclick=toggleProcedure(' + ServerCache.Procedures[i].ID + ')><a class="procedure-name">' + ServerCache.Procedures[i].Name + '</a>' +
                                  '            <div class="procedure-details"><span class="procedure-location">' + ServerCache.Procedures[i].Location + '</span>&nbsp;|&nbsp;<span class="procedure-classification"> ' + ServerCache.Procedures[i].Classification  + ' </span>&nbsp;|&nbsp;<span class="procedure-legislation">' + ServerCache.Procedures[i].Legislation + '</span>' +
                                  '            </div>' +
                                  '        </div>' +
                                  '       <div id="procedure-detail-status">' +
                                  '        <div class="col-md-1"><span class="procedure-type ' + ServerCache.Procedures[i].ID_ProcedureType.Value_RO.toLowerCase().replace (/ /g, "_") + '">' + ServerCache.Procedures[i].ID_ProcedureType["Value_"+Language] + '</span>' +
                                  '        </div>' +
                                  '        <div class="col-md-1">' +
                                  '            <a id="isFav-'+ ServerCache.Procedures[i].ID + '" class="procedure-favourite added" title="Remove_favorite" data-title="Inlaurati ca procedura favorita" style="cursor:pointer !important;" onclick=resetFavouriteProcedure(' + ServerCache.Procedures[i].ID + ')></a>' +
                                  '        </div>' +
                                  '        <div class="col-md-1"><span class="procedure-status ' + ServerCache.Procedures[i].Status + '" title="' + ServerCache.Procedures[i].Status + '"></span>' +
                                  '        </div>' +
                                  '        <div class="col-md-3">' +
                                  '            <p class="procedure-time">Lansare<span class="procedure-launch">' + moment (ServerCache.Procedures[i].TendersOpeningDate).format ("YYYY-MM-DD HH:mm") + '</span>' +
                                  '            </p>' +
                                  '            <p class="procedure-time">Clarificari pana la<span class="procedure-clarifications-deadline">' + moment (ServerCache.Procedures[i].ClarificationRequestsDeadline).format ("YYYY-MM-DD HH:mm") + '</span>' +
                                  '            </p>' +
                                  '            <p class="procedure-time">Termen depunere<span class="procedure-deadline">' + moment (ServerCache.Procedures[i].TendersReceiptDeadline).format ("YYYY-MM-DD HH:mm") + '</span>' +
                                  '            </p>' +
                                  '        </div>' +
                                  '       </div>' +
                                  '        <div class="col-md-1"><a class="toggle-procedure collapse" onclick=toggleProcedure(' + ServerCache.Procedures[i].ID + ')>&nbsp;</a>' +
                                  '        </div>' +
                                  '        <div class="col-md-12 procedure-expandable">' +
                                  '            <div class="row">' +
                                  '                <div class="col-md-5">' +
                                  '                    <p class="procedure-description">' + ServerCache.Procedures[i].Description + '</p>' +
                                  '                </div>' +
                                  '                <div class="col-md-6 procedure-offer-details">' +
                                  '                    <div class="row">' +
                                  '                        <div class="col-md-3">' +
                                  '                            <p><strong>Clarificari</strong>' +
                                  '                            </p>' +
                                  '                            <p class="procedure-clarifications"></p>' +
                                  '                      </div>' +
                                  '                        <div class="col-md-4">' +
                                  '                            <p><strong>Depuneri oferte</strong>' +
                                  '                            </p>' +
                                  '                            <p class="procedure-submission"></p>' +
                                  '                        </div>' +
                                  '                        <div class="col-md-5">' +
                                  '                            <p><strong>Autoritate contractanta</strong>' +
                                  '                            </p>' +
                                  '                            <p class="procedure-contracter">' + ServerCache.Procedures[i].OrganizationName + '</p>' +
                                  '                        </div>' +
                                  '                    </div><a class="view-procedure btn btn-default" style="cursor: pointer" onclick="generateDetails(' + ServerCache.Procedures[i].ID + ')">'+LabelDetalii["Value_"+Language]+'</a>' +
                                  '                </div>' +
                                  '            </div>' +
                                  '        </div>' +
                                  '    </div>' +
                                  '</li>';

                                  favProcedures += '<li id="my-favourite-procedure-' + ServerCache.Procedures[i].ID + '" class="procedure-item">' +
                                      '  <a class="view-procedure" style="cursor: pointer" onclick="generateDetails(' + ServerCache.Procedures[i].ID + ')"><span class="procedure-name">' + ServerCache.Procedures[i].Name + '</span>' +
                                      '    <span class="procedure-status ' + ServerCache.Procedures[i].Status + '" title="' + ServerCache.Procedures[i].Status + '">&nbsp;</span>' +
                                      '  </a>' +
                                      '  <a class="reset-procedure" style="cursor:pointer !important;" onclick=resetFavouriteProcedure(' + ServerCache.Procedures[i].ID + ')>Anuleaza</a>' +
                                      '</li>';

                            }
                        else
                            {
                            Procedures+= '<li id="procedure-' + ServerCache.Procedures[i].ID + '" class="procedure-item">' +
                              '    <div class="row">' +
                              '        <div class="col-md-5 toggle-procedure" onclick=toggleProcedure(' + ServerCache.Procedures[i].ID + ')><a class="procedure-name">' + ServerCache.Procedures[i].Name + '</a>' +
                              '            <div class="procedure-details"><span class="procedure-location">' + ServerCache.Procedures[i].Location + '</span>&nbsp;|&nbsp;<span class="procedure-classification"> ' + ServerCache.Procedures[i].Classification  + ' </span>&nbsp;|&nbsp;<span class="procedure-legislation">' + ServerCache.Procedures[i].Legislation + '</span>' +
                              '            </div>' +
                              '        </div>' +
                              '       <div id="procedure-detail-status">' +
                              '        <div class="col-md-1"><span class="procedure-type ' + ServerCache.Procedures[i].ID_ProcedureType.Value_RO.toLowerCase().replace (/ /g, "_") + '">' + ServerCache.Procedures[i].ID_ProcedureType["Value_"+Language] + '</span>' +
                              '        </div>' +
                              '        <div class="col-md-1">' +
                              '            <a id="isFav-' + ServerCache.Procedures[i].ID + '" class="procedure-favourite " title="Add_favorite" data-title="Add_favorite" style="cursor:pointer !important;" onclick=setFavouriteProcedure(' + ServerCache.Procedures[i].ID + ')></a>' +
                              '        </div>' +
                              '        <div class="col-md-1"><span class="procedure-status ' + ServerCache.Procedures[i].Status + '" title="' + ServerCache.Procedures[i].Status + '"></span>' +
                              '        </div>' +
                              '        <div class="col-md-3">' +
                              '            <p class="procedure-time">Lansare<span class="procedure-launch">' + moment (ServerCache.Procedures[i].TendersOpeningDate).format ("YYYY-MM-DD HH:mm") + '</span>' +
                              '            </p>' +
                              '            <p class="procedure-time">Clarificari pana la<span class="procedure-clarifications-deadline">' + moment (ServerCache.Procedures[i].ClarificationRequestsDeadline).format ("YYYY-MM-DD HH:mm") + '</span>' +
                              '            </p>' +
                              '            <p class="procedure-time">Termen depunere<span class="procedure-deadline">' + moment (ServerCache.Procedures[i].TendersReceiptDeadline).format ("YYYY-MM-DD HH:mm") + '</span>' +
                              '            </p>' +
                              '        </div>' +
                              '       </div>' +
                              '        <div class="col-md-1"><a class="toggle-procedure collapse" onclick=toggleProcedure(' + ServerCache.Procedures[i].ID + ')>&nbsp;</a>' +
                              '        </div>' +
                              '        <div class="col-md-12 procedure-expandable">' +
                              '            <div class="row">' +
                              '                <div class="col-md-5">' +
                              '                    <p class="procedure-description">' + ServerCache.Procedures[i].Description + '</p>' +
                              '                </div>' +
                              '                <div class="col-md-6 procedure-offer-details">' +
                              '                    <div class="row">' +
                              '                        <div class="col-md-3">' +
                              '                            <p><strong>Clarificari</strong>' +
                              '                            </p>' +
                              '                            <p class="procedure-clarifications"></p>' +
                              '                      </div>' +
                              '                        <div class="col-md-4">' +
                              '                            <p><strong>Depuneri oferte</strong>' +
                              '                            </p>' +
                              '                            <p class="procedure-submission"></p>' +
                              '                        </div>' +
                              '                        <div class="col-md-5">' +
                              '                            <p><strong>Autoritate contractanta</strong>' +
                              '                            </p>' +
                              '                            <p class="procedure-contracter">' + ServerCache.Procedures[i].OrganizationName + '</p>' +
                              '                        </div>' +
                              '                    </div><a class="view-procedure btn btn-default" style="cursor: pointer" onclick="generateDetails(' + ServerCache.Procedures[i].ID + ')">'+LabelDetalii["Value_"+Language]+'</a>' +
                              '                </div>' +
                              '            </div>' +
                              '        </div>' +
                              '    </div>' +
                              '</li>'
                            }
                        }
                       if (ServerCache.Procedures[i].ID_Client == req.session.User.ID_Client)
                       {
                         myProcedures += '<li class="procedure-item" id=my-procedure-' + ServerCache.Procedures[i].ID + '>' +
                        '<a class="view-procedure" style="cursor: pointer" onclick="generateDetails(' + ServerCache.Procedures[i].ID + ')"><span class="procedure-name">' + ServerCache.Procedures[i].Name + '</span>' +
                         '<span class="procedure-status ' + ServerCache.Procedures[i].Status + '" title="draft">&nbsp;</span>' +
                         '</a><a class="delete-procedure" style="cursor:pointer !important;" onclick="deleteProcedure(' + ServerCache.Procedures[i].ID +')">Anuleaza</a>' +
                         '</li>';
                      }
                  }
                }
                  output["Procedures"] = Procedures;
                  output["myProcedures"] = myProcedures;
                  output["favProcedures"] = favProcedures;
                  res.send(output);
            }
  ;}
{




// function isFav(item)
// {
//   for (var i = 0; i < req.session.Fav.length; i++)
//     {
//       if(req.session.Fav[i].ID == item.id)
//       {
//         Favourites += '<li id="my-favourite-procedure-' + item.ID + '" class="procedure-item">' +
//             '  <a class="view-procedure" style="cursor: pointer" onclick="generateDetails(' + item.ID + ')"><span class="procedure-name">' + item.Name + '</span>' +
//             '    <span class="procedure-status ' + item.Status + '" title="' + item.Status + '">&nbsp;</span>' +
//             '  </a>' +
//             '  <a class="reset-procedure" style="cursor:pointer !important;" onclick=resetFavouriteProcedure(' + item.ID + ')>Anuleaza</a>' +
//             '</li>';
//
//             Procedures+= '<li id="procedure-' + ServerCache.Procedures[i].ID + '" class="procedure-item">' +
//               '    <div class="row">' +
//               '        <div class="col-md-5 toggle-procedure" onclick=toggleProcedure(' + ServerCache.Procedures[i].ID + ')><a class="procedure-name">' + ServerCache.Procedures[i].Name + '</a>' +
//               '            <div class="procedure-details"><span class="procedure-location">' + ServerCache.Procedures[i].Location + '</span>&nbsp;|&nbsp;<span class="procedure-classification"> ' + ServerCache.Procedures[i].Classification  + ' </span>&nbsp;|&nbsp;<span class="procedure-legislation">' + ServerCache.Procedures[i].Legislation + '</span>' +
//               '            </div>' +
//               '        </div>' +
//               '       <div id="procedure-detail-status">' +
//               '        <div class="col-md-1"><span class="procedure-type ' + ServerCache.Procedures[i].ID_ProcedureType.Value_RO.toLowerCase().replace (/ /g, "_") + '">' + ServerCache.Procedures[i].ID_ProcedureType["Value_"+Language] + '</span>' +
//               '        </div>' +
//               '        <div class="col-md-1">' +
//               '            <a id="isFav-' + ServerCache.Procedures[i].ID + '" class="procedure-favourite " title="Add_favorite" data-title="Add_favorite" style="cursor:pointer !important;" onclick=setFavouriteProcedure(' + ServerCache.Procedures[i].ID + ')></a>' +
//               '        </div>' +
//               '        <div class="col-md-1"><span class="procedure-status ' + ServerCache.Procedures[i].Status + '" title="' + ServerCache.Procedures[i].Status + '"></span>' +
//               '        </div>' +
//               '        <div class="col-md-3">' +
//               '            <p class="procedure-time">Lansare<span class="procedure-launch">' + moment (ServerCache.Procedures[i].TendersOpeningDate).format ("YYYY-MM-DD HH:mm") + '</span>' +
//               '            </p>' +
//               '            <p class="procedure-time">Clarificari pana la<span class="procedure-clarifications-deadline">' + moment (ServerCache.Procedures[i].ClarificationRequestsDeadline).format ("YYYY-MM-DD HH:mm") + '</span>' +
//               '            </p>' +
//               '            <p class="procedure-time">Termen depunere<span class="procedure-deadline">' + moment (ServerCache.Procedures[i].TendersReceiptDeadline).format ("YYYY-MM-DD HH:mm") + '</span>' +
//               '            </p>' +
//               '        </div>' +
//               '       </div>' +
//               '        <div class="col-md-1"><a class="toggle-procedure collapse" onclick=toggleProcedure(' + ServerCache.Procedures[i].ID + ')>&nbsp;</a>' +
//               '        </div>' +
//               '        <div class="col-md-12 procedure-expandable">' +
//               '            <div class="row">' +
//               '                <div class="col-md-5">' +
//               '                    <p class="procedure-description">' + ServerCache.Procedures[i].Description + '</p>' +
//               '                </div>' +
//               '                <div class="col-md-6 procedure-offer-details">' +
//               '                    <div class="row">' +
//               '                        <div class="col-md-3">' +
//               '                            <p><strong>Clarificari</strong>' +
//               '                            </p>' +
//               '                            <p class="procedure-clarifications"></p>' +
//               '                      </div>' +
//               '                        <div class="col-md-4">' +
//               '                            <p><strong>Depuneri oferte</strong>' +
//               '                            </p>' +
//               '                            <p class="procedure-submission"></p>' +
//               '                        </div>' +
//               '                        <div class="col-md-5">' +
//               '                            <p><strong>Autoritate contractanta</strong>' +
//               '                            </p>' +
//               '                            <p class="procedure-contracter">' + ServerCache.Procedures[i].OrganizationName + '</p>' +
//               '                        </div>' +
//               '                    </div><a class="view-procedure btn btn-default" style="cursor: pointer" onclick="generateDetails(' + ServerCache.Procedures[i].ID + ')">'+LabelDetalii["Value_"+Language]+'</a>' +
//               '                </div>' +
//               '            </div>' +
//               '        </div>' +
//               '    </div>' +
//               '</li>'
//       }
//     }
// }


}



exports.addProcedure = function(req, res, next)
{

    console.log(req.body)

var WSoptions =
  {
        host: ConfigFile.WebServiceIP,
        path: ConfigFile.WebServiceURLDIR+'/BRMWrite.svc/execute/Procedures/addProcedure',
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
      	"procedure": "addProcedure",
      	"service": "/BRMWrite.svc",
        "objects": [
            {
                "Arguments": {
                    "SubmitTime": req.body.SubmitTime,
                    "Name": req.body.Name,
                    "Description": req.body.Description,
                    "Location": req.body.Location,
                    "Legislation": req.body.Legislation,
                    "Duration": parseInt(req.body.Duration),
                    "TotalValue": parseInt(req.body.TotalValue),
                    "ID_ContractType": parseInt(req.body.ID_ContractType),
                    "ID_ProcedureType": parseInt(req.body.ID_ProcedureType),
                    "ID_ProcedureCriterion": parseInt(req.body.ID_ProcedureCriterion),
                    "Forms": req.body.Forms,
                    "EconomicCapacity": req.body.EconomicCapacity,
                    "TechnicalCapacity": req.body.TechnicalCapacity,
                    "ClarificationRequestsDeadline": req.body.ClarificationRequestsDeadline,
                    "TendersReceiptDeadline": req.body.TendersReceiptDeadline,
                    "TendersOpeningDate": req.body.TendersOpeningDate,
                    "ContestationsSubmission": req.body.ContestationsSubmission,
                    "OtherInformation": req.body.OtherInformation,
                    "Necessity": req.body.Necessity,
                    "ClassificationIDs": [
                        2088,
                        1290
                    ]
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
                    res.send("ErrorCode: "+ JSON.stringify(data.Result));
                }

          else
            {
                console.log("------------------>"+JSON.stringify(data.Result.ID_Procedure));
                ServerCache.requestProcedure(data.Result.ID_Procedure);
                res.send(data.Result.ID_Procedure);
            }

        });

  });

WSrequest.write(reqData);
WSrequest.end();

};


exports.editProcedure = function(req, res, next)
{
  /// Needs to check if has the right to delete.
  var TheProcedure = ServerCache.getProcedurebyID(req.body.ID);
  if(TheProcedure.ID_Client !== req.session.User.ID_Client)
  {
    console.log("WARNING !!!!!!!! he can't edit that procedure PID="+TheProcedure.ID_Client+"and user="+req.session.User.ID_Client+" redirecting");
    res.redirect ('/logout');
  }
  else {
    console.log("Yeah he can PID="+TheProcedure.ID_Client+"and user="+req.session.User.ID_Client);
    console.log(req.body.SubmitTime+"-Time "+moment(req.body.ClarificationRequestsDeadline).format());
    var WSoptions =
      {
            host: ConfigFile.WebServiceIP,
            path: ConfigFile.WebServiceURLDIR+'/BRMWrite.svc/execute/Procedures/editProcedure',
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
          	"procedure": "editProcedure",
          	"service": "/BRMWrite.svc",
            "objects": [
                {
                    "Arguments": {
                        "ID_Procedure": req.body.ID,
                        "SubmitTime": req.body.SubmitTime,
                        "Name": req.body.Name,
                        "Description": req.body.Description,
                        "Location": req.body.Location,
                        "Legislation": req.body.Legislation,
                        "Duration": parseInt(req.body.Duration),
                        "TotalValue": parseInt(req.body.TotalValue),
                        "ID_ContractType": parseInt(req.body.ID_ContractType),
                        "ID_ProcedureType": parseInt(req.body.ID_ProcedureType),
                        "ID_ProcedureCriterion": parseInt(req.body.ID_ProcedureCriterion),
                        "Forms": req.body.Forms,
                        "EconomicCapacity": req.body.EconomicCapacity,
                        "TechnicalCapacity": req.body.TechnicalCapacity,
                        "ClarificationRequestsDeadline": moment(req.body.ClarificationRequestsDeadline).format(),
                        "TendersReceiptDeadline": req.body.TendersReceiptDeadline,
                        "TendersOpeningDate": req.body.TendersOpeningDate,
                        "ContestationsSubmission": req.body.ContestationsSubmission,
                        "OtherInformation": req.body.OtherInformation,
                        "Necessity": req.body.Necessity,
                        "ClassificationIDs": req.body.ClassificationIDs,
          }
        }]
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
                          console.log("FAILED !!"+data);
                    }

                else if (data.ErrorCode != 0 || data === 'undefined')
                    {
                        res.send("ErrorCode: "+data.Result);
                    }

              else
                {
                    //Problema aici cod async
                    ServerCache.replaceProcedure(req.body.ID);
                    setTimeout(function(){res.send("Edited Procedure number" +req.body.ID); res.io.emit ("socketToMe", "NewProcedure");}, 500);
                }

            });

      });

    WSrequest.write(reqData);
    WSrequest.end();
  }
};



exports.deleteProcedure = function(req, res, next)
    {

        var WSoptions =
        {
            host: ConfigFile.WebServiceIP,
            path: ConfigFile.WebServiceURLDIR+'/BRMWrite.svc/execute/Procedures/deleteProcedure',
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
                "procedure": "deleteProcedure",
                "service": "/BRMWrite.svc",
                "objects": [
                    {
                        "Arguments":
                                    {
                                        "ID_Procedure": req.body.ID
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
                          console.log("Procedure FAILED !! "+JSON.stringify(data));
                          res.redirect ('/logout');
                    }

                else if (data.ErrorCode != 0 || data === 'undefined')
                    {
                        res.sendStatus("ErrorCode: "+data.Result);
                    }
                else
                    {
                        ServerCache.deleteProcedure(req.body.ID);
                        setTimeout(function(){res.send("deleted procedure" +req.body.ID); res.io.emit ("socketToMe", "NewProcedure");}, 500);
                    }

            });

        });

        WSrequest.write(reqData);
        WSrequest.end();

    };
