require(['mediator', 'jquery', 'underscore', 'backbone', 'namespace', 'strings',
	'models/flight_group', 'views/flights/add/add_flight_view'
	],
	function(mediator, $, _, Backbone, app, t, FlightGroupModel, EditFlightView) {

		describe('Edit Flight View', function() {

			var flightGroupModel, editView;

			beforeEach(function() {
				flightGroupModel = new FlightGroupModel();
				editView = new EditFlightView({model: flightGroupModel});
			});

			it('can create app models for testing', function() {
				expect(flightGroupModel).toBeDefined();
				expect(editView).toBeDefined();
			});

			it('is happy with all valid user input', function() {
				var MOCK_USER_INPUT = {
					airlineCode: "AA",
					flightNumber: "45",
					departureDate: "Thu, Jan 17, 2013",
					confirmationNumber: "ABC123",
					note: "Ask attendent for a pillow"
				};

				var validInputResults = editView._validateUserInput(MOCK_USER_INPUT);
				expect(validInputResults[0]).not.toBeDefined();
			});

			it('catches user input missing flight number', function() {
				var MOCK_BAD_USER_INPUT = {
					airlineCode: "AA",
					departureDate: "Thu, Jan 17, 2013",
					confirmationNumber: "ABC123",
					note: "Ask attendent for a pillow"
				};

				var validInputResults = editView._validateUserInput(MOCK_BAD_USER_INPUT);
				expect(validInputResults[0]).toBeDefined();
				expect(validInputResults[0].message).toEqual(t.ErrorFlightNumNumeric);
				expect(validInputResults[0].fieldName).toEqual('flightNumber');
			});

			it('catches user input missing airline code', function() {
				var MOCK_BAD_USER_INPUT = {
					flightNumber: "45",
					departureDate: "Thu, Jan 17, 2013",
					confirmationNumber: "ABC123",
					note: "Ask attendent for a pillow"
				};

				var validInputResults = editView._validateUserInput(MOCK_BAD_USER_INPUT);
				expect(validInputResults[0]).toBeDefined();
				expect(validInputResults[0].message).toEqual(t.ErrorAirlineBlank);
				expect(validInputResults[0].fieldName).toEqual('airlineCode');
			});

			it('catches user input non-numeric flight number', function() {
				var MOCK_BAD_USER_INPUT = {
					airlineCode: "AA",
					flightNumber: "=asdf!",
					departureDate: "Thu, Jan 17, 2013",
					confirmationNumber: "ABC123",
					note: "Ask attendent for a pillow"
				};

				var validInputResults = editView._validateUserInput(MOCK_BAD_USER_INPUT);
				expect(validInputResults[0]).toBeDefined();
				expect(validInputResults[0].message).toEqual(t.ErrorFlightNumNumeric);
				expect(validInputResults[0].fieldName).toEqual('flightNumber');
			});
		});
	}
);