define([
	'jquery', 'underscore', 'backbone', 'models/model',
	'parsers/airline_parser'
], function($, _, Backbone, Model, AirlineParser) {

	var Airline = Model.extend({

		initialize: function(attrs, options) {
			_.extend(this, AirlineParser);
		},

		getIataCode: function() {
			return this.get('iata_code');
		},

		getName: function() {
			return this.get('name');
		}

	});

	return Airline;
});
