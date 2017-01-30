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


exports.LoginGET = function(req, res, next) {
    // console.log("------------------>"+req.sessionID);

    if (typeof req.session.TextUser != "undefined" || typeof req.session.TextPassword != "undefined") //no errors
    {
        var WSoptions = {
            host: ConfigFile.WebServiceIP,
            path: ConfigFile.WebServiceURLDIR + '/BRMLogin.svc/login',
            port: AppFile.WebServicePORT,
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            }
        };
        var reqData = JSON.stringify({
            "SessionId": req.sessionID,
            "currentState": "login",
            "method": "login",
            "objects": [{
                "Login": {
                    "LoginName": req.session.TextUser,
                    "LoginPassword": req.session.TextPassword,
                    "CertificateFingerprint": "",
                    "Language": req.session.Language,
                    "EntryPoint": "SALE"
                }
            }]
        });

        var WSrequest = http.request(WSoptions, function(WSres) {
            var data = '';
            WSres.on('data', function(chunk) {
                data += chunk;
            });
            WSres.on('end', function() {
              if( ServerCache.testJSON(data) == false)
              {
                console.log(data);
                res.sendStatus(500);
                return false;
              }

              data = JSON.parse(data);
                if (data.Result.Success != true || data == 'undefined') {
                    req.session.destroy();
                    res.redirect('/login');
                } else {
                    // res.io.emit ("socketToMe", "updateAlerts");
                    // console.log ("din sesiune");
                    // data.Result.User.Language = req.session.Language;
                    // res.render ('home', {User: data.Result.User});
                    // data.Result.User.Language = req.body.Language;
                    res.io.emit("socketToMe", "updateAlerts");
                    data.Result.User.Language = req.body.Language;
                    getUserFavProcedures();
                }
            });
        });
        WSrequest.write(reqData);
        WSrequest.end();
    } else {
        res.redirect('/login');
    }


    function getUserFavProcedures() {
        var WSoptions = {
            host: ConfigFile.WebServiceIP,
            path: ConfigFile.WebServiceURLDIR + '/BRMRead.svc/select/Procedures/getFavouriteProcedures',
            port: ConfigFile.WebServicePORT,
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            }
        };
        var reqData = JSON.stringify({
            "SessionId": req.sessionID,
            "currentState": "login",
            "method": "login",
            "objects": [{
                "Arguments": {

                }
            }]
        });

        var WSrequest = http.request(WSoptions, function(WSres) {
            var data = '';
            WSres.on('data', function(chunk) {
                data += chunk;
            });
            WSres.on('end', function() {

                if (ServerCache.testJSON(data) == false) {
                    console.log(data);
                    res.sendStatus(500);
                    return false;
                }

                data = JSON.parse(data);

                if (data.Result == "Security Audit Failed" || data === 'undefined') {
                    console.log("FAILED !!" + data);
                    res.redirect('/logout');
                } else if (data.ErrorCode != 0 || data === 'undefined') {
                    res.sendStatus("ErrorCode: " + data.Result);
                } else {
                    req.session.User["FAVID"] = {};
                    req.session.User["Fav"] = data.Result.Rows;
                    // console.log('what'+data.Result.Rows);

                    for (var i = 0; i < data.Result.Rows.length; i++) {
                        ServerCache.addProcedure(data.Result.Rows[i]);
                        req.session.User["FAVID"][data.Result.Rows[i].ID] = true;
                        // console.log("THIS-> "+JSON.stringify(req.session.User["FAVID"][data.Result.Rows[i].ID]));
                    }


                    res.render('home', {
                        User: req.session.User
                    });
                }

            });

        });

        WSrequest.write(reqData);
        WSrequest.end();
    };

};

