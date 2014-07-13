define([
	'jquery', 'underscore', 'backbone', 'models/model',
	'parsers/weather_parser', 'proxies/weather_proxy'],
function($, _, Backbone, Model, WeatherParser, WeatherProxy) {

	var Weather = Model.extend({

		initialize: function(attrs, options) {
			_.extend(this, WeatherParser);
			this.proxy = new WeatherProxy({}, {model: this});
		},

		getAirportCode: function() {
			return this.get('airport_code');
		}

	});

	return Weather;
});
