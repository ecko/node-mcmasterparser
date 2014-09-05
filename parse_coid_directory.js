// SEPT 4 2014 @ 10:41 PM

var express = require("express");
var https = require('https');
var qs = require('qs');
var fs = require('fs');
var cheerio = require('cheerio');


var MikeStuff = require('./base_module');
var APP = new MikeStuff();	// need to have the new keyword...

var app = express();






// @TODO:
// 	- get the list of the files in the directory
//	- parse each one to get the details
//	- sort and display on a web page


