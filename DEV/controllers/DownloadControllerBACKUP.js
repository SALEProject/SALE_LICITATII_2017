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

exports.DownloadForm = function(req, res, next)
{

'use strict';

var fileName = "/files/requested.doc";
var fileContent = req.body.Contents;
console.log("fileContent "+ fileContent );
console.log("req.body.data "+ req.body.Contents );

fileContent = "<html> <body>"+fileContent+"</body> </html>";

const
    fs = require('fs'),
    process = require('process');

writeFile(fileName, fileContent).then((successMsg) => {
    console.log(successMsg);
    res.send(200);
}, (errMsg) => {
    console.log(errMsg);
});

function writeFile(fileName, fileContent) {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, fileContent, err => {
            if(err) {
                reject('We got and error'+err);
            } else {
                resolve(fileName+' written!');
            }
        })
    });
}


console.log('test');
}

exports.geting = function(req, res, err ,next)
{

// res.writeHead(200, {'Content-Type': 'application/force-download','Content-disposition':'attachment; filename=file.txt'});
// res.end( req.body);


res.writeHead(200, {'Content-Type': 'application/force-download','Content-disposition':'attachment; filename=file.txt'});
res.end( req.body );

if (err) {
  console.error('There was an error', err);
  return;
}

};
