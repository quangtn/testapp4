define(['backbone', 'presenters/flight_group_presenter', 'models/trip',
	'models/air_trip_item', 'models/flight_group'
],
	function(Backbone, Presenter, TripModel, AirTripItemModel, FlightGroupModel) {

		var presenter;


		beforeEach(function() {
			var trip = new TripModel({id: 26});
			var airTripItemModel = new AirTripItemModel({id: 92});
			var flightGroupModel = new FlightGroupModel();

			airTripItemModel.trip = trip;
			flightGroupModel.initialize(null, {model: airTripItemModel});
			flightGroupModel.set('reservations', []);
			flightGroupModel.set('stops', ["PDX", "ATL"]);
			flightGroupModel.set('create_source', 'worldmate');

			spyOn(flightGroupModel.reservations, 'toJSON').andCallFake(function() {
				var mockedReservation = [{
					aircraft_description: "De Havilland Canada DHC-8-400 Dash 8Q",
					airline: "Alaska Airlines",
					airline_code: "AS",
					arrival_airport: "Portland International Airport",
					arrival_airport_city: "Portland",
					arrival_airport_code: "PDX",
					arrival_airport_general_location: "Portland, OR",
					arrival_airport_name: "Portland International Airport",
					departure_airport: "Eugene Airport",
					departure_airport_city: "Eugene",
					departure_airport_code: "EUG",
					departure_airport_name: "Eugene Airport",
					end_date: "2014-04-19T05:50:00",
					end_time: "2014-04-19T05:50:00",
					estimated_arrival: "2014-04-19T05:50:00",
					estimated_departure: "2014-04-19T05:10:00",
					flight_number: 2330,
					id: 92,
					named_type: "Air",
					scheduled_arrival: "2014-04-19T05:50:00",
					scheduled_departure: "2014-04-19T05:10:00",
					seat_map_url: "http://local.tripcase.com:3000/mapi/services/flight_seat_map?trip_item=92",
					seats: [{
						number: "07A"
					}],
					start_date: "2014-04-19T05:10:00",
					start_time: "2014-04-19T05:10:00",
					travel_time_minutes: 40
				}];

				return mockedReservation;
			});

			presenter = new Presenter({flightGroup: flightGroupModel});
		});


		describe('Flight Group Presenter', function() {
			it('should exist', function() {
				expect(presenter).toBeTruthy();
			});

			it('should contain number of stops', function() {
				expect(presenter.number_of_stops > 0).toBeTruthy();
			});

			it('should have world mate value', function() {
				expect(presenter.isWorldMate).toBeDefined();
			});

			it('should have a flight detail mini-menu', function() {
				expect(presenter.detailMenuItems).toBeDefined();
				expect(presenter.detailMenuItems.length).toEqual(2);
			});

			describe('should have a flight reservation containing', function() {
				it('seats', function() {
					expect(presenter.air_reservations[0].seats.length > 0).toBeTruthy();
				});

				it('aircraft_description', function() {
					expect(presenter.air_reservations[0].aircraft_description).toBeDefined();
				});

				it('airline', function() {
					expect(presenter.air_reservations[0].airline).toBeDefined();
				});

				it('airline_code', function() {
					expect(presenter.air_reservations[0].airline_code).toBeDefined();
				});

				it('flight_number', function() {
					expect(presenter.air_reservations[0].flight_number).toBeDefined();
				});

				it('travel_time_minutes', function() {
					expect(presenter.air_reservations[0].travel_time_minutes).toBeDefined();
				});

				it('scheduled_departure', function() {
					expect(presenter.air_reservations[0].scheduled_departure).toBeDefined();
				});

				it('departure_airport', function() {
					expect(presenter.air_reservations[0].departure_airport).toBeDefined();
				});

				it('departure_airport_code', function() {
					expect(presenter.air_reservations[0].departure_airport_code).toBeDefined();
				});

				it('scheduled_arrival', function() {
					expect(presenter.air_reservations[0].scheduled_arrival).toBeDefined();
				});

				it('arrival_airport', function() {
					expect(presenter.air_reservations[0].arrival_airport).toBeDefined();
				});

				it('arrival_airport_code', function() {
					expect(presenter.air_reservations[0].arrival_airport_code).toBeDefined();
				});
			});
		});



	});
