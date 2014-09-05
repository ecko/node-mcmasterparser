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
var cheerio = require('cheerio');


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


APP.readHTMLSchedule('./full_schedule.html', function(rawHTML) {
	APP.parseHTMLSchedule(rawHTML, applyFiltering);
});

classListCount = function(obj) {
	var num_total_classes = 0;
	for (var department in obj) {
		for (var i = obj[department].length - 1; i >= 0; i--) {
			num_total_classes++;
		};
	}
	return 	num_total_classes;
};

applyFiltering = function(classList) {

	//console.log(classList);
	var num_total_classes = classListCount(classList);

	console.log('dept list count: ', APP.objectLength(classList));
	console.log('class list count: %s', num_total_classes);

	// loop through and filter off things we don't want
	var filteredList = {};
	var valid_departments = [
		'CHEM ENG', 'COMP ENG', 'CIV ENG', 'ENG PHYS', 'SFWR ENG', 'ELEC ENG', 'MATLS', 'MECH ENG', 'COMP SCI'
	];
	var cached_department_html = {};

	for (var department in classList) {
		// does it match the department?
		/*
		F.   3 TO 4 UNITS FROM  CHEM ENG LEVEL 3, LEVEL 4  +     
          COMP ENG LEVEL 3, LEVEL 4  +  CIV ENG LEVEL 3,         
          LEVEL 4  +  ENG PHYS LEVEL 3, LEVEL 4  +  SFWR ENG     
          LEVEL 3, LEVEL 4  +  ELEC ENG LEVEL 3, LEVEL 4  +      
          MATLS LEVEL 3, LEVEL 4  +  MECH ENG LEVEL 3, LEVEL     
          4  +  COMP SCI LEVEL 3, LEVEL 4                 
      	*/

      	var is_valid_department = false;
      	for (var i = valid_departments.length - 1; i >= 0; i--) {
      		if (department.indexOf(valid_departments[i]) !== -1) {
				//it matches one of the valid depts
				// keep track of it as it's the prefix for course codes
				is_valid_department = valid_departments[i];
				//cached_department_html[cached_department_html].html = '';
				break;
			}
      	}

      	// skip this department if it didn't match any of the valid depts
      	if (!is_valid_department) {
			continue;
		}
		


		filteredList[department] = [];
		cached_department_html[cached_department_html] = {};
		console.log(department);
		// loop through this department
		for (var i = 0; i < classList[department].length; i++) {
			var course = classList[department][i];

			// skip the first/second year classes
			if (parseInt(course.courseCode) < 3) {
				//console.log(course.courseCode, course.courseDesc);
				continue;
			}

			// skip the second term classes
			if (course.courseTerm !== 'TERM 1') {
				continue;
			}


			// @TODO:
			//	- with the coid I can make *another* request to get the pre-reqs (use the print view)
			// here is the print page URL, http://academiccalendars.romcmaster.ca/preview_course.php?catoid=7&coid=36586&print

			

			//cached_department_html[cached_department_html].html = '';

			//console.log(cached_department_html[cached_department_html].html);

			if (cached_department_html[cached_department_html].html === undefined) {
				// read it in and cache it
				

				// using read synch is silly but easy work around
				var filename = './cache_eng_courses/'+is_valid_department+'.html';
				var text = fs.readFileSync(filename, 'utf-8');
				cached_department_html[cached_department_html].html = text;
			}


			$ = cheerio.load(cached_department_html[cached_department_html].html, {
				normalizeWhitespace: true
			});

			var a_elements = $('a').each(function(i, element) {
				// this === element

				//console.log($(this).text());
				if ($(this).text().indexOf(course.courseCode) !== -1) {
					// match
					//console.log($(this).text());
					// get the href and parse it
					var href = $(this)[0].attribs.href;

					//console.log($(this)[0].attribs.href);
					//console.log(href.substring(href.indexOf('&coid=')+6));

					course.coid = href.substring(href.indexOf('&coid=')+6);
					course.niceName = $(this).text();

					// do the request to get the COID data
					// the following code works.
					// add some check to see if file already exists instead of redownloading it
					/*
					var search_url = 'http://academiccalendars.romcmaster.ca/preview_course.php?catoid=7&coid='+course.coid+'&print';
					var asdf = function(search_url, coid) {
						APP.makeSimpleGet(search_url, function(data) {
							// now write the file back out.
							var filename = './cache_eng_coids/'+coid+'.html';
							APP.writeHTMLFile(filename, data, function() {
								//
							});
						});
					};

					asdf(search_url, course.coid);
					*/
				}
			});


			course.coursePrefix = is_valid_department;

			// seems to be good so add it to the list
			filteredList[department][filteredList[department].length] = course;
		}

		// and finally check if there are any classes left for this department.
		// if not, delete
		if (filteredList[department].length <= 0) {
			delete filteredList[department];
		}




	}

	console.log('filtered dept list count: ', APP.objectLength(filteredList));
	console.log('filtered class list count: %s', classListCount(filteredList));
	

	//console.log(filteredList);
	//getPrereqs(filteredList, valid_departments);
};

getPrereqs = function(filteredList, valid_departments) {
	// @TODO:
	//	- i need to parse the 'cache_eng_courses' files (based on is_valid_department)
	//		to get the coid=XXXX for each course.
	//	- with the coid I can make *another* request to get the pre-reqs (use the print view)
	// here is the print page URL, http://academiccalendars.romcmaster.ca/preview_course.php?catoid=7&coid=36586&print

	var results = [];

	var async = function(arg, callback) {
		console.log('doing something with %s', arg);
		callback(arg);
	};

	var final = function() {
		console.log('all done');
		//console.log(filteredList);
	};

	valid_departments.forEach(function(item) {
		async(item, function(result) {
			results.push(result);
			if (results.length == valid_departments.length) {
				final();
			}
		})
	});




	/*


	var asdf = function(department, course, valid_department) {
		var filename = './cache_eng_courses/'+valid_department+'.html';

		APP.readHTMLFile(filename, function (data) {
			course.testing = 'asdf';


			course.coursePrefix = is_valid_department;

			// seems to be good so add it to the list
			//filteredList = course;

			console.log(course);
		});
	};
	asdf(department, course, is_valid_department);
	*/
};


// I want to do simple GET requets on {http://academiccalendars.romcmaster.ca/content.php}
// to get a list of the coureses for a dept.
// then save the resulting page.
/*
var valid_departments = [
		'CHEM ENG', 'COMP ENG', 'CIV ENG', 'ENG PHYS', 'SFWR ENG', 'ELEC ENG', 'MATLS', 'MECH ENG', 'COMP SCI'
	];
for (var i = valid_departments.length - 1; i >= 0; i--) {
	//valid_departments[i]
	var search_url = 'http://academiccalendars.romcmaster.ca/content.php?filter%5B27%5D='+valid_departments[i]+'&filter%5B29%5D=&filter%5Bcourse_type%5D=-1&filter%5Bkeyword%5D=&filter%5B32%5D=1&filter%5Bcpage%5D=1&cur_cat_oid=7&expand=&navoid=558&search_database=Filter&filter%5Bexact_match%5D=1';

	var asdf = function(search_url, valid_department) {
		APP.makeSimpleGet(search_url, function(data) {
			// now write the file back out.
			var filename = './cache_eng_courses/'+valid_department+'.html';
			APP.writeHTMLFile(filename, data, function(){
				//
			});
		});
	};

	asdf(search_url, valid_departments[i])
};
*/

