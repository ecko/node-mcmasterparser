

// private vars?
var fs = require('fs');
var htmlparser = require('htmlparser2');
var cheerio = require('cheerio');
var https = require('https');

/**
 * Expose `MikeStuff`.
 */
 module.exports = MikeStuff;


// put the http request in here
// file writing, etc

//function MikeStuff(callback, options, elementCB) {
function MikeStuff() {
	/*
	if(typeof callback === "object"){
		elementCB = options;
		options = callback;
		callback = null;
	} else if(typeof options === "function"){
		elementCB = options;
		options = defaultOpts;
	}
	this._callback = callback;
	this._options = options || defaultOpts;
	this._elementCB = elementCB;
	this.dom = [];
	this._done = false;
	this._tagStack = [];
	*/
}


MikeStuff.prototype.makeHTTPSRequest = function(options, postData, onDoneCallback) {

	var html_file = "";

	// needed in order to prevent Error: UNABLE_TO_VERIFY_LEAF_SIGNATURE
	//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

	https.globalAgent.options.secureProtocol = 'SSLv3_method'; // needed for OSCAR

	var req = https.request(options, function(res) {
		// @todo: check the status code of the response

		//console.log("\r\nstatusCode: ", res.statusCode);
		//console.log("headers: ");
		//console.log(res.headers);
		//console.log("\r\nResponse:\r\n");
		
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			//console.log(chunk);
			html_file += chunk;
		});

		res.on('end', function (test) {
			//console.log('ended.');
			//console.log(html_file);

			onDoneCallback(html_file);


			// the request has finished!

			// write the timetable to a file
			/*
			fs.writeFile('full_schedule.html', html_file, function(err) {
				if (err) {
					console.log('Could not write file: %s', err);
				}
			});
			*/
		});

	});

	// On Error
	req.on('error', function(e) {
	    console.log('\n\n==========ERROR==============')
	    console.log('problem with request: ' + e.message);
	});

	req.write(postData);
	req.end();
};

MikeStuff.prototype.writeHTMLFile = function(filename, data, onDoneCallback) {
	fs.writeFile(filename, data, {}, function(err) {
		if (err) {
			console.log('Could not write file: %s', err);
		}
		else {
			onDoneCallback();
		}
	});
};

// this doesn't work. check aliasing
//MikeStuff.prototype.readHTMLSchedule = MikeStuff.prototype.readHTMLFile();
MikeStuff.prototype.readHTMLSchedule = function(filename, onDoneCallback) {
	MikeStuff.prototype.readHTMLFile(filename, onDoneCallback);
};

MikeStuff.prototype.readHTMLFile = function(filename, onDoneCallback) {
	fs.readFile(filename, 'utf8', function (error, data) {
		if (error) {
			console.log('Error reading HTML Schedule %s', error);
		}
		else {
			//console.log(data);
			//return data;
			onDoneCallback(data);
		}
	});
};

MikeStuff.prototype.objectLength = function(object) {
	if (Object.keys) {
		// modern browsers
		return Object.keys(object).length;
	}
	else {
		// oldies
		var length = 0;
		for( var key in object ) {
			if( object.hasOwnProperty(key) ) {
				++length;
			}
		}
		return length;
	}
};

MikeStuff.prototype.parseHTMLSchedule = function(rawHTML) {


	$ = cheerio.load(rawHTML, {
		normalizeWhitespace: true
	});
	console.log($('table tr').html());


	var table_rows = $('html body table tr');
	//console.log(' # table rows: ', $('table').find('tr').length);
	console.log(' # table rows: ', table_rows.length);

	

	var courses = $('tr td[width="30%"]');
	console.log(' # courses: ', courses.length);



	// @TODO:





	var classList = {};
	var departments = new Array();

	//console.log(courses[0].parent);
	// need to get the 2 child nodes within this courses array.

	// this gets an array of all the departments.. but still don't know how to tie between courses
	console.log($('.label', courses[0].parent.parent)[1].children[1].data);
	console.log(courses[0].parent.prev.prev.children[0].children[1].data); // works for the first department. but not for others...

	console.log('------');
	//console.log($('td', courses[3].parent)[0].children[0].data.trim());
	


	// get all the departments
	//var depts = $('.label');
	//console.log([0].children);

	var department = '';
	var old_department = '';
	var dept_course_count = 0;

	for (var i = 0; i < table_rows.length; i++) {
		//table_rows[i]
		var dept = $('.label', table_rows[i]);

		if (dept[0] !== undefined && dept[0] !== null) {
			if (dept[0].children) {
				department = dept[0].children[1].data.trim();

				if (department != old_department) {
					// we have a new department (this check should never be needed though)
					//console.log(dept[0].children[1].data);
					departments.push(department);

					classList[department] = [];
					dept_course_count = 0;
				}

				

				// it's just a department row so we can continue
				continue;
			}
		}

		var course = $('td[width="30%"]', table_rows[i]);

		if (course[0] !== undefined && course[0] !== null) {
			if (course[0].children) {
				dept_course_count++;

				//console.log('    %s. %s', dept_course_count, course[0].children[0].data.trim());

				

				// now get all the other coure's info.
				var course_el = $(course[0]).siblings('td');
				//console.log(course_el);
				var courseCode = course_el[0].children[0].data.trim();
				var courseDesc = course[0].children[0].data.trim();
				var courseTerm = course_el[1].children[0].data.trim();
				var courseDay = course_el[2].children[0].data.trim();

				//console.log('course code: %s %s %s', courseCode, courseTerm, courseDay);


				classList[department][classList[department].length] = {
					courseCode: courseCode,
					courseDesc: courseDesc,
					courseTerm: courseTerm,
					courseDay: courseDay
				};
			}
		}

		//console.log(course);


	};

	//console.log(classList);



	/*
	for (var i = 0; i < courses.length; i++) {
		var row = courses[i].parent;
		var cells = $('td', row);

		//console.log(cells[0]);
		//console.log('type: ', typeof(cells[0].children[0].data));

		//var department = $('.label', courses[0].parent.parent)[0].children[1].data.trim();
		var department = ''; // too slow to do the selector
		//var department = row.prev.prev.children[0].children[1].data;
		var courseCode = cells[0].children[0].data.trim();
		var courseDesc = cells[1].children[0].data.trim();
		var courseTerm = cells[2].children[0].data.trim();
		var courseDay = cells[3].children[0].data.trim();

		//console.log(courseCode, ' => ', courseCode[0]+courseCode[1]);

		// skip courses not offered this year.
		if (courseTerm === 'NOT OFFERED') {
			continue;
		}

		// skip the first/second year classes
		if (parseInt(courseCode[0]) < 3) {
			continue;
		}

		// skip the second term classes
		if (courseTerm === 'TERM 2') {
			continue;
		}


		if (true === false) {
			console.log(
				'['+(i+1)+']', courseCode, '-', courseDesc, '-', courseTerm, '-', courseDay
			);
		}


		classList.push({
			'code': courseCode,
			'desc': courseDesc,
			'term': courseTerm,
			'tod': courseDay
		});

		//console.log(department);

		departments.push(department);
	}
	*/

	console.log('class list count: ', classList.length);	// this doesn't work because I now have object of departments with sub-array of classes
	console.log('dept list count: ', departments.length);
	//console.log('dept list count: ', this.objectLength(classList)); // can't seem to call the method...


	// now we can go ahead with the filtering.



};


