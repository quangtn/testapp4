require(['namespace', 'backbone', 'underscore',
	'text!fixtures/mock_trip_response.json',
	'parsers/trip_parser'
],
	function(app, Backbone, _, mockTripResponseString, TripParser) {

		describe('Air Trip Item', function() {

			var mockTripResponse, tripModel;

			beforeEach(function() {
				tripModel = new Backbone.Model();
				_.extend(tripModel, TripParser);

				mockTripResponse = JSON.parse(mockTripResponseString);
			});

			afterEach(function() {
				tripModel = null;
				mockTripResponse = null;
			});

			it('can create application objects for testing', function() {
				expect(mockTripResponseString).toBeDefined();
				expect(TripParser).toBeDefined();

				expect(mockTripResponse).toBeDefined();
				expect(tripModel).toBeDefined();
				expect(tripModel.parse).toBeDefined();
			});

			it('responds to getters', function() {
				var airItem;

				tripModel.parse(mockTripResponse);

				airItem = tripModel.tripItems.at(0);
				expect(airItem).toBeDefined();
				expect(airItem.isCancelled()).toEqual(false);
				expect(airItem.isEarly()).toEqual(false);
				expect(airItem.hasDepartureStatus()).toEqual(false);
				expect(airItem.isCancelledOrDelayed()).toEqual(false);
				expect(airItem.isDeparted()).toEqual(false);
				expect(airItem.hasLanded()).toEqual(false);
				expect(airItem.hasArrived()).toEqual(false);
				expect(airItem.hasArrivalStatus()).toEqual(false);
				expect(airItem.hasDepartureTerminalOrGateChange()).toEqual(false);
				expect(airItem.hasArrivalTerminalOrGateChange()).toEqual(false);
				expect(airItem.hasSeatMapUrl()).toEqual(true);
				expect(airItem.getAirlineName()).toEqual("American Airlines");
				expect(airItem.getAirlineCode()).toEqual("AA");
				expect(airItem.getFlightNumber()).toEqual(1907);
				expect(airItem.getDepartureDate()).toEqual("2013-06-09T10:50:00");
				expect(airItem.getDepartureTime()).toEqual("2013-06-09T10:50:00");
				expect(airItem.getDepartureAirportCode()).toEqual("MIA");
				expect(airItem.getDepartureAirportName()).toEqual("Miami International Airport");
				expect(airItem.getDepartureCity()).toEqual("Miami");
				expect(airItem.getArrivalAirportCode()).toEqual("ANU");
				expect(airItem.getArrivalAirportName()).toEqual("V.C. Bird International Airport");
				expect(airItem.getArrivalCity()).toEqual("Antigua");
				expect(airItem.hasCabinAvailabilityData()).toEqual(undefined);
				expect(airItem.hasNoCabinAvailabilityData()).toEqual(true);
				expect(airItem.hasPlaneChange()).toEqual(true);
			});

		});
	}
);