// AUG-15-2014, 2:57 PM

/**
*
*	This file works but a request needs to be sent by a browser every so often. Likely due to the PHPSESSION cookie needing to remain valid. Would need to add some code to revalidate it every so often.
*
*/

var express = require("express");
var https = require('https');
var qs = require('qs');
var fs = require('fs');


var MikeStuff = require('./base_module');
var APP = new MikeStuff();	// need to have the new keyword...

//var testing = require('./view');
//testing.lookup('test', 'asdf');
//testing.testing123();
//console.log('APP: ', APP);

var app = express();




var options = {
	host: 'adweb.cis.mcmaster.ca',
	//host: '130.113.64.53',
	port: 443,
	method: 'GET',
	path: '/mtt/U201409.html'
	/*,
	headers: {
		'Connection': 'keep-alive',
		//'Content-Type': 'application/x-ww-form-urlencoded',
		//'Content-Length': Buffer.byteLength(post_data),
		'Content-Length': post_data.length,
		//'Content-Length': 45,
		//'Referer': 'https://adweb.cis.mcmaster.ca/mtt/',


		'Cache-Control': 'max-age=0',
		//'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,* / *;q=0.8',
		//'Origin': 'https://adweb.cis.mcmaster.ca',
		//'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36',
		'Content-Type': 'application/x-www-form-urlencoded',
		//'Referer': 'https://adweb.cis.mcmaster.ca/mtt/',
		//'Accept-Encoding': 'gzip,deflate,sdch',
		//'Accept-Language': 'en-US,en;q=0.8',

		// MUST HAVE COOKIE HEADER PASSED
		'Cookie': 'PHPSESSID=0079403f8443d3d2322ff1e9a811d56c'

		//'Content-Length': 0,
		//'Accept-Encoding': 'gzip, deflate',
		//'User-Agent': 'runscope/0.1'
	}
	*/
};

// needed in order to prevent Error: UNABLE_TO_VERIFY_LEAF_SIGNATURE
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var html_file = "";

// set up request

// don't need to have it getting the file *every* time.
/*
var req = https.request(options, function(res) {
	console.log("\r\nstatusCode: ", res.statusCode);
	console.log("headers: ");
	console.log(res.headers);
	console.log("\r\nResponse:\r\n");
	
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
		//console.log(chunk);
		html_file += chunk;
	});

	res.on('end', function (test) {
		console.log('ended.');
		//console.log(test);

		// the request has finished!

		// write the timetable to a file
		fs.writeFile('full_schedule.html', html_file, function(err) {
			if (err) {
				console.log('Could not write file: %s', err);
			}
		});
	});

});
*/

// On Error
/*
req.on('error', function(e) {
    console.log('\n\n==========ERROR==============')
    console.log('problem with request: ' + e.message);
});

req.end();
*/



app.get('/', function(req, res) {
	res.send('hello world!!');

	// i need to put the POST request in here for it to work in a browser

	//res.send('<br><br><iframe>'+'test'+'</iframe>');
});

//app.listen(3000);
//debugger;
/*
var some_data = APP.readHTMLSchedule('./full_schedule.html', function (data) {
	console.log('test callback', data);
});
*/


APP.readHTMLSchedule('./full_schedule.html', APP.parseHTMLSchedule);


