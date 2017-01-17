var express = require('express');
var http = require('http');
var app = express();
var AppFile = require('../app.js');
var ConfigFile = require('../config.js');
var ServerCache = {};
var _ = require('underscore')._;
var moment = require('moment');


module.exports =
{
  ServerCache
}



var StartCache = setInterval(function()
{
  if(ConfigFile.WebServiceReady == true)
  {
      console.log("Caching ... "+Date());
      for (element in Requests)
        {
          ServerCache[Requests[element].variableName] = "";
          RequestEngine(Requests[element].variableName,Requests[element].path,Requests[element].objects,Requests[element].loginconsole);
        }
        clearInterval(StartCache);
  }
}, 1000);

var ProcessProcedures = function()
{
  var CacheProcessList =
  {
    "ID_ContractType": {},
    "ID_ProcedureType": {},
    "ID_ProcedureCriterion": {},
  }
    console.log("");
    console.log("Processing Procedures");
    AddTimestamp();
    clearCache();
      for (element in CacheProcessList)
    {
      TranslateLabel(element);
      ReplaceLabel(element);
    }
    setInterval(function()
      {
         RequestEngine("ServerTime","/BRMRead.svc/servertime",false);
      }, ConfigFile.NodeCacheServerTimeUpdate);

      ProcessForms();
};


var ProcessForms =  function()
{
  console.log("FORMS !!")
  ServerCache["FinalForm"] = {};
  for (var i = 0; i < ServerCache.Forms.length; i++)
  {
      var Step  = "Step"+ServerCache.Forms[i].Step;
      console.log(Step);
      var Code = ServerCache.Forms[i].Template;
      Code = Buffer.from(Code, 'base64').toString('utf8');
      ServerCache.FinalForm[Step] = Code;
  }
  ServerCache["Ready"] = true;
}

var Requests =
{
"ServerTime": {
                variableName:"ServerTime",
                path:"/BRMRead.svc/servertime",
                objects: [],
                loginconsole:false
              },
"Procedures": {
                variableName:"Procedures",
                path:"/BRMRead.svc/select/Procedures/getProcedures",
                objects: [],
                loginconsole:false
              },
"Chat":       {
                variableName:"Chat",
                path:"/BRMRead.svc/select/Messages/getChatHistory",
                objects: [{"Arguments":{"Since": moment(0, "HH")}}],
                loginconsole:false,
              },
"CPVCodes":   {
                variableName:"CPVCodes",
                path:"/BRMRead.svc/select/Nomenclators/getCPVS",
                objects: [],
                loginconsole:false
              },
"Translations":   {
                variableName:"Translations",
                path:"/BRMRead.svc/select/Nomenclators/getTranslations",
                objects: [],
                loginconsole:false
              },

"ID_ProcedureType":   {
                variableName:"ID_ProcedureType",
                path:"/BRMRead.svc/select/Nomenclators/getProcedureTypes",
                objects: [],
                loginconsole:false
              },
"ID_ProcedureCriterion":   {
                variableName:"ID_ProcedureCriterion",
                path:"/BRMRead.svc/select/Nomenclators/getProcedureCriteria",
                objects: [],
                loginconsole:false
              },
"ProcedureLegislations":   {
                variableName:"ProcedureLegislations",
                path:"/BRMRead.svc/select/Nomenclators/getProcedureLegislations",
                objects: [],
                loginconsole:false
              },
"MeasuringUnits":   {
                variableName:"MeasuringUnits",
                path:"/BRMRead.svc/select/Nomenclators/getMeasuringUnits",
                objects: [],
                loginconsole:false
              },
"ID_ContractType": {
                variableName:"ID_ContractType",
                path:"/BRMRead.svc/select/Nomenclators/getContractTypes",
                objects: [],
                loginconsole:false
              },
"Alerts":     {
                variableName:"Alerts",
                path:"/BRMRead.svc/select/Alerts/getAlerts",
                objects: [{"Arguments":{"Since": moment(0, "HH")}}],
                loginconsole:false
              },
"Forms":     {
                variableName:"Forms",
                path:"/BRMRead.svc/select/Forms/getForms",
                objects: [],
                loginconsole:false
              },
"ID_ProcedureTypesFIXED": {
            variableName:"ID_ProcedureTypesFIXED",
            path:"/BRMRead.svc/select/Nomenclators/getProcedureTypes",
            objects: [],
            loginconsole:false
          },


};

