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

exports.getProcedureParams = function(req, res, next) {
  console.log(req.body);
  // var Value = req.body.Value;
  var FloatValue = parseFloat(req.body.Value);
  var Result = "";

  for (var i = 0; i < ServerCache["ID_ProcedureTypesFIXED"].length; i++) {
  var FloatTreshold = parseFloat(ServerCache["ID_ProcedureTypesFIXED"][i]["ValueThreshold"]);
    if( FloatTreshold < FloatValue)
      {
        Result = ServerCache["ID_ProcedureTypesFIXED"][i];
        console.log('FloatValue '+FloatValue+' is bigger than :'+ ServerCache["ID_ProcedureTypesFIXED"][i]["ValueThreshold"]+' > '+ServerCache["ID_ProcedureType"][i].Value_RO);
      }
      else {
        console.log('FloatValue '+FloatValue+' IS NOT bigger than :'+ ServerCache["ID_ProcedureTypesFIXED"][i]["ValueThreshold"]);
      }
  }
        console.log('FINAL RESULT '+Result);
        if(typeof Result !== "undefined" || Result !== "")
        {
          var delta1 = parseInt(Result['ClarificationRequestsOffset']);
          var delta2 = parseInt(Result['TendersReceiptOffset']);
          var t1 = moment(ServerCache.ServerTime).add(delta1, 'days').format();
          var t2 = moment(ServerCache.ServerTime).add(delta2, 'days').format();
          // var t1 = moment().add(delta1, 'days').format();
          // var t2 = moment().add(delta2, 'days').format();
          var t3 = moment(t2).add(1, 'days').format();
          var FinalResult = {"valID":Result['ID'],"T1":t1,"T2":t2,"T3":t3};
          res.send(JSON.stringify(FinalResult));
        }
        else {
          res.sendStatus(500);
        }
}
