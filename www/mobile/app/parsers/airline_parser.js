define([],
function() {

	return {

		parse: function(response) {
			this.clear({silent: true});
			return this.parseAirline(response);
		},

		parseAirline: function(airlineData) {
			airlineData.name_and_iata = airlineData.name + " (" + airlineData.iata_code + ")";
			return airlineData;
		}

	};

});
