/**
 *	latitude and longiture convertor
 *	
 *	TODO:
 * 	Single coordinates need to be separated by commas
 * 	Multiple coordinates need to be separated by semicolons
 * */
var Converter = function(){
	//default container of coordinates string
	this.coordinates = ''; 
	this.DEFAULT_TYPE = 'unknown';

	this.deg = 0;
	this.min = 0;
	this.sec = 0;
	this.dir = '';

	this.type = this.DEFAULT_TYPE;

	this.arrCoords = [];
};

//convert coordinates and output results
Converter.prototype.convert = function() {
	this.setSubmitVars();

	var coords = [];

	coords = this.parseCoordinates(this.coordinates);
};

//convert coordinates from initial type to remaining ones
Converter.prototype.parseCoordinates = function(coordinates) {
	alert('in parse');
	if( coordinates === '' || coordinates.length < 1 ) {
		alert('Specify coordinates for convertion');	
	}

	var matches = [];

	//matching normal GPS coordinates
	//40.446195, -79.948862
	//40.446195N 79.948862W
	if( matches = coordinates.match(/^([NWSE\-])?\s?(\d+)\.(\d+)?([NSWE])?\,?\s+?([NWSE\-])?(\d+)\.(\d+)?([NSWE])?/i) ) {
		this.type = 'decimal';
	} 
	
	//inmarsat coordinate type	
	//40 26.7717' N, 79 56.93172' W
	else if( matches = coordinates.match(/^(\d+)\s+(\d+\.\d+)?\'\s+\w\,?\s+(\d+)\s+(\d+\.\d+)?\'?\s+\w/i) ) {
		this.type = 'inmarsat';

	}
	
	// matching geo coordinates: 
	// 1. 40:26:46N,79:56:55W 			(matches: 40[1],26[2],46[3],N[5],79[6],56[7],55[8],W[10])
	// 2. 40:26:46.302N 79:56:55.903W 	(matches: 40[1],26[2],46.302[3],302[4],N[5],79[6],56[7], 55.903[8],903[9],W[10])
	// 3. 40°26′47″N 79°58′36″W 		(matches: 40[1],26[2], 47[3],N[5], 79[6], 58[7], 36[8], W[10])
	else if( matches = coordinates.match(/^\s?(\d+)[\w\W\:\s]?(\d+)?[\W\:\s]?(\d+\.?(\d+)?)?[\W\:\s]?([NWSE])?[\s+\,]?(\d+)[\w\W\:\s]?(\d+)[\W\:\s]?(\d+\.?(\d+)?)?[\W\:\s]?([NWSE])?/i) ) {
		for( i = 0; i < matches.length; i++) {
			alert('matches: ['+i+']'  + matches[i]);
		}
		this.type = 'dms';
	} 

	alert('type: ' + this.type);
};


//pass vars to private properties of prototype class
Converter.prototype.setSubmitVars = function(){
	var data = document.getElementById('coords').value;
	
	if( (data !== "") || (typeof data !== undefined) ) {
		this.coordinates = data;
	} 
};

