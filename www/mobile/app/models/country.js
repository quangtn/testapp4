define(['jquery', 'underscore', 'backbone', 'models/model', 'parsers/country_parser'],
function($, _, Backbone, Model, CountryParser) {

	var Country = Model.extend({

		idAttribute: 'iso_code',

		initialize: function(attrs, options) {
			_.extend(this, CountryParser);
		},

		getISOCode: function() {
			return this.get('iso_code');
		},

		getName: function() {
			return this.get('name');
		}

	});

	return Country;
});