var Step = 0;
var TotalSteps = Object.keys(Requests).length;


function RequestEngine(name,url,objects,log)
{

    var timerStart=Date.now();
    var WSoptions =
  {
        host: ConfigFile.WebServiceIP,
        path: ConfigFile.WebServiceURLDIR+url,
        port: ConfigFile.WebServicePORT,
        method: 'POST',
        headers:
          {
            'Content-Type': 'text/plain'
          }
  };

var reqData =JSON.stringify(
    {
          "SessionId": ConfigFile.WebServiceSessionID,
          "currentState": 'login',
          objects,
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
            if (data.ErrorCode != 0 || data === 'undefined' || data.Result == "Security Audit Failed")
                {
                    console.log("");
                    console.log("FAILED ErrorCode !!!!!!! "+name+" "+data.ErrorCode+" "+data.Result);
                    console.log("");
                }
            else
                {
                  var timerEnd= Date.now();
                  var timeSpent=(timerEnd-timerStart)/1000+" sec";
                  if (typeof data.Result.Rows !== 'undefined')
                      {
                        ServerCache[name] = data.Result.Rows;
                        if(ServerCache.Complete == true)
                            {
                              console.log("Requested Event "+name+" -> "+data.Result);
                              return false;
                            }
                        else
                            {
                              Step++;
                              console.log(Step+"/"+TotalSteps+" "+timeSpent+" "+name+" -> "+ServerCache[name].length+" items.");
                            }
                      }
                    else
                        {
                          ServerCache[name] = data.Result;
                          if(ServerCache.Complete == true)
                                {
                                  console.log("Requested Event "+name+" -> "+data.Result);
                                  return false;
                                }
                          else
                                {
                                  Step++;
                                  console.log(Step+"/"+TotalSteps+" "+timeSpent+" "+name+" -> "+ServerCache[name]+".");
                                }
                        }
                    if (log === true)
                        {
                          console.log(ServerCache[name]);
                        }
                    if (Step == TotalSteps)
                        {
                          ServerCache["Complete"] = true;
                          ProcessProcedures();
                        }
                }
        });
  });

WSrequest.write(reqData);
WSrequest.end();
};

function AddTimestamp()
{
  for (var i = 0, len = ServerCache.Procedures.length; i < len; i++)
  {
    var TimeStamp = new Date().getTime();
    ServerCache.Procedures[i]["TimeStamp"] = TimeStamp;
  }
  console.log("* TimeStamp added!");
}

function clearCache()
{
  if ( ServerCache.Procedures.length > ConfigFile.NodeCacheMaxProcedures )
  {
    var TMPProcedures = _.sortBy(ServerCache.Procedures, function(o) { return o.TimeStamp; })
    // ServerCache.Procedures = TMPProcedures.reverse();
    ServerCache.Procedures = TMPProcedures;
    var DiscardAmmount = (ServerCache.Procedures.length-ConfigFile.NodeCacheMaxProcedures);
    for (var x = 0, len = DiscardAmmount; x < len; x++)ServerCache.Procedures.pop();
    console.log("* Cache Discard Complete -> "+ServerCache.Procedures.length+" procedures left.");
  }
}


//Translations FindTranslations and replace
function TranslationsEngine(searchFor)
{
  for (var i = 0, len = ServerCache.Translations.length; i< len; i++)
        {
          if (ServerCache.Translations[i].Label == searchFor)
            {
                return ServerCache.Translations[i];
            }
        }
    console.log("Error at TranslationsEngineFunction: "+searchFor+" not found!");
}


