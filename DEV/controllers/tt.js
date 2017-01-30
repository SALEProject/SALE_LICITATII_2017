{
var UserID = 161;
var ProcedureID = 4169;

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
            //ALL OK
            var Result = '';
            var Oferta ='<h3> Oferte </h3>'+
                        '<table class="table"'+
                        '<tr>'+
                        '<th>Data</th>'+
                        '<th>Ofertant</th>'+
                        '<th>Valoare</th>'+
                        '<th>Link</th>'+
                        '</tr>';
            for (var i = 0; i < data.Result.Rows.length; i++) {
              if(data.Result.Rows[i].ID_Procedure == ProcedureID && data.Result.Rows[i].ID_CLient == UserID){
                  //Get offers
                  if( data.Result.Rows[i].Name == "Oferta" && Number.isInteger(data.Result.Rows[i].Value))
                  {
                    Oferta += '<tr>'+
                              '<td>'+moment(data.Result.Rows[i].LastModifiedDate).format("YYYY-MM-DD HH:mm")+'</td>'+
                              '<td>'+data.Result.Rows[i].AgencyName+'</td>'+
                              '<td>'+data.Result.Rows[i].Value+' lei</td>'+
                              '<td><button class="btn btn-success" onclick="DownloadDocument('+data.Result.Rows[i].ID+','+ProcedureID+');">Download</button></td>'+
                              '</tr>';
                  }
              }
            }
            Oferta += '</table>';
            var Procedure = ServerCache.getProcedurebyID(ProcedureID);
            if(Procedure !== null || Procedure !== "")
            {
                if(Procedure.ID_Client == req.session.User.ID_Client)
                  {
                                        Result += '<div class="tile m-b-10 data-container procedure-item" id="procedure-detail-container" style="display: block;">'+
                                        '    <div class="tile-title">'+
                                        '    <h5 class="no-margin m-b-10 bold"><span id="detail-name" class="procedure-name">Procedura: ' + Procedure.Name + '</span></h5>'+
                                        '<button onclick="getProcedureVariablesData('+Procedure.ID+');" class="btn btn-primary btn-small" style="float: right !important;z-index: 9999 !important;">Editeaza Procedura</button>'+
                                        '<br>'+
                                        '</div>'+
                                        '<div class="tile-body">'+
                                        '    <div class="row procedure-details-holder">'+
                                        '    <div class="col-md-5">'+
                                        '    <p id="detail-description" class="procedure-description"><strong>Descrierea procedurii: </strong> <br>' + Procedure.Description + '</p>'+
                                        '<div id="detail-documents" class="procedure-documents"></div>'+
                                        '    </div>'+
                                        '    <div class="col-md-6">'+
                                        '    <div id="detail-status" class="row">'+
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
                                        '    <div class="js-offer-container col-md-6 col-xs-12">'+
                                        '   <div class="tile-title">'+
                                        '   <h5 class="no-margin m-b-10 bold"><span class="procedure-name">Offer</span></h5>'+
                                        '   <br>'+
                                        '   </div>'+
                                        '   <div class="tile-body">'+
                                        Oferta+
                                        '   </div>'+
                                        '   <div class="clearfix"></div>'+
                                        '   </div>'+
                                        '   <div class="clearfix"></div>'+
                                        '</div>'+
                                        '</div>';
                  }
                }
            res.send(Result);
          }
      });
});

WSrequest.write(reqData);
WSrequest.end();
}