exports.LoginPOST = function(req, res, next) {
    var WSoptions = {
        host: ConfigFile.WebServiceIP,
        path: ConfigFile.WebServiceURLDIR + '/BRMLogin.svc/login',
        port: ConfigFile.WebServicePORT,
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        }
    };
    var reqData = JSON.stringify({
        "SessionId": req.sessionID,
        "currentState": "login",
        "method": "login",
        "objects": [{
            "Login": {
                "LoginName": req.body.txtusername,
                "LoginPassword": req.body.txtpassword,
                "CertificateFingerprint": "",
                "Language": req.body.Language,
                "EntryPoint": "SALE"
            }
        }]
    });

    var WSrequest = http.request(WSoptions, function(WSres) {
        var data = '';
        WSres.on('data', function(chunk) {
            data += chunk;
        });
        WSres.on('end', function() {
          if( ServerCache.testJSON(data) == false)
          {
            console.log(data);
            res.sendStatus(500);
            return false;
          }

          data = JSON.parse(data);
            if (data.Result.Success != true || data == 'undefined') {
                // req.session.destroy ();
                // req.session = null;
                // res.redirect ('/login');
            } else {


                // MainServer.EditStore(req.sessionID);
                // var getBySessionID = MainServer.SearchInStore(req.sessionID);
                // console.log(JSON.stringify(getBySessionID));
                // var NewUser = { id: req.session.id, Name : req.body.txtusername, Password: req.body.txtpassword};
                // req.session = NewUser;
                // req.session.Name = req.body.txtusername;
                // req.session.Password = req.body.txtpassword;
                // req.session.Language = req.body.Language;
                // req.session.save();
                req.session.User = data.Result.User;
                // console.log(req.session.User)
                req.session.Language = req.body.Language;
                req.session.User.Language = req.body.Language;
                req.session.TextUser = req.body.txtusername;
                req.session.TextPassword = req.body.txtpassword;
                req.session.save();

                res.io.emit("socketToMe", "updateAlerts");
                data.Result.User.Language = req.body.Language;
                getUserFavProcedures();
            }
        });
    });
    WSrequest.write(reqData);
    WSrequest.end();




    function getUserFavProcedures() {
        var WSoptions = {
            host: ConfigFile.WebServiceIP,
            path: ConfigFile.WebServiceURLDIR + '/BRMRead.svc/select/Procedures/getFavouriteProcedures',
            port: ConfigFile.WebServicePORT,
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            }
        };
        var reqData = JSON.stringify({
            "SessionId": req.sessionID,
            "currentState": "login",
            "method": "login",
            "objects": [{
                "Arguments": {

                }
            }]
        });

        var WSrequest = http.request(WSoptions, function(WSres) {
            var data = '';
            WSres.on('data', function(chunk) {
                data += chunk;
            });
            WSres.on('end', function() {

                if (ServerCache.testJSON(data) == false) {
                    console.log(data);
                    res.sendStatus(500);
                    return false;
                }

                data = JSON.parse(data);

                if (data.Result == "Security Audit Failed" || data === 'undefined') {
                    console.log("FAILED !!" + data);
                    res.redirect('/logout');
                } else if (data.ErrorCode != 0 || data === 'undefined') {
                    res.sendStatus("ErrorCode: " + data.Result);
                } else {
                    req.session.User["FAVID"] = {};
                    req.session.User["Fav"] = data.Result.Rows;
                    // console.log('what'+data.Result.Rows);

                    for (var i = 0; i < data.Result.Rows.length; i++) {
                        ServerCache.addProcedure(data.Result.Rows[i]);
                        req.session.User["FAVID"][data.Result.Rows[i].ID] = true;
                        // console.log("THIS-> "+JSON.stringify(req.session.User["FAVID"][data.Result.Rows[i].ID]));
                    }


                    res.render('home', {
                        User: req.session.User
                    });
                }

            });

        });

        WSrequest.write(reqData);
        WSrequest.end();
    };
};

exports.Logout = function(req, res, next) {
    req.session.destroy();
    req.session = null;
    res.redirect('/login');
};

exports.Register = function(req, res, next) {
    res.send(req.body);
};
