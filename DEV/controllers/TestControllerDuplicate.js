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
//ServerCache.getProcedureVariables(4192,function (response) {
// res.send(response) });

exports.test = function(req, res, next)
{
  var Procedure = ServerCache.getProcedurebyID(id)
  var toAppend = "";
  if(Procedure !== null || Procedure !== "")
  {
        toAppend += '<div class="tile m-b-10 data-container procedure-item" id="procedure-detail-container" style="display: block;">'+
        '    <div class="tile-title">'+
        '    <h5 class="no-margin m-b-10 bold"><span id="detail-name" class="procedure-name">' + Procedure.Name + '</span></h5>'+
        '<br>'+
        '</div>'+
        '<div class="tile-body">'+
        '    <div class="row procedure-details-holder">'+
        '    <div class="col-md-5">'+
        '    <p id="detail-description" class="procedure-description">' + Procedure.Description + '</p>'+
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
        '   <input type="file" name="offer_doc" id="js-offer-file">'+
        '   <input type="text" name="offer_price" class="js-offer-input" data-field="Price" placeholder="Pret"><br><br>'+
        '   <input type="text" name="offer_deadline" class="js-offer-input" data-field="Deadline" placeholder="Delivery_deadline"><br><br>'+
        '   <input type="button" class="btn btn-success btn-cons js-offer-start-upload" value="Submit">'+
        '   </div>'+
        '   <div class="clearfix"></div>'+
        '   </div>'+
        '   <div class="clearfix"></div>'+
        '</div>'+
        '</div>';
      res.send( toAppend );
  }
    else {
      res.send("error");
    }
};
//
//   var WSoptions =
//     {
//           host: ConfigFile.WebServiceIP,
//           path: ConfigFile.WebServiceURLDIR+'/BRMRead.svc/select/Procedures/getProcedureVariables',
//           port: ConfigFile.WebServicePORT,
//           method: 'POST',
//           headers:
//             {
//               'Content-Type': 'text/plain'
//             }
//     };
//
//   var reqData = JSON.stringify
//     (
//       {
//         	"SessionId": ConfigFile.WebServiceSessionID,
//         	"currentState": "login",
//         	"method": "execute",
//         	"procedure": "editProcedure",
//         	"service": "/BRMWrite.svc",
//           "objects":
//               	[
//               		{"Arguments":{"ID_Procedure":86}}
//                 ]
//         }
//     );
//
//   var WSrequest = http.request(WSoptions, function(WSres)
//     {
//         var data = '';
//         WSres.on('data', function(chunk)
//           {
//               data += chunk;
//           });
//         WSres.on('end', function()
//           {
//             data = JSON.parse(data);
//
//               if(data.Result == "Security Audit Failed" || data === 'undefined')
//                   {
//                       // res.redirect ('/logout');
//                         console.log("FAILED !!"+JSON.stringify(data));
//                   }
//
//               else if (data.ErrorCode != 0 || data === 'undefined')
//                   {
//                       res.sendStatus("ErrorCode: "+data.Result);
//                   }
//
//             else
//               {
//                   res.send(data.Result.Rows);
//               }
//
//           });
//
//     });
//
//   WSrequest.write(reqData);
//   WSrequest.end();
// }
//EDIT CONTROLLEr

