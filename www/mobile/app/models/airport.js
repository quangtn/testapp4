define(['jquery', 'underscore', 'backbone', 'models/model', 'parsers/airport_parser'],
function($, _, Backbone, Model, AirportParser) {

	var Airport = Model.extend({

		initialize: function(attrs, options) {
			_.extend(this, AirportParser);
		}

	});

	return Airport;
});