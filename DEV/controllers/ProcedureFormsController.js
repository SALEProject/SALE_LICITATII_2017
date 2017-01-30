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

exports.getForms = function(req, res, next)
  {

    var step = req.body.step;
    var id = req.body.id;
    var timerStart=Date.now();
    var WSoptions =
  {
        host: ConfigFile.WebServiceIP,
        path: ConfigFile.WebServiceURLDIR+"/BRMRead.svc/select/Forms/getFormData",
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
          "objects": 	[
												{
													"Arguments":
													{
														"ID_Procedure": id,
														"Step": step
													}
												}
											]
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
          if( ServerCache.testJSON(data) == false)
          {
            console.log(data);
            res.sendStatus(500);
            return false;
          }

          data = JSON.parse(data);
          // if(typeof data !== 'undefined' && data !== '' && data.Success == true && typeof data.Result !== 'undefined' && data.Result.Success == true && data.Result.Error == '')
          if(data.Success == true && data.ErrorCode == 0)
            {
							function getFormItemData(item) {
								var html = '';

								switch(item.DataType) {
									case 'html':
										switch(item.Type) {
											case 'tag':
												if(item.Html) {
													html += item.Html;
												}
												else {
													for(var i=0; i<item.Items.length; i++) {
														html += getFormItemData(item.Items[i]);
													}
												}
												break;
											case 'paragraph':
												html += '<p style="' + item.Style+ '">';
												if(item.Html) {
													html += item.Html;
												}
												else {
													for(var i=0; i<item.Items.length; i++) {
														html += getFormItemData(item.Items[i]);
													}
												}
												html += '</p>';
												break;
											case 'strong':
												html += '<strong style="' + item.Style+ '">';
												if(item.Html) {
													html += item.Html;
												}
												else {
													for(var i=0; i<item.Items.length; i++) {
														html += getFormItemData(item.Items[i]);
													}
												}
												html += '</strong>';
												break;
											case 'center':
												html += '<center style="' + item.Style+ '">';
												if(item.Html) {
													html += item.Html;
												}
												else {
													for(var i=0; i<item.Items.length; i++) {
														html += getFormItemData(item.Items[i]);
													}
												}
												html += '</center>';
												break;
											case 'numbered_list':
												html += '<ul style="' + item.Style+ '">';
												for(var i=0; i<item.Items.length; i++) {
													html += '<li><span class="list-counter">' + (i+1) + '.</span>' + getFormItemData(item.Items[i]) + '</li>';
												}
												html += '</ul>';
												break;
											case 'unordered_list':
												html += '<ul style="' + item.Style+ '">';
												for(var i=0; i<item.Items.length; i++) {
													html += '<li>' + getFormItemData(item.Items[i]) + '</li>';
												}
												html += '</ul>';
												break;
											case 'table':
												html += '<table>';
												html += '</table>';
												break;
											default:
												html += '<' + item.Type + '>';
												if(item.Html) {
													html += item.Html;
												}
												else {
													for(var i=0; i<item.Items.length; i++) {
														html += getFormItemData(item.Items[i]);
													}
												}
												html += '</' + item.Type + '>';
										}
										break;
									case 'string':
										html += '<span class="form-placeholder placeholder-'+item.Field+'" rel="'+item.Field+'">' + (item.Data ? item.Data : '&nbsp;&nbsp;&nbsp;&nbsp;') + '</span>';
										switch(item.Type) {
											case 'textbox':
												html += '<textarea class="'+item.Field+' form-field" rel="placeholder-'+item.Field+'" data-self="'+item.Field+'" name="' + item.Field + '" ' + (item.Mandatory ? 'required=""' : '') + ' style="' + item.Style+ '">'+item.Data+'</textarea>';
												break;
											case 'textarea':
												html += '<input type="text" id="'+item.Field+' form-field" rel="placeholder-'+item.Field+'" data-self="'+item.Field+'" name="' + item.Field + '" ' + (item.Mandatory ? 'required=""' : '') + ' style="' + item.Style+ '" value="'+item.Data+'" />';
												break;
										}
										break;
									case 'datetime':
										switch(item.Type) {
											case 'textbox':
												html += '<input type="text" id="'+item.Field+'" name="' + item.Field + '" ' + (item.Mandatory ? 'required=""' : '') + ' value="' + item.Data+'" style="' + item.Style+ '" />';
												break;
											case 'calendar':
												html += '<input type=text" class="datepicker" id="'+item.Field+'" name="' + item.Field + '" ' + (item.Mandatory ? 'required=""' : '') + ' value="'+item.Data+'" style="' + item.Style+ '" />';
												break;
										}
										break;
									case 'int':
										switch(item.Type) {
											case 'textbox':
												html += '<input type="text" class="numeric" id="'+item.Field+'" name="' + item.Field + '" ' + (item.Mandatory ? 'required=""' : '') + ' value="' + item.Data+'" style="' + item.Style+ '" />';
												break;
										}
										break;
									case 'float':
										switch(item.Type) {
											case 'textbox':
												html += '<input type="text" class="numeric" id="'+item.Field+'" name="' + item.Field + '" ' + (item.Mandatory ? 'required=""' : '') + ' value="' + item.Data+'" style="' + item.Style+ '" />';
												break;
										}
										break;
									case 'bool':
										switch(item.Type) {
											case 'checkbox':
												html = '<label for="'+item.Field+'" style="' + item.Style+ '"><input type="checkbox" id="'+item.Field+'" name="'+item.Field+'" ' + (item.Mandatory ? 'required=""' : '') + (item.Data ? 'checked=""' : '') + ' />'+item.Html+'</label>';
												break;
										}
										break;
									default:
										switch(item.Type) {
											case 'select':
												try {
													var values = JSON.parse(item.Values);
												}
												catch(err) {
													var values = [];
												}
												var dataValue = '&nbsp;&nbsp;';
												for(var j=0;j<values.length;j++) {
													if(values[j].Key==item.Data)  {
														dataValue = ServerCache.getTranslationLL(values[j].Value,"RO");
													}
												}
												html += '<span class="form-placeholder placeholder-'+item.Field+'" rel="'+item.Field+'">' + dataValue + '</span>';
												html += '<select class="'+item.Field+' form-field" rel="placeholder-'+item.Field+'"  data-self="'+item.Field+'" name="'+item.Field+'" ' + (item.Mandatory ? 'required=""' : '') + ' style="' + item.Style+ '">';
												for(var j=0;j<values.length;j++) {
													html += '<option value="'+values[j].Key+'" ' + (values[j].Key == item.Data ? 'selected=""' : '') + '>' +  ServerCache.getTranslationLL(values[j].Value,"RO") + '</option>';
												}
												html += '</select>';
												break;
											default:
												html = '<div style="' + item.Style+ '">';
												if(item.Items !== null) {
													for(var i=0; i<item.Items.length; i++) {
														html += getFormItemData(item.Items[i]);
													}
												}
												html += '</div>';
										}
								}
								return html;
							}
							res.send(getFormItemData(data.Result));
            }
          else
            {
              console.log("GET FORM DATA ERROR"+JSON.stringify(data));
							res.send("Error in getFormdata");
            }
        });
  });