//   res.writeHead(200, {'Content-Type': 'application/force-download','Content-disposition':'attachment; filename=file.txt'});
//   res.end( "123" );
//   res.send( "33333" );
//
//   if (err) {
//     console.error('There was an error', err);
//     return;
//   }
// }
// // //var result = {"Type":"","DataType":"","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"center","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"FISA DE DATE A ACHIZITIEI","Style":"","Data":"","Items":[]}]}]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"SECTIUNEA I: AUTORITATEA CONTRACTANTA","Style":"","Data":"","Items":[]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"I.1) DENUMIRE, ADRESA SI PUNCT(E) DE CONTACT","Style":"","Data":"","Items":[]}]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"Denumire oficiala: ","Style":"","Data":"","Items":[]},{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Organization.Name","Values":"","Html":"","Style":"","Data":"S.C. C.N.T.A.R. TAROM S.A.","Items":[]}]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"Adresa: ","Style":"","Data":"","Items":[]},{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Organization.Address","Values":"","Html":"","Style":"","Data":"Calea Bucurestilor, nr 224F","Items":[]}]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"Localitate: ","Style":"","Data":"","Items":[]},{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Organization.City","Values":"","Html":"","Style":"","Data":"Otopeni","Items":[]}]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"        Cod postal: ","Style":"","Data":"","Items":[]},{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Organization.PostalCode","Values":"","Html":"","Style":"","Data":"050706","Items":[]}]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"        Tara: ","Style":"","Data":"","Items":[]},{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Organization.Country","Values":"","Html":"","Style":"","Data":"Romania","Items":[]}]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"Persoana de contact: ","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"In atentia ","Style":"","Data":"","Items":[]},{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Contact.Name","Values":"","Html":"","Style":"","Data":"Monica Cristescu","Items":[]}]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"        Telefon:","Style":"","Data":"","Items":[]},{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Organization.Phone","Values":"","Html":"","Style":"","Data":"","Items":[]}]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"E-mail: ","Style":"","Data":"","Items":[]},{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Organization.Email","Values":"","Html":"","Style":"","Data":"contact@tarom.ro","Items":[]}]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"        Fax: ","Style":"","Data":"","Items":[]},{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Organization.Fax","Values":"","Html":"","Style":"","Data":"","Items":[]}]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"Adresa de internet: ","Style":"","Data":"","Items":[]},{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Organization.Website","Values":"","Html":"","Style":"","Data":"http://www.tarom.ro/","Items":[]}]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"SECTIUNEA II: OBIECTUL CONTRACTULUI","Style":"","Data":"","Items":[]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"II.1) DESCRIERE","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]}]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"II.1.1) Denumire contract: ","Style":"","Data":"","Items":[]},{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Procedure.Name","Values":"","Html":"","Style":"","Data":"testtee","Items":[]}]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"Valoarea estimata: ","Style":"","Data":"","Items":[]},{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Procedure.TotalValue","Values":"","Html":"","Style":"","Data":"1000.00","Items":[]}]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"II.1.5) Descrierea succinta a contractului sau a achizitiei/achizitiilor: ","Style":"","Data":"","Items":[]},{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Procedure.Description","Values":"","Html":"","Style":"","Data":"testrsdsfgsdfgsdf","Items":[]}]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"Clasificare CPV (vocabularul comun privind achizitiile): ","Style":"","Data":"","Items":[]},{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Procedure.Classification","Values":"","Html":"","Style":"","Data":" 14000000-1","Items":[]}]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[]}]}
//var result = {"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"text-align: right","Data":"","Items":[{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"Aprob,","Style":"","Data":"","Items":[]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"text-align: right","Data":"","Items":[{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"Ordonator Principal de Credite","Style":"","Data":"","Items":[]}]},{"Type":"center","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"NOTA JUSTIFICATIVA","Style":"","Data":"","Items":[]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"privind aprobarea achizitiei","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Procedure.Name","Values":"","Html":"","Style":"","Data":"testtee","Items":[]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[]}]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"Având în vedere:","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"Referatul de necesitate nr.","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Procedure.ID","Values":"","Html":"","Style":"","Data":"4192","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":" din data ","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Procedure.Date","Values":"","Html":"","Style":"","Data":"28.12.2016","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":" al ","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Organization.Name","Values":"","Html":"","Style":"","Data":"S.C. C.N.T.A.R. TAROM S.A.","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":", ","Style":"","Data":"","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"se solicita achizitionarea \" ","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Procedure.Name","Values":"","Html":"","Style":"","Data":"testtee","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":" \" in conformitate cu datele procedurii de achizitie descrise in baza OUG 34/2006 cu modificarile si adaugirile ulterioare:","Style":"","Data":"","Items":[]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"1. Autoritatea Contractanta: ","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Organization.Name","Values":"","Html":"","Style":"","Data":"S.C. C.N.T.A.R. TAROM S.A.","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"2. Denumirea achizitiei: ","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Procedure.Name","Values":"","Html":"","Style":"","Data":"testtee","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"3. Descrierea achizitiei: ","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Procedure.Description","Values":"","Html":"","Style":"","Data":"testrsdsfgsdfgsdf","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"4. Cod de clasificare CPV: ","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Procedure.Classification","Values":"","Html":"","Style":"","Data":" 14000000-1","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"5. Valoarea estimata a achizitiei: ","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Procedure.TotalValue","Values":"","Html":"","Style":"","Data":"1000.00","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"6. Procedura de achizitie propusa: ","Style":"","Data":"","Items":[]},{"Type":"select","DataType":"","Validation":"","isMandatory":false,"Dependency":"","Field":"@Procedure.ID_ProcedureType","Values":"[ {\"Key\": 1, \"Value\": \"fld_ProcedureTypes_Name_1\"}, {\"Key\": 2, \"Value\": \"fld_ProcedureTypes_Name_2\"}, {\"Key\": 3, \"Value\": \"fld_ProcedureTypes_Name_3\"}]","Html":"","Style":"","Data":"1","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"7. Argumentarea achizitiei: ","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Options.Necessity","Values":"","Html":"","Style":"","Data":"11111Bla Bla Bla Bla\r\ndfasdf\r\nzxc\r\nzxc\r\nzxc\r\nasdf\r\nasd\r\nf\r\nasdf\r\n","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"8. Cerintele minime economice pentru operatorul economic: ","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Options.EconomicCapacity","Values":"","Html":"","Style":"","Data":"asdasdasd","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"9. Cerintele minime tehnice pentru operatorul economic: ","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Options.TechnicalCapacity","Values":"","Html":"","Style":"","Data":"asdasdasdasd","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"Propunem:","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"Aprobarea aplicarii procedurii \" ","Style":"","Data":"","Items":[]},{"Type":"select","DataType":"","Validation":"","isMandatory":false,"Dependency":"","Field":"@Procedure.ID_ProcedureType","Values":"[ {\"Key\": 1, \"Value\": \"fld_ProcedureTypes_Name_1\"}, {\"Key\": 2, \"Value\": \"fld_ProcedureTypes_Name_2\"}, {\"Key\": 3, \"Value\": \"fld_ProcedureTypes_Name_3\"}]","Html":"","Style":"","Data":"1","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":" \" conform prevederilor art. 20 din O.U.G. nr. 34/2006 privind atribuirea contractelor de achizitie publica, a contractelor de concesiune de lucrari publice si a contractelor de concesiune de servicii.","Style":"","Data":"","Items":[{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]}]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"text-align: right","Data":"","Items":[{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"Intocmit,","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Contact.Name","Values":"","Html":"","Style":"","Data":"Monica Cristescu","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]}]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","H  ms]};
//var result = {"Type":"","DataType":"","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"text-align: right","Data":"","Items":[{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"Aprob,","Style":"","Data":"","Items":[]}]},{"Type":"center","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"Referat de necesitate","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"nr. ","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Procedure.ID","Values":"","Html":"","Style":"","Data":"4192","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":" din ","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Procedure.Date","Values":"","Html":"","Style":"","Data":"28.12.2016","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"pentru achizitionarea","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Procedure.Name","Values":"","Html":"","Style":"","Data":"testtee","Items":[]}]}]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"Subsemnatul ","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Contact.Name","Values":"","Html":"","Style":"","Data":"Monica Cristescu","Items":[]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"1. Informatii generale:","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]}]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"1.1. Autoritatea Contractanta: ","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Organization.Name","Values":"","Html":"","Style":"","Data":"S.C. C.N.T.A.R. TAROM S.A.","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"1.2. Descrierea produselor/serviciilor/lucrarilor: ","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Procedure.Description","Values":"","Html":"","Style":"","Data":"testrsdsfgsdfgsdf","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"1.3. Cod de clasificare CPV: ","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Procedure.Classification","Values":"","Html":"","Style":"","Data":" 14000000-1","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"1.4. Valoarea estimata a achizitiei: ","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Procedure.TotalValue","Values":"","Html":"","Style":"","Data":"1000.00","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"1.5. Procedura de achizitie propusa: ","Style":"","Data":"","Items":[]},{"Type":"select","DataType":"","Validation":"","isMandatory":false,"Dependency":"","Field":"@Procedure.ID_ProcedureType","Values":"[ {\"Key\": 1, \"Value\": \"fld_ProcedureTypes_Name_1\"}, {\"Key\": 2, \"Value\": \"fld_ProcedureTypes_Name_2\"}, {\"Key\": 3, \"Value\": \"fld_ProcedureTypes_Name_3\"}]","Html":"","Style":"","Data":"1","Items":[]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"2. Argumentarea necesitatii:","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]}]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Options.Necessity","Values":"","Html":"","Style":"","Data":"11111Bla Bla Bla Bla\r\ndfasdf\r\nzxc\r\nzxc\r\nzxc\r\nasdf\r\nasd\r\nf\r\nasdf\r\n","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"3. Cerintele minime pentru operatorul economic:","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]}]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"3.1. Cerintele minime economice: ","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Options.EconomicCapacity","Values":"","Html":"","Style":"","Data":"asdasdasd","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"3.2. Cerintele minime tehnice: ","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Options.TechnicalCapacity","Values":"","Html":"","Style":"","Data":"asdasdasdasd","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]}]},{"Type":"paragraph","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"text-align: right","Data":"","Items":[{"Type":"strong","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"","Style":"","Data":"","Items":[{"Type":"span","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"Intocmit,","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"textbox","DataType":"string","Validation":"","isMandatory":false,"Dependency":"","Field":"@Contact.Name","Values":"","Html":"","Style":"","Data":"Monica Cristescu","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]},{"Type":"tag","DataType":"html","Validation":"","isMandatory":false,"Dependency":"","Field":"","Values":"","Html":"\u003cbr/\u003e","Style":"","Data":"","Items":[]}]}]}]};
//



