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

  if( !req.sessionID )
  {
    res.redirect('/logout');
    throw new Error('Who is this');
    console.log( Error );
    return false;
  }

  var ProcedureID;
  ProcedureID = req.body.id;
  // if ( ServerCache.Procedures[req.body.id].ID_Client !== req.session.User.ID_Client )
  // {
  //   throw new Error('User does not have access to the procedure variable');
  //   console.log( Error );
  // }

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
              if( ServerCache.testJSON(data) == false)
              {
                console.log(data);
                res.sendStatus(500);
                return false;
              }

              data = JSON.parse(data);

                if(data.Result == "Security Audit Failed" || data === 'undefined')
                    {
                          res.redirect ('/logout');
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



    exports.generateDetails = function(req, res, next)
    // {
    //   if( !req.session.User )
    //   {
    //     throw Error('Who is this');
    //     console.log( Error );
    //     res.redirect('/logout');
    //   }
    //
    //   else {
    //
    //   var id = req.body.id;
    //   var Procedure = ServerCache.getProcedurebyID(id);
    //   var toAppend = "";
    //   if(Procedure !== null || Procedure !== "")
    //   {
    //       if(Procedure.ID_Client == req.session.User.ID_Client)
    //         {
    //                               toAppend += '<div class="tile m-b-10 data-container procedure-item" id="procedure-detail-container" style="display: block;">'+
    //                               '    <div class="tile-title">'+
    //                               '    <h5 class="no-margin m-b-10 bold"><span id="detail-name" class="procedure-name">Procedura: ' + Procedure.Name + '</span></h5>'+
    //                               '<button onclick="getProcedureVariablesData('+Procedure.ID+');" class="btn btn-primary btn-small" style="float: right !important;z-index: 9999 !important;">Editeaza Procedura</button>'+
    //                               '<br>'+
    //                               '</div>'+
    //                               '<div class="tile-body">'+
    //                               '    <div class="row procedure-details-holder">'+
    //                               '    <div class="col-md-5">'+
    //                               '    <p id="detail-description" class="procedure-description"><strong>Descrierea procedurii: </strong> <br>' + Procedure.Description + '</p>'+
    //                               '<div id="detail-documents" class="procedure-documents"></div>'+
    //                               '    </div>'+
    //                               '    <div class="col-md-6">'+
    //                               '    <div id="detail-status" class="row">'+
    //                               '</div>'+
    //                               '</div>'+
    //                               '</div>'+
    //                               '<div class="clearfix"></div>'+
    //                               '    <div class="js-clarification-request-container col-md-6 col-xs-12" style="display: none;">'+
    //                               '    <div class="tile-title">'+
    //                               '    <h5 class="no-margin m-b-10 bold"><span class="procedure-name">Clarification_request</span></h5>'+
    //                               '    <br>'+
    //                               '    </div>'+
    //                               '    <div class="tile-body">'+
    //                               '    <input type="file" name="doc" id="js-clarification-file">'+
    //                               '    <input type="button" class="btn btn-success btn-cons js-clarification-start-upload" value="Submit">'+
    //                               '    </div>'+
    //                               '    <div class="clearfix"></div>'+
    //                               '    </div>'+
    //                               '    <div class="js-offer-container col-md-6 col-xs-12">'+
    //                               '   <div class="tile-title">'+
    //                               '   <h5 class="no-margin m-b-10 bold"><span class="procedure-name">Offer</span></h5>'+
    //                               '   <br>'+
    //                               '   </div>'+
    //                               '   <div class="tile-body">'+
    //                               '   <p>[PH]OFFFERS HERE viitor get offer aici</p>'+
    //                               '   </div>'+
    //                               '   <div class="clearfix"></div>'+
    //                               '   </div>'+
    //                               '   <div class="clearfix"></div>'+
    //                               '</div>'+
    //                               '</div>';
    //                               res.send(toAppend);
    //         }
    //         else
    //         {
              // toAppend += '<div class="tile m-b-10 data-container procedure-item" id="procedure-detail-container" style="display: block;">'+
              // '    <div class="tile-title">'+
              // '    <h5 class="no-margin m-b-10 bold"><span id="detail-name" class="procedure-name">NONONONONONO1111111</span></h5>'+
              // '<br>'+
              // '</div>'+
              // '<div class="tile-body">'+
              // '    <div class="row procedure-details-holder">'+
              // '    <div class="col-md-5">'+
              // '    <p id="detail-description" class="procedure-description">NONONONONONO</p>'+
              // '<div id="detail-documents" class="procedure-documents"></div>'+
              // '    </div>'+
              // '    <div class="col-md-6">'+
              // '    <div id="detail-status" class="row">'+
              // '</div>'+
              // '</div>'+
              // '</div>'+
              // '<div class="clearfix"></div>'+
              // '    <div class="js-clarification-request-container col-md-6 col-xs-12" style="display: none;">'+
              // '    <div class="tile-title">'+
              // '    <h5 class="no-margin m-b-10 bold"><span class="procedure-name">Clarification_request</span></h5>'+
              // '    <br>'+
              // '    </div>'+
              // '    <div class="tile-body">'+
              // '    <input type="file" name="doc" id="js-clarification-file">'+
              // '    <input type="button" class="btn btn-success btn-cons js-clarification-start-upload" value="Submit">'+
              // '    </div>'+
              // '    <div class="clearfix"></div>'+
              // '    </div>'+
              // '    <div class="js-offer-container col-md-6 col-xs-12">'+
              // '   <div class="tile-title">'+
              // '   <h5 class="no-margin m-b-10 bold"><span class="procedure-name">Offer</span></h5>'+
              // '   <br>'+
              // '   </div>'+
              // '   <div class="tile-body">'+
              // '   <input type="file" name="offer_doc" id="js-offer-file">'+
              // '   <input type="text" name="offer_price" class="js-offer-input" data-field="Price" placeholder="Pret"><br><br>'+
              // '   <input type="text" name="offer_deadline" class="js-offer-input" data-field="Deadline" placeholder="Delivery_deadline"><br><br>'+
              // '   <input type="button" class="btn btn-success btn-cons js-offer-start-upload" value="Submit">'+
              // '   </div>'+
              // '   <div class="clearfix"></div>'+
              // '   </div>'+
              // '   <div class="clearfix"></div>'+
              // '</div>'+
              // '</div>';
              // res.send(toAppend);
    //         }
    //   }
    //     else {
    //       res.send("error");
    //     }
    //   }
    // };

    {


    var UserID = 161;
    var ProcedureID = req.body.id;

    // test documentzzzzzz
    console.log("in test controller");

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
                        console.log(" CHAT CONTROLLER FAILED !! "+JSON.stringify(data));
                        res.redirect ('/logout');
                  }

              else if (data.ErrorCode != 0 || data === 'undefined')
                  {
                      res.sendStatus("ErrorCode: "+JSON.stringify(data.Result));
                  }

            else
              {
                var Tabel = '';
                var Result = '';
                var Oferta ='<h6> Oferte </h6>'+
                            '<table class="table table-hover table-condensed">'+
                            '<tr>'+
                            '<th style="max-width: 250px">Data</th>'+
                            '<th style="max-width: 250px">Ofertant</th>'+
                            '<th style="max-width: 250px">Valoare</th>'+
                            '<th style="max-width: 250px">Link</th>'+
                            '</tr>';
                var CerereClarificare ='<h6> Cerere de clarificare </h6>'+
                            '<table class="table table-hover table-condensed">'+
                            '<tr>'+
                            '<th style="max-width: 250px">Data</th>'+
                            '<th style="max-width: 250px">Ofertant</th>'+
                            '<th style="max-width: 250px">Link</th>'+
                            '</tr>';

                var Clarificari ='<h6> Clarificari </h6>'+
                            '<table class="table table-hover table-condensed">'+
                            '<tr>'+
                            '<th style="max-width: 250px">Data</th>'+
                            '<th style="max-width: 250px">Ofertant</th>'+
                            '<th style="max-width: 250px">Link</th>'+
                            '</tr>';

                var Documente ='<h6> Documente </h6>'+
                            '<table class="table table-hover table-condensed">'+
                            '<tr>'+
                            '<th style="max-width: 250px">Nume</th>'+
                            '<th style="max-width: 250px">Data</th>'+
                            '<th style="max-width: 250px">Autor</th>'+
                            '<th style="max-width: 250px">Link</th>'+
                            '</tr>';

                for (var i = 0; i < data.Result.Rows.length; i++)
                {
                  switch (data.Result.Rows[i].Name) {
                    case "Oferta":
                    Oferta += '<tr>'+
                              '<td style="max-width: 250px;font-size: 13px;">'+moment(data.Result.Rows[i].LastModifiedDate).format("YYYY-MM-DD HH:mm")+'</td>'+
                              '<td style="max-width: 250px;font-size: 13px;">'+data.Result.Rows[i].AgencyName+'</td>'+
                              '<td style="max-width: 250px;font-size: 13px;">'+data.Result.Rows[i].Value+' lei</td>'+
                              '<td style="max-width: 250px;font-size: 13px;"><button class="btn btn-success" onclick="DownloadDocument('+data.Result.Rows[i].ID+','+ProcedureID+');">Download</button></td>'+
                              '</tr>';
                      break;
                    case "Referat de necesitate":
                    Documente += '<tr>'+
                              '<td style="max-width: 250px;font-size: 13px;">'+data.Result.Rows[i].Name+'</td>'+
                              '<td style="max-width: 250px;font-size: 13px;">'+moment(data.Result.Rows[i].LastModifiedDate).format("YYYY-MM-DD HH:mm")+'</td>'+
                              '<td style="max-width: 250px;font-size: 13px;">'+data.Result.Rows[i].AgencyName+'</td>'+
                              '<td style="max-width: 250px;font-size: 13px;"><button class="btn btn-success" onclick="DownloadDocument('+data.Result.Rows[i].ID+','+ProcedureID+');">Download</button></td>'+
                              '</tr>';
                      break;
                    case "Nota de fundamentare":
                    Documente += '<tr>'+
                              '<td style="max-width: 250px;font-size: 13px;">'+data.Result.Rows[i].Name+'</td>'+
                              '<td style="max-width: 250px;font-size: 13px;">'+moment(data.Result.Rows[i].LastModifiedDate).format("YYYY-MM-DD HH:mm")+'</td>'+
                              '<td style="max-width: 250px;font-size: 13px;">'+data.Result.Rows[i].AgencyName+'</td>'+
                              '<td style="max-width: 250px;font-size: 13px;"><button class="btn btn-success" onclick="DownloadDocument('+data.Result.Rows[i].ID+','+ProcedureID+');">Download</button></td>'+
                              '</tr>';
                      break;
                    case "Fisa de date":
                    Documente += '<tr>'+
                              '<td style="max-width: 250px;font-size: 13px;">'+data.Result.Rows[i].Name+'</td>'+
                              '<td style="max-width: 250px;font-size: 13px;">'+moment(data.Result.Rows[i].LastModifiedDate).format("YYYY-MM-DD HH:mm")+'</td>'+
                              '<td style="max-width: 250px;font-size: 13px;">'+data.Result.Rows[i].AgencyName+'</td>'+
                              '<td style="max-width: 250px;font-size: 13px;"><button class="btn btn-success" onclick="DownloadDocument('+data.Result.Rows[i].ID+','+ProcedureID+');">Download</button></td>'+
                              '</tr>';
                      break;
                    case "Cerere de clarificare":
                    CerereClarificare += '<tr>'+
                              '<td style="max-width: 250px;font-size: 13px;">'+moment(data.Result.Rows[i].LastModifiedDate).format("YYYY-MM-DD HH:mm")+'</td>'+
                              '<td style="max-width: 250px;font-size: 13px;">'+data.Result.Rows[i].AgencyName+'</td>'+
                              '<td style="max-width: 250px;font-size: 13px;"><button class="btn btn-success" onclick="DownloadDocument('+data.Result.Rows[i].ID+','+ProcedureID+');">Download</button></td>'+
                              '</tr>';
                      break;

                      case "Clarificare":
                      Clarificari += '<tr>'+
                                '<td style="max-width: 250px;font-size: 13px;">'+moment(data.Result.Rows[i].LastModifiedDate).format("YYYY-MM-DD HH:mm")+'</td>'+
                                '<td style="max-width: 250px;font-size: 13px;">'+data.Result.Rows[i].AgencyName+'</td>'+
                                '<td style="max-width: 250px;font-size: 13px;"><button class="btn btn-success" onclick="DownloadDocument('+data.Result.Rows[i].ID+','+ProcedureID+');">Download</button></td>'+
                                '</tr>';
                        break;
                    default:
                    Documente += '<tr>'+
                              '<td style="max-width: 250px;font-size: 13px;">'+data.Result.Rows[i].Name+'</td>'+
                              '<td style="max-width: 250px;font-size: 13px;">'+moment(data.Result.Rows[i].LastModifiedDate).format("YYYY-MM-DD HH:mm")+'</td>'+
                              '<td style="max-width: 250px;font-size: 13px;">'+data.Result.Rows[i].AgencyName+'</td>'+
                              '<td style="max-width: 250px;font-size: 13px;"><button class="btn btn-success" onclick="DownloadDocument('+data.Result.Rows[i].ID+','+ProcedureID+');">Download</button></td>'+
                              '</tr>';

                  }
                }

                Oferta += '</table>';
                Documente += '</table>';
                CerereClarificare += '</table>';
                Clarificari += '</table>';
                // Beneficiar Ordine = 1 Oferta 2 Cereri clarificari 3 Doc urcate (aparent fara Clarificari (cele urcare de el))
                TabelBeneficiar += Oferta+CerereClarificare+Documente+Clarificari;

                    if(Procedure.ID_Client == req.session.User.ID_Client)
                      {
                        Result += '<div class="tile m-b-10 data-container procedure-item" id="procedure-detail-container" style="display: block;">'+
                        '    <div class="tile-title">'+
                        '    <h5 class="no-margin m-b-10 bold"><span id="detail-name" class="procedure-name">Procedura: ' + Procedure.Name + '</span>'+
                        '<button onclick="getProcedureVariablesData('+Procedure.ID+');" class="btn btn-primary btn-small" style="float: right !important;z-index: 9999 !important;">Editeaza Procedura</button></h5>'+
                        '<br>'+
                        '</div>'+
                        '<div class="tile-body">'+
                        '    <div class="row procedure-details-holder">'+
                        '    <div class="col-md-5">'+
                        '    <p id="detail-description" class="procedure-description">'+
                        '            <strong>Valoare Totala : ' + Procedure.TotalValue + ' Lei</strong><br><br>'+
                        '<strong>Descrierea procedurii: </strong> <br>' + Procedure.Description + '</p>'+
                        '<div id="detail-documents" class="procedure-documents"></div>'+
                        '    </div>'+
                        '    <div class="col-md-6">'+
                        '    <div id="detail-status" style="float: right" class="row">'+

                        '    <div class="row">'+
                        '        <div class="col-md-4">'+
                        '            <h5>Tip procedura</h5> </div>'+
                        '        <div class="col-md-8"> <span rel="@Procedure.ID_ProcedureType" name="FormProcedureID_ProcedureType" class="procedure-type">' + Procedure.ID_ProcedureType.Value_RO + '</span> </div>'+
                        '    </div>'+
                        '    <div class="row">'+
                        '        <div class="col-md-4">'+
                        '            <h5>Locatie</h5> </div>'+
                        '        <div class="col-md-9"> <span rel="@Procedure.Location" name="FormProcedureLocation" class="procedure-location">' + Procedure.Location + '</span> </div>'+
                        '    </div>'+
                        '    <div class="row">'+
                        '        <div class="col-md-12">'+
                        '            <h5>Orar</h5> </div>'+
                        '        <div class="col-md-11 col-md-offset-1">'+
                        '            <!-- <p class="procedure-time">Lansare<span  id="form-detail-launch" class="procedure-launch">~WHEN</span></p> -->'+
                        '            <p class="procedure-time">Clarificari pana la<span rel="@Options.ClarificationRequestsDeadline" name="FormProcedureClarificationRequestsDeadline" class="procedure-clarifications">' + moment (Procedure.ClarificationRequestsDeadline).format ("YYYY-MM-DD HH:mm") + '</span>'+
                        '            </p>'+
                        '            <p class="procedure-time">Termen depunere<span rel="@Options.TendersReceiptDeadline" name="FormProcedureTendersReceiptDeadline" class="procedure-deadline">' + moment (Procedure.TendersReceiptDeadline).format ("YYYY-MM-DD HH:mm") + '</span>'+
                        '            </p>'+
                        '            <p class="procedure-time">Deschidere oferte<span rel="@Options.TendersOpeningDate" name="FormProcedureTendersOpeningDate" class="procedure-open-deadline">' + moment (Procedure.TendersOpeningDate).format ("YYYY-MM-DD HH:mm") + '</span>'+
                        '            </p>'+
                        '        </div>'+
                        '    </div>'+
                        '    <div class="row">'+
                        '        <div class="col-md-12">'+
                        '            <h5>Coduri CPV</h5> <span rel="@Procedure.ClassificationIDs" >'+ Procedure.Classification +'</span> </div>'+
                        '    </div>'+

                        //aici
                        '</div>'+
                        '</div>'+
                        '</div>'+
                        '<div class="clearfix"></div>'+
                        '    <div class="js-clarification-request-container col-md-6 col-xs-12" style="display: none;">'+
                        '    <div class="tile-title">'+
                        '    <h5 class="no-margin m-b-10 bold"><span class="procedure-name">Clarification_request</span></h5>'+
                        '    <br>'+
                        '    </div>'+
                        '    <div class="tile-body">'+
                        '    <input type="file" name="doc" id="js-clarification-file">'+
                        '    <input type="button" class="btn btn-success btn-cons js-clarification-start-upload" value="Submit">'+
                        '    </div>'+
                        '    <div class="clearfix"></div>'+
                        '    </div>'+
                        '    <div class="row procedure-details-holder">'+
                        '   <div class="tile-title">'+
                        '   <h5 class="no-margin m-b-10 bold"><span class="procedure-name">Documente</span></h5>'+
                        '   <br>'+
                        '   </div>'+
                        '   <div class="tile-body">'+
                        TabelBeneficiar+
                        '   </div>'+
                        '   <div class="clearfix"></div>'+
                        '   </div>'+
                        '   <div class="clearfix"></div>'+
                        '</div>'+
                        '</div>';
                      }
                  else
                      {
                        Result += '<div class="tile m-b-10 data-container procedure-item" id="procedure-detail-container" style="display: block;">'+
                        '    <div class="tile-title">'+
                        '    <h5 class="no-margin m-b-10 bold"><span id="detail-name" class="procedure-name">Procedura: ' + Procedure.Name + '</span>'+
                        '<button onclick="getProcedureVariablesData('+Procedure.ID+');" class="btn btn-primary btn-small" style="float: right !important;z-index: 9999 !important;">Editeaza Procedura</button></h5>'+
                        '<br>'+
                        '</div>'+
                        '<div class="tile-body">'+
                        '    <div class="row procedure-details-holder">'+
                        '    <div class="col-md-5">'+
                        '    <p id="detail-description" class="procedure-description">'+
                        '            <strong>Valoare Totala : ' + Procedure.TotalValue + ' Lei</strong><br><br>'+
                        '<strong>Descrierea procedurii: </strong> <br>' + Procedure.Description + '</p>'+
                        '<div id="detail-documents" class="procedure-documents"></div>'+
                        '    </div>'+
                        '    <div class="col-md-6">'+
                        '    <div id="detail-status" style="float: right" class="row">'+

                        '    <div class="row">'+
                        '        <div class="col-md-4">'+
                        '            <h5>Tip procedura</h5> </div>'+
                        '        <div class="col-md-8"> <span rel="@Procedure.ID_ProcedureType" name="FormProcedureID_ProcedureType" class="procedure-type">' + Procedure.ID_ProcedureType.Value_RO + '</span> </div>'+
                        '    </div>'+
                        '    <div class="row">'+
                        '        <div class="col-md-4">'+
                        '            <h5>Locatie</h5> </div>'+
                        '        <div class="col-md-9"> <span rel="@Procedure.Location" name="FormProcedureLocation" class="procedure-location">' + Procedure.Location + '</span> </div>'+
                        '    </div>'+
                        '    <div class="row">'+
                        '        <div class="col-md-12">'+
                        '            <h5>Orar</h5> </div>'+
                        '        <div class="col-md-11 col-md-offset-1">'+
                        '            <!-- <p class="procedure-time">Lansare<span  id="form-detail-launch" class="procedure-launch">~WHEN</span></p> -->'+
                        '            <p class="procedure-time">Clarificari pana la<span rel="@Options.ClarificationRequestsDeadline" name="FormProcedureClarificationRequestsDeadline" class="procedure-clarifications">' + moment (Procedure.ClarificationRequestsDeadline).format ("YYYY-MM-DD HH:mm") + '</span>'+
                        '            </p>'+
                        '            <p class="procedure-time">Termen depunere<span rel="@Options.TendersReceiptDeadline" name="FormProcedureTendersReceiptDeadline" class="procedure-deadline">' + moment (Procedure.TendersReceiptDeadline).format ("YYYY-MM-DD HH:mm") + '</span>'+
                        '            </p>'+
                        '            <p class="procedure-time">Deschidere oferte<span rel="@Options.TendersOpeningDate" name="FormProcedureTendersOpeningDate" class="procedure-open-deadline">' + moment (Procedure.TendersOpeningDate).format ("YYYY-MM-DD HH:mm") + '</span>'+
                        '            </p>'+
                        '        </div>'+
                        '    </div>'+
                        '    <div class="row">'+
                        '        <div class="col-md-12">'+
                        '            <h5>Coduri CPV</h5> <span rel="@Procedure.ClassificationIDs" >'+ Procedure.Classification +'</span> </div>'+
                        '    </div>'+

                        //aici
                        '</div>'+
                        '</div>'+
                        '</div>'+
                        '<div class="clearfix"></div>'+
                        '    <div class="js-clarification-request-container col-md-6 col-xs-12" style="display: none;">'+
                        '    <div class="tile-title">'+
                        '    <h5 class="no-margin m-b-10 bold"><span class="procedure-name">Clarification_request</span></h5>'+
                        '    <br>'+
                        '    </div>'+
                        '    <div class="tile-body">'+
                        '    <input type="file" name="doc" id="js-clarification-file">'+
                        '    <input type="button" class="btn btn-success btn-cons js-clarification-start-upload" value="Submit">'+
                        '    </div>'+
                        '    <div class="clearfix"></div>'+
                        '    </div>'+
                        '    <div class="row procedure-details-holder">'+
                        '   <div class="tile-title">'+
                        '   <h5 class="no-margin m-b-10 bold"><span class="procedure-name">Documente</span></h5>'+
                        '   <br>'+
                        '   </div>'+
                        '   <div class="tile-body">'+
                        '   </div>'+
                        '   <div class="clearfix"></div>'+
                        '   </div>'+
                        '   <div class="clearfix"></div>'+
                        '</div>'+
                        '</div>';
                      }
                      res.send(Result);
                    }
                  // }
                  //   else {
                  //     console.log("invalid prcedure number");
                  //     res.sendStatus(500);
                  //     return false;
                  //   }
              }
          });
    });

    WSrequest.write(reqData);
    WSrequest.end();
    }
