define(['underscore', 'backbone'],
function(_, Backbone) {

	var CountryParser = {

		parse: function(response) {
			this.clear({silent: true});
			return this.parseCountry(response);
		},

		parseCountry: function(countryData) {
			return countryData;
		}

	};

	return CountryParser;

});