// var step = req.body.step;
// var id = req.body.id;
//
//     var timerStart=Date.now();
//     var WSoptions =
//   {
//         host: ConfigFile.WebServiceIP,
//         path: ConfigFile.WebServiceURLDIR+"/BRMRead.svc/select/Forms/getFormData",
//         port: ConfigFile.WebServicePORT,
//         method: 'POST',
//         headers:
//           {
//             'Content-Type': 'text/plain'
//           }
//   };
//
// var reqData =JSON.stringify(
//     {
//           "SessionId": ConfigFile.WebServiceSessionID,
//           "currentState": 'login',
//           "objects": 	[
// 												{
// 													"Arguments":
// 													{
// 														"ID_Procedure": 4192,
// 														"Step": 2
// 													}
// 												}
// 											]
//       }
//     );
//
//
// WSrequest = http.request(WSoptions, function(WSres)
//   {
//       var data = '';
//       WSres.on('data', function(chunk)
//         {
//             data += chunk;
//         });
//       WSres.on('end', function()
//         {
//           data = JSON.parse(data);
//           // if(typeof data !== 'undefined' && data !== '' && data.Success == true && typeof data.Result !== 'undefined' && data.Result.Success == true && data.Result.Error == '')
//           if(data.Success == true && data.ErrorCode == 0)
//             {
// 							function getFormItemData(item) {
// 								var html = '';
//
// 								switch(item.DataType) {
// 									case 'html':
// 										switch(item.Type) {
// 											case 'tag':
// 												if(item.Html) {
// 													html += item.Html;
// 												}
// 												else {
// 													for(var i=0; i<item.Items.length; i++) {
// 														html += getFormItemData(item.Items[i]);
// 													}
// 												}
// 												break;
// 											case 'paragraph':
// 												html += '<p style="' + item.Style+ '">';
// 												if(item.Html) {
// 													html += item.Html;
// 												}
// 												else {
// 													for(var i=0; i<item.Items.length; i++) {
// 														html += getFormItemData(item.Items[i]);
// 													}
// 												}
// 												html += '</p>';
// 												break;
// 											case 'strong':
// 												html += '<strong style="' + item.Style+ '">';
// 												if(item.Html) {
// 													html += item.Html;
// 												}
// 												else {
// 													for(var i=0; i<item.Items.length; i++) {
// 														html += getFormItemData(item.Items[i]);
// 													}
// 												}
// 												html += '</strong>';
// 												break;
// 											case 'center':
// 												html += '<center style="' + item.Style+ '">';
// 												if(item.Html) {
// 													html += item.Html;
// 												}
// 												else {
// 													for(var i=0; i<item.Items.length; i++) {
// 														html += getFormItemData(item.Items[i]);
// 													}
// 												}
// 												html += '</center>';
// 												break;
// 											case 'numbered_list':
// 												html += '<ul style="' + item.Style+ '">';
// 												for(var i=0; i<item.Items.length; i++) {
// 													html += '<li><span class="list-counter">' + (i+1) + '.</span>' + getFormItemData(item.Items[i]) + '</li>';
// 												}
// 												html += '</ul>';
// 												break;
// 											case 'unordered_list':
// 												html += '<ul style="' + item.Style+ '">';
// 												for(var i=0; i<item.Items.length; i++) {
// 													html += '<li>' + getFormItemData(item.Items[i]) + '</li>';
// 												}
// 												html += '</ul>';
// 												break;
// 											case 'table':
// 												html += '<table>';
// 												html += '</table>';
// 												break;
// 											default:
// 												html += '<' + item.Type + '>';
// 												if(item.Html) {
// 													html += item.Html;
// 												}
// 												else {
// 													for(var i=0; i<item.Items.length; i++) {
// 														html += getFormItemData(item.Items[i]);
// 													}
// 												}
// 												html += '</' + item.Type + '>';
// 										}
// 										break;
// 									case 'string':
// 										html += '<span class="form-placeholder placeholder-'+item.Field+'" rel="'+item.Field+'">' + (item.Data ? item.Data : '&nbsp;&nbsp;&nbsp;&nbsp;') + '</span>';
// 										switch(item.Type) {
// 											case 'textbox':
// 												html += '<textarea class="'+item.Field+' form-field" rel="placeholder-'+item.Field+'" data-self="'+item.Field+'" name="' + item.Field + '" ' + (item.Mandatory ? 'required=""' : '') + ' style="' + item.Style+ '">'+item.Data+'</textarea>';
// 												break;
// 											case 'textarea':
// 												html += '<input type="text" id="'+item.Field+' form-field" rel="placeholder-'+item.Field+'" data-self="'+item.Field+'" name="' + item.Field + '" ' + (item.Mandatory ? 'required=""' : '') + ' style="' + item.Style+ '" value="'+item.Data+'" />';
// 												break;
// 										}
// 										break;
// 									case 'datetime':
// 										switch(item.Type) {
// 											case 'textbox':
// 												html += '<input type="text" id="'+item.Field+'" name="' + item.Field + '" ' + (item.Mandatory ? 'required=""' : '') + ' value="' + item.Data+'" style="' + item.Style+ '" />';
// 												break;
// 											case 'calendar':
// 												html += '<input type=text" class="datepicker" id="'+item.Field+'" name="' + item.Field + '" ' + (item.Mandatory ? 'required=""' : '') + ' value="'+item.Data+'" style="' + item.Style+ '" />';
// 												break;
// 										}
// 										break;
// 									case 'int':
// 										switch(item.Type) {
// 											case 'textbox':
// 												html += '<input type="text" class="numeric" id="'+item.Field+'" name="' + item.Field + '" ' + (item.Mandatory ? 'required=""' : '') + ' value="' + item.Data+'" style="' + item.Style+ '" />';
// 												break;
// 										}
// 										break;
// 									case 'float':
// 										switch(item.Type) {
// 											case 'textbox':
// 												html += '<input type="text" class="numeric" id="'+item.Field+'" name="' + item.Field + '" ' + (item.Mandatory ? 'required=""' : '') + ' value="' + item.Data+'" style="' + item.Style+ '" />';
// 												break;
// 										}
// 										break;
// 									case 'bool':
// 										switch(item.Type) {
// 											case 'checkbox':
// 												html = '<label for="'+item.Field+'" style="' + item.Style+ '"><input type="checkbox" id="'+item.Field+'" name="'+item.Field+'" ' + (item.Mandatory ? 'required=""' : '') + (item.Data ? 'checked=""' : '') + ' />'+item.Html+'</label>';
// 												break;
// 										}
// 										break;
// 									default:
// 										switch(item.Type) {
// 											case 'select':
// 												try {
// 													var values = JSON.parse(item.Values);
// 												}
// 												catch(err) {
// 													var values = [];
// 												}
// 												var dataValue = '&nbsp;&nbsp;';
// 												for(var j=0;j<values.length;j++) {
// 													if(values[j].Key==item.Data)  {
// 														dataValue = "getTranslation(values[j].Value)";
// 													}
// 												}
// 												html += '<span class="form-placeholder placeholder-'+item.Field+'" rel="'+item.Field+'">' + dataValue + '</span>';
// 												html += '<select class="'+item.Field+' form-field" rel="placeholder-'+item.Field+'"  data-self="'+item.Field+'" name="'+item.Field+'" ' + (item.Mandatory ? 'required=""' : '') + ' style="' + item.Style+ '">';
// 												for(var j=0;j<values.length;j++) {
// 													html += '<option value="'+values[j].Key+'" ' + (values[j].Key == item.Data ? 'selected=""' : '') + '>' + "getTranslation(values[j].Value)" + '</option>';
// 												}
// 												html += '</select>';
// 												break;
// 											default:
// 												html = '<div style="' + item.Style+ '">';
// 												if(item.Items !== null) {
// 													for(var i=0; i<item.Items.length; i++) {
// 														html += getFormItemData(item.Items[i]);
// 													}
// 												}
// 												html += '</div>';
// 										}
// 								}
// 								return html;
// 							}
// 							res.send(getFormItemData(data.Result));
//             }
//           else
//             {
//               console.log("GET FORM DATA ERROR"+JSON.stringify(data));
// 							res.send("Error in getFormdata");
//             }
//         });
//   });
//
// WSrequest.write(reqData);
// WSrequest.end();
// };
