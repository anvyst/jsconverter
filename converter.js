/**
 *	latitude and longitude convertor
 *	
 *	Coordinate types parsed:
 *	1. 40.446195, -79.948862W 			-> dec
 *	2. 40.446195N 79.948862W 			-> dec
 *	3. 40 26.7717' N, 79 56.93172' W 	-> mindec
 *	4. 40:26:46N,79:56:55W 				-> dms
 *	5. 40°26′47″N 79°58′36″W  			-> dms
 *	
 *	LATER: 40:26:46.302N 79:56:55.903W
 *
 * */
(function($){
	//basic decimal coordinate container
	var coordinate = {
		'lat': 0,
		'lng': 0
	};

	var decimalRegex 	= /^\s*?([NS\-])?(\d+)\.(\d+)([NS\-])?\,?\s*([WE\-])?(\d+)\.(\d+)([WE\-])?/i;
	var minDecRegex 	= /^\s*?(\d+)\s+?(\d+)\.(\d+)\'?\s+?([NS])[\s+]?\,?\s+?(\d+)\s+?(\d+)\.(\d+)\'?[\s+]?([WE])/i;
	var dmsRegex 		= /^\s*?(\d+)[\W](\d+)[\W](\d+)[\W]?[\s*]?([NS])?\,?[\s+]?(\d+)[\W](\d+)[\W](\d+)[\W]?[\s*]?([WE])/i;

	var methods = {
		'fromDecimal' : function(matches) {
			coordinate.lat = parseFloat(matches[2] + '.' + matches[3]);
			
			if(matches[1] == "S" || matches[1] == "-" || matches[4] == "S") {
				coordinate.lat *= -1;	
			}

			coordinate.lng = parseFloat(matches[6] + '.' + matches[7]);
			
			if( matches[5] == "W" || matches[5] == "-" || (matches[8] == "W") ) {
				coordinate.lng *= -1;
			}
		},	
		'fromMinDec'  : function(matches) {
			coordinate.lat = parseInt(matches[1]) + (parseFloat(matches[2]+'.'+matches[3]) / 60);

			if( matches[4] == "S") {
				coordinate.lat *= -1;
			}

			coordinate.lng = parseInt(matches[5]) + (parseFloat(matches[6]+'.'+matches[7]) / 60);
			
			if( matches[8] == "W") {
				coordinate.lng *= -1;
			}
		},
		'fromDms'	  : function(matches) { 
			console.log(matches);
			coordinate.lat = parseInt(matches[1]) + (parseFloat( (parseInt(matches[2]) * 60 + parseInt(matches[3]) ) / 3600));
		
			if( matches[4] == "S" ) {
				coordinate.lat *= -1;
			}
			coordinate.lng = parseInt(matches[5]) + (parseFloat( (parseInt(matches[6]) * 60 + parseInt(matches[7]) ) / 3600));
			
			if( matches[8] == "W" ) {
				coordinate.lng *= -1;
			}
		
			coordinate.lat = $.fn.roundCoordinates(coordinate.lat, 6);
			coordinate.lng = $.fn.roundCoordinates(coordinate.lng, 6);
		},
		'toDms'		  : function(data) { 
			var stringResult = [];
		
			var result = { 
				lat:{ deg: null, min: null, sec: null},
				lng:{ deg: null, min: null, sec: null} 
			};
			
			$.each(data,function(idx, val) {
				var tmp = "";
				
				if( val < 0 ) {
					tmp = "-";
					val = Math.abs(val);
				}

				result[idx].deg = parseInt(val);
				result[idx].min = parseInt((val - result[idx].deg) * 60);
				result[idx].sec = parseInt(Math.ceil((((val - result[idx].deg) * 60) - result[idx].min) * 60));
				
				tmp += result[idx].deg + "\u00B0 " + result[idx].min + "' " + result[idx].sec + "\"";
			
				stringResult.push(tmp);
			});

			return stringResult.join(', ');
		},
		'toMinDec' 	  : function(data) { console.log('toMinDec'); },
		'toDecimal'	  : function(data) { console.log('toDecimal'); }
	}; 


	/**
	 *	parseCoordinates method
	 *	converts given type of coordinate to decimal 
	 *	as base coordinate notation
	 * */
	$.fn.parseCoordinates = function(){
		if( matches = $(this).val().match(decimalRegex) ) {
			$.fn.setCoordinate('fromDecimal', matches);		
		} else if( matches =  $(this).val().match(minDecRegex) ) {
			$.fn.setCoordinate('fromMinDec', matches);		
		} else if( matches = $(this).val().match(dmsRegex) ) {
			$.fn.setCoordinate('fromDms', matches);		
		} else {
			$.error('Couldn\'t find appropriate match for coordinate');
		}

		//collect all the standards
		var outputResult = {
			toDms : $.fn.setCoordinate('toDms', coordinate)
		};
	
		console.log(outputResult);
	};

	/**
	 *	setCoordinate is converting coordinates with "from<type>" to 
	 *	decimal notation and vice verca with "to<type>" notation.
	 *	@param string type - coordinate type
	 *	@param array  matches - matches of certain regex'es
	 * */
	$.fn.setCoordinate = function(type, matches) {
		// Method calling logic
    	if ( methods[type] ) {
      		return methods[type].apply( this, Array.prototype.slice.call( arguments, 1 ));
    	} else if ( typeof method === 'object' || ! method ) {
      		return methods.init.apply( this, arguments );
    	} else {
      		$.error( 'Method ' +  method + ' does not exist on jQuery.setCoordinate' );
    	}   	
	};

	$.fn.roundCoordinates = function(num, dec_points) {
		var result = Math.round(num*Math.pow(10,dec_points))/Math.pow(10,dec_points);
		return result;
	};
})(jQuery);