function TranslateLabel(element)
  {
    for (var i = 0; i < ServerCache[element].length; i++)
      {
        var value = ServerCache[element][i].Name;
        ServerCache[element][i] = TranslationsEngine(value);
      }
        console.log("* Translated "+element);
  };





function ReplaceLabel(element)
  {
    for (var i = 0; i < ServerCache.Procedures.length; i++)
    {
      var value = ServerCache.Procedures[i][element];
      value--;
      if(typeof ServerCache[element][value] == 'undefined')
        {
          console.log("");
          console.log("ERROR -> Procedure "+ServerCache.Procedures[i].Name+" with ID "+ServerCache.Procedures[i].ID+" has property "+element+" with the invalid value of "+(value+1)+"!");
          console.log("");
          ServerCache.Procedures[i][element] = { "Value_RO" : "Error", "Value_EN" : "Error"};
        }
      else
        {
          ServerCache.Procedures[i][element] = ServerCache[element][value];
        }
    }
  }

ServerCache.updateCacheChat = function ()
{
  var len = ServerCache.Chat.length;
  if(ServerCache.Chat[len-1] == "undefined")
  {
    var RequestUpdate =
    {
      variableName:"Chat",
      path:"/BRMRead.svc/select/Messages/getChatHistory",
      objects: [{"Arguments":{"Since": ServerCache.Chat[len-1].Date}}],
      loginconsole:false,
    }
  }
  else
  {
    var RequestUpdate =
    {
      variableName:"Chat",
      path:"/BRMRead.svc/select/Messages/getChatHistory",
      objects: [{}],
      loginconsole:false,
    }



   UpdateEngine(RequestUpdate.variableName,RequestUpdate.path,RequestUpdate.objects,RequestUpdate.loginconsole);
   return true;
}
}




function UpdateEngine(name,url,objects,log)
{

    var timerStart=Date.now();
    var WSoptions =
  {
        host: ConfigFile.WebServiceIP,
        path: ConfigFile.WebServiceURLDIR+url,
        port: ConfigFile.WebServicePORT,
        method: 'POST',
        headers:
          {
            'Content-Type': 'text/plain'
          }
  };

var reqData =JSON.stringify(
    {
          "SessionId": ConfigFile.WebServiceSessionID,
          "currentState": 'login',
          objects,
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
            if (data.ErrorCode != 0 || data === 'undefined' || data.Result == "Security Audit Failed")
                {
                    console.log("");
                    console.log("FAILED ErrorCode !!!!!!! "+name+" "+data.ErrorCode+" "+data.Result);
                    console.log("");
                }
            else
                {
                  var timerEnd= Date.now();
                  var timeSpent=(timerEnd-timerStart)/1000+" sec";
                  if (typeof data.Result.Rows !== 'undefined')
                      {
                        if(name == "Procedures")
                          {
                            ServerCache.processProcedure(data.Result.Rows[0]);
                            SortALLProcedures();
                            console.log("Processed and added "+JSON.stringify(data.Result.Rows[0]));
                          }
                        else
                          {
                            ServerCache[name].push(data.Result.Rows);
                            SortALLProcedures();
                            console.log("added 1111"+JSON.stringify(data.Result.Rows));
                          }

                      }
                    else
                      {
                        if(name == "Procedures")
                        {
                          ServerCache.processProcedure(data.Result);
                          SortALLProcedures();
                          console.log("Processed and added "+JSON.stringify(data.Result));

                        }
                        else {
                          ServerCache[name].push(data.Result);
                          SortALLProcedures();
                          console.log("added 222"+JSON.stringify(data.Result));
                        }

                      }
                    if (log === true)
                        {
                          console.log(ServerCache[name]);
                        }
                }
        });
  });

WSrequest.write(reqData);
WSrequest.end();
};


ServerCache.addProcedure = function (item)
{
  if(ServerCache.getProcedurebyID(item.ID) == null)
    {
        ServerCache.processProcedure(item);
    }
}

