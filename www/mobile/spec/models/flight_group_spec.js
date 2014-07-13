define([
	'backbone', 'models/flight_group', 'collections/air_reservations_list', 'models/trip',
	'models/air_trip_item'],
function(
	Backbone, FlightGroupModel, AirReservationsList, TripModel,
	AirTripItemModel) {
	var flightGroupModel, airTripItemModel,
		fixtures = {response:'{"@name":"flight_group","flight_group_summary":{"confirmation_numbers":[],"departure_city":"Los Angeles International Airport","departure_airport":"LAX","arrival_airport":"JFK","arrival_city":"John F. Kennedy International Airport","travel_time_minutes":"325.0","stops":["JFK"]},"air_reservations":[{"@name":"air_reservation","flight":{"departure_terminal":"4","change_events":[],"departure_airport":{"name":"Los Angeles International Airport","city":"Los Angeles","latitude":33.9422222222222,"country_code":"US","general_location":"Los Angeles, CA","iata_code":"LAX","state_code":"CA","longitude":-118.407222222222},"aircraft":{"iata_code":"762","description":"Boeing 767-200"},"completed":false,"departure_gate":"47B","flight_number":22,"arrival_terminal":"8","estimated_duration":325,"alt_schedules_avail":true,"arrival_airport":{"name":"John F. Kennedy International Airport","city":"New York","latitude":40.6386111111111,"country_code":"US","general_location":"New York, NY","iata_code":"JFK","state_code":"NY","longitude":-73.7769444444444},"scheduled_departure":"2012-07-12T15:00:00","estimated_arrival":"2012-07-12T23:25:00","status_code":"S","arrival_status":"","extended_status_code":"S","scheduled_arrival":"2012-07-12T23:25:00","cancelled":false,"sched_duration":325,"baggage_claim":"","departure_status":"","airline":{"name":"American Airlines","phones":[{"number":"800-433-7300","@name":"phone"}],"iata_code":"AA"},"estimated_departure":"2012-07-12T15:00:00","arrival_gate":"B12"},"seat_map_url":"https://swizzle.tripcase.com/mapi/services/flight_seat_map?trip_item=41647"}]}'};

	beforeEach(function() {
		airTripItemModel = new AirTripItemModel({id:18189});
		airTripItemModel.trip = new TripModel({id:1736});
		flightGroupModel = new FlightGroupModel();
		flightGroupModel.initialize(null, {model:airTripItemModel});
	});

	describe('flight group model', function() {
		it('should handle the truth', function() {
			expect(true).toBeTruthy();
		});

		it('should exist', function() {
			expect(flightGroupModel).toBeTruthy();
		});

		describe('initializing', function() {

			beforeEach(function() {
				spyOn(flightGroupModel, 'set');
			});

			it('should initialize', function() {
				flightGroupModel.initialize();

				expect(flightGroupModel.set).not.toHaveBeenCalled();
				expect(flightGroupModel.proxy).toBeDefined();
				expect(flightGroupModel.reservations).toBeDefined();
				expect(flightGroupModel.phoneNumbers).toBeDefined();
			});

			it('should initialize with options', function() {
				flightGroupModel.initialize(null, {model:airTripItemModel, silent: true});

				expect(flightGroupModel.set)
					.toHaveBeenCalledWith(airTripItemModel.attributes, {silent: true});
			});
		});

		it('should have invalidateCache', function() {
			expect(flightGroupModel.invalidateCache).toBeTruthy();
		});

		it('should defer to the proxy to invalidateCache', function() {
			spyOn(flightGroupModel.proxy, 'invalidateCache');

			flightGroupModel.invalidateCache();

			expect(flightGroupModel.proxy.invalidateCache).toHaveBeenCalled();
		});
	});

	describe('when flight group model fetches', function() {
		var server;

		beforeEach(function() {
			server = sinon.fakeServer.create();
		});

		afterEach(function() {
			server.restore();
		});

		it('should parse attributes', function() {
			server.respondWith(
				'GET',"/mapi/trips/1736/trip_items/18189/flight_group.json",
				[ 200,{ "Content-Type": "application/json" },fixtures.response]);
			flightGroupModel.fetch();
			server.respond();
			expect(flightGroupModel.reservations instanceof AirReservationsList).toBeTruthy();
		});
	});
});
