define(['underscore', 'backbone', 'models/trip', 'parsers/trip_parser'],
function(_, Backbone, Trip, TripParser) {

	var CombineTripsRequestParser = {

		parse: function(response){
			if (this._isPreMergeResponse(response)) {
				this.trip_items = TripParser.parseTripItems(response);
			} else {
				this.trip = new Trip();
				this.trip.set(this.trip.parse(response), { silent: true });
			}
			return {};
		},

		_isPreMergeResponse: function(response){
			return _.isArray(response);
		}

	};

	return CombineTripsRequestParser;

});
