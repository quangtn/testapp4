define([],
function() {

	return {

		parse: function(response) {
			this.clear({silent: true});
			return this.parseAirport(response);
		},

		parseAirport: function(airportData) {
			return airportData;
		}

	};

});