ServerCache.getProcedurebyID = function (id)
{
  var result = null;
  var len = ServerCache.Procedures.length;
  for (var i = 0; i < len; i++)
  {
    if(ServerCache.Procedures[i].ID == id )
    result = ServerCache.Procedures[i];
  }
  return result
}


ServerCache.replaceProcedure = function (id)
{
  var result = null;
  var len = ServerCache.Procedures.length;
  for (var i = 0; i < len; i++)
  {
    if(ServerCache.Procedures[i].ID == id )
      {
          ServerCache.Procedures.splice(i, 1);
          ServerCache.requestProcedure(id);
          return true;
      }
  }
}

ServerCache.deleteProcedure = function (id)
{
  var result = null;
  var len = ServerCache.Procedures.length;
  for (var i = 0; i < len; i++)
  {
    if(ServerCache.Procedures[i].ID == id )
      {
          ServerCache.Procedures.splice(i, 1);
          return true;
      }
  }
}

ServerCache.processProcedure = function (item)
{
  //Replace and Verify What
  var List =
  {
    "ID_ContractType": {},
    "ID_ProcedureType": {},
    "ID_ProcedureCriterion": {},
  }
  // console.log("PROCESSING - > in "+item);
  for (element in List)
{
  var value = item[element];
  value--;
  if(typeof ServerCache[element][value] == 'undefined')
    {
      console.log("");
      console.log("ERROR adding element -> Procedure "+item.Name+" with ID "+item.Name.ID+" has property "+element+" with the invalid value of "+(value+1)+"!");
      console.log("");
    }
  else
    {
      item[element] = ServerCache[element][value];
    }
  }
    ServerCache.Procedures.push(item);
    console.log(item.Name+ " added to Procedures");
}

ServerCache.requestProcedure = function (id)
{

  var RequestUpdate =
  {
    variableName:"Procedures",
    path:"/BRMRead.svc/select/Procedures/getProcedures",
    objects: [{"Arguments":{"ID_Procedure":id}}],
    loginconsole:false
  }


 UpdateEngine(RequestUpdate.variableName,RequestUpdate.path,RequestUpdate.objects,RequestUpdate.loginconsole);
}



function SortALLProcedures(how)
{
    var TMPProcedures = _.sortBy(ServerCache.Procedures, function(o) { return o.Date; })
    if(how !== "asc") TMPProcedures = TMPProcedures.reverse();
    ServerCache.Procedures = TMPProcedures;
}



ServerCache.getProcedureVariables = function (id,callback)
{
       var timerStart=Date.now();
       var WSoptions =
     {
           host: ConfigFile.WebServiceIP,
           path: ConfigFile.WebServiceURLDIR+"/BRMRead.svc/select/Procedures/getProcedureVariables",
           port: ConfigFile.WebServicePORT,
           method: 'POST',
           headers:
             {
               'Content-Type': 'text/plain'
             }
     };

   var reqData =JSON.stringify(
       {
             "SessionId": ConfigFile.WebServiceSessionID,
             "currentState": 'login',
             "objects": [{"Arguments":{"ID_Procedure":id}}]
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
            //  if(typeof data !== 'undefined' && data !== '' && data.Success !== true && typeof data.Result !== 'undefined' && data.Result.Success == true && data.Result.Error == '')
             if (data.ErrorCode != 0 || data != 'undefined' || data.Result != "Security Audit Failed")
               {

                //  return JSON.stringify(data.Result.Rows);
                 callback(data.Result.Rows, 'err');
               }
             else
               {
                 console.log("getProcedureVariables Error "+JSON.stringify(data));
               }
           });
     });

   WSrequest.write(reqData);
   WSrequest.end();
   };


ServerCache.getTranslationLL = function (searchFor,lang)
{
    for (var i = 0, len = ServerCache.Translations.length; i< len; i++)
          {
            if (ServerCache.Translations[i].Label == searchFor)
              {
                  return ServerCache.Translations[i]["Value_"+lang];
              }
          }
      console.log("Error at TranslationsEngineFunction: "+searchFor+" not found!");
}
