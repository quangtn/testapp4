require(['namespace', 'backbone', 'underscore',
	'text!fixtures/mock_flight_group_response.json',
	'parsers/flight_group_parser'
],
	function(app, Backbone, _, MockFlightGroupResponseString, FlightGroupParser) {

		describe('Flight Group Parser', function() {

			var mockFlightGroupResponse, flightGroupModel;

			beforeEach(function() {
				flightGroupModel = new Backbone.Model();
				_.extend(flightGroupModel, FlightGroupParser);
				flightGroupModel.reservations = new Backbone.Collection();
				flightGroupModel.phoneNumbers = new Backbone.Collection();

				mockFlightGroupResponse = JSON.parse(MockFlightGroupResponseString);
			});

			afterEach(function() {
				flightGroupModel = null;
				mockFlightGroupResponse = null;
			});

			it('can create application objects for testing', function() {
				expect(MockFlightGroupResponseString).toBeDefined();
				expect(FlightGroupParser).toBeDefined();

				expect(mockFlightGroupResponse).toBeDefined();
				expect(flightGroupModel).toBeDefined();
				expect(flightGroupModel.parse).toBeDefined();
			});

			it('can parse top-level trip from service response', function() {
				var parsedData = flightGroupModel.parse(mockFlightGroupResponse);

				expect(parsedData).toBeDefined();
				expect(flightGroupModel.reservations).toBeDefined();
				expect(flightGroupModel.reservations.length).toBeDefined();
				expect(flightGroupModel.reservations.at(0)).toBeDefined();
			});

			it('can parse at least first reservation', function() {
				var reservation;

				flightGroupModel.parse(mockFlightGroupResponse);
				reservation = flightGroupModel.reservations.at(0);

				expect(reservation).toBeDefined();
				expect(reservation.get('aircraft_description')).toEqual('Boeing 737-800');
				expect(reservation.get('airline')).toEqual('American Airlines');
				expect(reservation.get('airline_code')).toEqual('AA');
				expect(reservation.get('alt_schedules_avail')).toEqual(true);
				expect(reservation.get('arrival_airport')).toEqual('V.C. Bird International Airport');
				expect(reservation.get('arrival_airport_code')).toEqual('ANU');
				expect(reservation.get('arrival_gate')).toEqual('');
				expect(reservation.get('arrival_status')).toEqual('');
				expect(reservation.get('arrival_terminal')).toEqual('');
				expect(reservation.get('arrival_terminal_or_gate_change')).toEqual(false);
				expect(reservation.get('baggage_claim')).toEqual('');
				expect(reservation.get('cancelled')).toEqual(false);
				expect(reservation.get('completed')).toEqual(false);
				expect(reservation.get('confirmation_number')).toEqual('HSWTFU');
				expect(reservation.get('departure_airport')).toEqual('Miami International Airport');
				expect(reservation.get('departure_airport_code')).toEqual('MIA');
				expect(reservation.get('departure_gate')).toEqual('');
				expect(reservation.get('departure_status')).toEqual('');
				expect(reservation.get('departure_terminal')).toEqual('');
				expect(reservation.get('departure_terminal_or_gate_change')).toEqual(false);
				expect(reservation.get('end_date')).toEqual('2013-06-09T13:50:00');
				expect(reservation.get('end_time')).toEqual('2013-06-09T13:50:00');
				expect(reservation.get('estimated_arrival')).toEqual('2013-06-09T13:50:00');
				expect(reservation.get('estimated_departure')).toEqual('2013-06-09T10:50:00');
				expect(reservation.get('extended_status_code')).toEqual('S');
				expect(reservation.get('flight_number')).toEqual(1907);
				expect(reservation.get('hasChangeOrCancel')).toEqual(false);
				expect(reservation.get('id')).toEqual(75941);
				expect(reservation.get('layover_minutes')).not.toBeDefined();
				expect(reservation.get('named_type')).toEqual('Air');
				expect(reservation.get('note')).not.toBeDefined();
				expect(reservation.get('num_following')).not.toBeDefined();
				expect(reservation.get('scheduled_arrival')).toEqual('2013-06-09T13:50:00');
				expect(reservation.get('scheduled_departure')).toEqual('2013-06-09T10:50:00');
				expect(reservation.get('seat_map_url')).toEqual('http://ctovm2418.dev.sabre.com/mapi/services/flight_seat_map?trip_item=75941');
				expect(reservation.get('seats').length).toEqual(1);
				expect(reservation.get('seats')[0].number).toEqual('06A');
				expect(reservation.get('start_date')).toEqual('2013-06-09T10:50:00');
				expect(reservation.get('start_time')).toEqual('2013-06-09T10:50:00');
				expect(reservation.get('status_code')).toEqual('S');
				expect(reservation.get('travel_time_minutes')).toEqual(180);
				expect(reservation.get('type')).not.toBeDefined();
			});

		});
	});