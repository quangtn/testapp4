define([
	'jquery', 'underscore', 'backbone', 'models/model', 'proxies/seat_map_proxy'
],
function($, _, Backbone, Model, SeatMapProxy) {

	var SeatMap = Model.extend({

		initialize: function(attributes, options) {
			this.airTripItem = options.air_trip_item;
			this.proxy = new SeatMapProxy({}, {model: this});
		},

		getTripId: function() {
			return this.airTripItem.get('trip_id');
		},

		getAirTripItemId: function() {
			return this.airTripItem.get('id');
		}

	});

	return SeatMap;

});