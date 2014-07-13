require(['namespace', 'backbone', 'underscore',
	'text!fixtures/mock_trip_response.json',
	'parsers/trip_parser', 'parsers/trip_item_parser'
],
	function(app, Backbone, _, mockTripResponseString, TripParser, TripItemParser) {

		describe('Air Trip Item Parser', function() {

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

			it('populates the departure airport city for display', function() {
				var airItem;

				mockTripResponse.items[0].air_reservation.flight.departure_airport.city = "Amarillo";
				tripModel.parse(mockTripResponse);

				airItem = tripModel.tripItems.at(0);
				expect(airItem.get('departure_airport_city')).toEqual('Amarillo');
			});

			it('populates the arrival airport city for display', function() {
				var airItem;

				mockTripResponse.items[0].air_reservation.flight.arrival_airport.city = "Havanna";
				tripModel.parse(mockTripResponse);

				airItem = tripModel.tripItems.at(0);
				expect(airItem.get('arrival_airport_city')).toEqual('Havanna');
			});

			it("populates the baggage claim change flag true", function() {
				var airItem;
				mockTripResponse.items[0].air_reservation.flight.change_events = [{
					'@name': 'event',
					'name': 'baggage_claim'
				}];

				tripModel.parse(mockTripResponse);

				airItem = tripModel.tripItems.at(0);
				expect(airItem.get('baggage_claim_change')).toBe(true);
			});

			it("populates the baggage claim change flag false", function() {
				var airItem;
				mockTripResponse.items[0].air_reservation.flight.change_events = [{
					'@name': 'event',
					'name': 'arrival_gate'
				}];

				tripModel.parse(mockTripResponse);

				airItem = tripModel.tripItems.at(0);
				expect(airItem.get('baggage_claim_change')).toBe(false);
			});

			it("populates the departure gate change flag true", function() {
				var airItem;
				mockTripResponse.items[0].air_reservation.flight.change_events = [{
					'@name': 'event',
					'name': 'departure_gate'
				}];

				tripModel.parse(mockTripResponse);

				airItem = tripModel.tripItems.at(0);
				expect(airItem.get('departure_terminal_or_gate_change')).toBe(true);
			});

			it("populates the departure gate change flag false", function() {
				var airItem;
				mockTripResponse.items[0].air_reservation.flight.change_events = [{
					'@name': 'event',
					'name': 'arrival_gate'
				}];

				tripModel.parse(mockTripResponse);

				airItem = tripModel.tripItems.at(0);
				expect(airItem.get('departure_terminal_or_gate_change')).toBe(false);
			});

			it("populates the departure terminal change flag true", function() {
				var airItem;
				mockTripResponse.items[0].air_reservation.flight.change_events = [{
					'@name': 'event',
					'name': 'departure_terminal'
				}];

				tripModel.parse(mockTripResponse);

				airItem = tripModel.tripItems.at(0);
				expect(airItem.get('departure_terminal_or_gate_change')).toBe(true);
			});

			it("populates the departure terminal change flag false", function() {
				var airItem;
				mockTripResponse.items[0].air_reservation.flight.change_events = [{
					'@name': 'event',
					'name': 'arrival_gate'
				}];

				tripModel.parse(mockTripResponse);

				airItem = tripModel.tripItems.at(0);
				expect(airItem.get('departure_terminal_or_gate_change')).toBe(false);
			});

			it("populates the arrival gate change flag true", function() {
				var airItem;
				mockTripResponse.items[0].air_reservation.flight.change_events = [{
					'@name': 'event',
					'name': 'arrival_gate'
				}];

				tripModel.parse(mockTripResponse);

				airItem = tripModel.tripItems.at(0);
				expect(airItem.get('arrival_terminal_or_gate_change')).toBe(true);
			});

			it("populates the arrival gate change flag false", function() {
				var airItem;
				mockTripResponse.items[0].air_reservation.flight.change_events = [{
					'@name': 'event',
					'name': 'departure_gate'
				}];

				tripModel.parse(mockTripResponse);

				airItem = tripModel.tripItems.at(0);
				expect(airItem.get('arrival_terminal_or_gate_change')).toBe(false);
			});

			it("populates the departure terminal change flag true", function() {
				var airItem;
				mockTripResponse.items[0].air_reservation.flight.change_events = [{
					'@name': 'event',
					'name': 'arrival_terminal'
				}];

				tripModel.parse(mockTripResponse);

				airItem = tripModel.tripItems.at(0);
				expect(airItem.get('arrival_terminal_or_gate_change')).toBe(true);
			});

			it("populates the arrival terminal change flag false", function() {
				var airItem;
				mockTripResponse.items[0].air_reservation.flight.change_events = [{
					'@name': 'event',
					'name': 'departure_gate'
				}];

				tripModel.parse(mockTripResponse);

				airItem = tripModel.tripItems.at(0);
				expect(airItem.get('arrival_terminal_or_gate_change')).toBe(false);
			});

			it('can create application objects for testing', function() {
				expect(mockTripResponseString).toBeDefined();
				expect(TripParser).toBeDefined();

				expect(mockTripResponse).toBeDefined();
				expect(tripModel).toBeDefined();
				expect(tripModel.parse).toBeDefined();
			});

			it('can parse air trip item (outbound) from trip service response', function() {
				var airItem;

				tripModel.parse(mockTripResponse);

				airItem = tripModel.tripItems.at(0);
				expect(airItem).toBeDefined();
				expect(airItem.get('aircraft_description')).toEqual('Boeing 737-800');
				expect(airItem.get('airline')).toEqual('American Airlines');
				expect(airItem.get('airline_code')).toEqual('AA');
				expect(airItem.get('alt_schedules_avail')).toEqual(true);
				expect(airItem.get('arrival_airport_name')).toEqual('V.C. Bird International Airport');
				expect(airItem.get('arrival_airport_city')).toEqual('Antigua');
				expect(airItem.get('arrival_airport_code')).toEqual('ANU');
				expect(airItem.get('arrival_gate')).toEqual('');
				expect(airItem.get('arrival_status')).toEqual('');
				expect(airItem.get('arrival_terminal')).toEqual('');
				expect(airItem.get('arrival_terminal_or_gate_change')).toEqual(false);
				expect(airItem.get('calendar_end')).toEqual('2013-06-09T13:50:00');
				expect(airItem.get('calendar_end_timezone_name')).toEqual('America/Antigua');
				expect(airItem.get('calendar_start')).toEqual('2013-06-09T10:50:00');
				expect(airItem.get('calendar_start_timezone_name')).toEqual('America/New_York');
				expect(airItem.get('cancelled')).toEqual(false);
				expect(airItem.get('completed')).toEqual(false);
				expect(airItem.get('confirmation_number')).toEqual('HSWTFU');
				expect(airItem.get('departure_airport_name')).toEqual('Miami International Airport');
				expect(airItem.get('departure_airport_city')).toEqual('Miami');
				expect(airItem.get('departure_airport_code')).toEqual('MIA');
				expect(airItem.get('departure_gate')).toEqual('');
				expect(airItem.get('departure_status')).toEqual('');
				expect(airItem.get('departure_terminal')).toEqual('');
				expect(airItem.get('departure_terminal_or_gate_change')).toEqual(false);
				expect(airItem.get('end_date')).toEqual('2013-06-09T13:50:00');
				expect(airItem.get('end_time')).toEqual('2013-06-09T13:50:00');
				expect(airItem.get('estimated_arrival')).toEqual('2013-06-09T13:50:00');
				expect(airItem.get('estimated_departure')).toEqual('2013-06-09T10:50:00');
				expect(airItem.get('extended_status_code')).toEqual('S');
				expect(airItem.get('flight_number')).toEqual(1907);
				expect(airItem.get('hasChangeOrCancel')).toEqual(false);
				expect(airItem.get('id')).toEqual(75941);
				expect(airItem.get('is_trip_active')).toEqual(true);
				expect(airItem.get('itinerary_locator')).toEqual('HSWTFU');
				expect(airItem.get('itinerary_ref')).toEqual('0');
				expect(airItem.get('named_type')).toEqual('Air');
				expect(airItem.get('note')).toEqual('');
				expect(airItem.get('num_following')).toEqual(0);
				expect(airItem.get('read_only')).toEqual(true);
				expect(airItem.get('scheduled_arrival')).toEqual('2013-06-09T13:50:00');
				expect(airItem.get('scheduled_departure')).toEqual('2013-06-09T10:50:00');
				expect(airItem.get('seat_map_url')).toEqual('http://ctovm2418.dev.sabre.com/mapi/services/flight_seat_map?trip_item=75941');
				expect(airItem.get('seat_number')).toEqual('06A');
				expect(airItem.get('start_date')).toEqual('2013-06-09T10:50:00');
				expect(airItem.get('start_time')).toEqual('2013-06-09T10:50:00');
				expect(airItem.get('status_code')).toEqual('S');
				expect(airItem.get('trip_id')).toEqual(19674);
				expect(airItem.get('type')).toEqual('Air');
			});

			it('can parse air trip item (inbound) from trip service response', function() {
				var airItem;

				tripModel.parse(mockTripResponse);

				airItem = tripModel.tripItems.at(5);
				expect(airItem).toBeDefined();
				expect(airItem.get('aircraft_description')).toEqual('Boeing 737-800');
				expect(airItem.get('airline')).toEqual('American Airlines');
				expect(airItem.get('airline_code')).toEqual('AA');
				expect(airItem.get('alt_schedules_avail')).toEqual(true);
				expect(airItem.get('arrival_airport_name')).toEqual('Miami International Airport');
				expect(airItem.get('arrival_airport_city')).toEqual('Miami');
				expect(airItem.get('arrival_airport_code')).toEqual('MIA');
				expect(airItem.get('arrival_gate')).toEqual('');
				expect(airItem.get('arrival_status')).toEqual('');
				expect(airItem.get('arrival_terminal')).toEqual('');
				expect(airItem.get('arrival_terminal_or_gate_change')).toEqual(false);
				expect(airItem.get('calendar_end')).toEqual('2013-06-15T18:40:00');
				expect(airItem.get('calendar_end_timezone_name')).toEqual('America/New_York');
				expect(airItem.get('calendar_start')).toEqual('2013-06-15T15:10:00');
				expect(airItem.get('calendar_start_timezone_name')).toEqual('America/Antigua');
				expect(airItem.get('cancelled')).toEqual(false);
				expect(airItem.get('completed')).toEqual(false);
				expect(airItem.get('confirmation_number')).toEqual('HSWTFU');
				expect(airItem.get('departure_airport_name')).toEqual('V.C. Bird International Airport');
				expect(airItem.get('departure_airport_city')).toEqual('Antigua');
				expect(airItem.get('departure_airport_code')).toEqual('ANU');
				expect(airItem.get('departure_gate')).toEqual('');
				expect(airItem.get('departure_status')).toEqual('');
				expect(airItem.get('departure_terminal')).toEqual('');
				expect(airItem.get('departure_terminal_or_gate_change')).toEqual(false);
				expect(airItem.get('end_date')).toEqual('2013-06-15T18:40:00');
				expect(airItem.get('end_time')).toEqual('2013-06-15T18:40:00');
				expect(airItem.get('estimated_arrival')).toEqual('2013-06-15T18:40:00');
				expect(airItem.get('estimated_departure')).toEqual('2013-06-15T15:10:00');
				expect(airItem.get('extended_status_code')).toEqual('S');
				expect(airItem.get('flight_number')).toEqual(1906);
				expect(airItem.get('hasChangeOrCancel')).toEqual(false);
				expect(airItem.get('id')).toEqual(75942);
				expect(airItem.get('is_trip_active')).toEqual(true);
				expect(airItem.get('itinerary_locator')).toEqual('HSWTFU');
				expect(airItem.get('itinerary_ref')).toEqual('0');
				expect(airItem.get('named_type')).toEqual('Air');
				expect(airItem.get('note')).toEqual('');
				expect(airItem.get('num_following')).toEqual(0);
				expect(airItem.get('read_only')).toEqual(true);
				expect(airItem.get('scheduled_arrival')).toEqual('2013-06-15T18:40:00');
				expect(airItem.get('scheduled_departure')).toEqual('2013-06-15T15:10:00');
				expect(airItem.get('seat_number')).toEqual('06A');
				expect(airItem.get('seat_map_url')).toEqual('http://ctovm2418.dev.sabre.com/mapi/services/flight_seat_map?trip_item=75942');
				expect(airItem.get('start_date')).toEqual('2013-06-15T15:10:00');
				expect(airItem.get('start_time')).toEqual('2013-06-15T15:10:00');
				expect(airItem.get('status_code')).toEqual('S');
				expect(airItem.get('trip_id')).toEqual(19674);
				expect(airItem.get('type')).toEqual('Air');
			});

		});
	}
);