WSrequest.write(reqData);
WSrequest.end();
};




  //     // function isFloat(n) {
  //     //     return n === +n && n !== (n|0);
  //     // }
  //     function isInteger(n) {
  //     return n === +n && n === (n|0);
  // }
  //
  //       var ProcedureID = parseInt(req.body.ID);
  //       // console.log("that->"+req.body.FormID);
  //       // console.log("this->"+ServerCache.FinalForm["Step"+req.body.FormID]);
  //       var Form = ServerCache.FinalForm["Step"+req.body.FormID];
  //
  //
  //
  //       if(isInteger(ProcedureID) == true)
  //       {
  //       ServerCache.getProcedureVariables(ProcedureID,function (response) {
  //           // var Form = ServerCache.FinalForm["Step"+req.body.FormID];
  //
  //           function replaceAll(str, find, replace) {
  //             return str.replace(new RegExp(find, 'g'), replace);
  //           }
  //
  //           for (var i = 0; i < response.length; i++)
  //             {
  //               var name = response[i].Key;
  //               var value = response[i].Value;
  //               Form = replaceAll(Form,name,value);
  //               Form = replaceAll(Form,"@Procedure.ID",ProcedureID);
  //               Form = Form.split('<BODY LANG="en-US" DIR="LTR">').pop();
  //               Form = replaceAll(Form,'</BODY>','');
  //               Form = replaceAll(Form,'</HTML>','');
  //             };
  //
  //           res.send(Form);
  //           });
  //         }
  //         else {
  //           console.log("invalid ID sent!");
  //           res.send("invalid ID sent!");
  //         }
