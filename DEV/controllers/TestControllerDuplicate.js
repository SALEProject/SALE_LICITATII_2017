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
