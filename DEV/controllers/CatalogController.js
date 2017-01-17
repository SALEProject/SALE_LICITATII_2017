var express = require('express');
var http = require('http');
var app = express();
var AppFile = require('../app.js');
var ConfigFile = require('../config.js');
// var host = ConfigFile.WebServiceIP;

exports.AddProduct = function (req, res, next)
{
    res.send(req.body);
};
