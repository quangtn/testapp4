define([
	'jquery', 'underscore', 'backbone', 'models/model',
	'parsers/combine_trips_request_parser', 'proxies/combine_trips_request_proxy'
], function($, _, Backbone, Model, CombineTripsRequestParser, CombineTripsRequestProxy) {

	var CombineTripsRequest = Model.extend({

		initialize: function(attrs, options) {
			_.extend(this, CombineTripsRequestParser);
			this.proxy = new CombineTripsRequestProxy({}, {model: this});
		},

		validate: function(attrs){
			var errors = [];
			if(this._hasLessThanTwoTripsSelected(attrs)){
				errors.push("You must select at least 2 trips to combine.");
			}
			if(this._hasBlankName(attrs)){
				errors.push("Trip Name can't be blank");
			}
			return errors.length > 0 ? errors : null;
		},

		getTripItems: function() {
			return this.trip_items;
		},

		getTrip: function() {
			return this.trip;
		},

		getTripIds: function() {
			return this.get('tripIds');
		},

		_hasLessThanTwoTripsSelected: function(attrs) {
			return !!attrs.tripIds && attrs.tripIds.length < 2;
		},

		_hasBlankName: function(attrs) {
			return _.isString(attrs.name) && _.isEmpty(attrs.name);
		}

	});

	return CombineTripsRequest;
});
