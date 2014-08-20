

// private vars?
var fs = require('fs');
var htmlparser = require('htmlparser2');
var cheerio = require('cheerio');

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

MikeStuff.prototype.readHTMLSchedule = function(filename, onDoneCallback) {
	fs.readFile(filename, 'utf8', function (error, data) {
		if (error) {
			console.log('Error reading HTML Schedule');
		}
		else {
			//console.log(data);
			//return data;
			onDoneCallback(data);




		}
	});
};

MikeStuff.prototype.parseHTMLSchedule = function(rawHTML) {

	/*
	var handler = new htmlparser.DomHandler(function (error, dom) {
		if (error) {

			// something went wrong.
		}
		else {
			// parsing is done
			console.log(dom);
			//onDoneCallback(dom);

			console.log(dom[0].children[0]);
		}
	}, {normalizeWhitespace: true});

	var parser = new htmlparser.Parser(handler);
	parser.write(rawHTML);
	parser.done();
	*/

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
	//		- some classes have "NOT OFFERED" for the courseTerm. skip
	//		- skip classes that aren't third or 4th year.
	//		- store these into an array.

	for (var i = 0; i < courses.length; i++) {
		//courses[i]
		var row = courses[i].parent;
		var cells = $('td', row);

		//console.log(cells[0]);
		//console.log('type: ', typeof(cells[0].children[0].data));

		var courseCode = cells[0].children[0].data.trim();
		var courseDesc = cells[1].children[0].data.trim();
		var courseTerm = cells[2].children[0].data.trim();
		var courseDAY = cells[3].children[0].data.trim().trim();

		console.log(
			'['+(i+1)+']', courseCode, '-', courseDesc, '-', courseTerm, '-', courseDAY
		);
		/*
		for (var i = 0; i < cells.length; i++) {
			console.log(i, ' => ', $(cells[i], row).text());
		};
		*/
		//console.log($(row).html());
		break;
	};


	//var courses = $('body table tr');
	//console.log(' # courses: ', courses.length);

	//var courses = $('td[width="30%"]', courses);

	//console.log(table_rows[0].children[0]);

	/*
	console.log(' # courses: ', $('.nicetable', table_rows).length);


	

	return;

	for (var i = 0; i < courses.length; i++) {
		//console.log($('td', courses[i]).html();
			console.log(courses[i]);

		var details = $('td', courses[i]);

		for (var i = 0; i < details.length; i++) {
			//console.log(i, ' => ', details[i]);
			//console.log(i, ' => ', details[i].data);
			break;
		};

		break;
	};
	*/
	/*

	var courses = $('tr td[width="5%"]');
	console.log(' # courses: ', courses.length);
	//for (var i = courses.length - 1; i >= 0; i--) {
	for (var i = 20, limit = courses.length; i < limit; i++) {
		//courses[i]
		console.log(courses[i]);
		
		var row = courses[i];
		var courseCode = courses[i].children[0].data;
		var details = $('td', courses[i].parent);
		var courseDesc = details[1].children[0].data;

		console.log(courseCode, ' - ', courseDesc);

		//console.log( details );

		//console.log( details[2].children[0].data);

		for (var i = details.length - 1; i >= 0; i--) {
			console.log(i, ' => ', details[i].children[0].data);
		};

		break;
	};
	*/



};


