define([
	'strings',
	'parsers/flight_path_parser',
	'text!fixtures/mock_single_flight_path.json',
	'text!fixtures/mock_multi_stop_flight_path.json',
	'text!fixtures/mock_multiple_flight_paths.json',
	'text!fixtures/mock_shuttle_flight_path.json',
	'text!fixtures/mock_past_date_flight_path.json'],
function(
	t,
	FlightPathParser,
	MockSingleFlightPath,
	MockMultiStopFlightPath,
	MockMultipleFlightPaths,
	MockShuttleFlightPath,
	MockPastDateFlightPath) {

	describe('Flight Path Parser', function() {
		var paths, response;

		afterEach(function() {
			paths = response = null;
		});

		describe('errors', function() {
			var error = { error: [ { message: t.ErrorNoFlightsFound } ] };

			it('handles no response', function() {
				paths = FlightPathParser.parse(null);
				expect(paths).toEqual(error);
			});

			it('handles response error', function() {
				paths = FlightPathParser.parse({error: true});
				expect(paths).toEqual(error);
			});

			it('handles no flights found', function() {
				paths = FlightPathParser.parse([t.ErrorNoFlightsFound]);
				expect(paths).toEqual(error);
			});
		});

		function checkAirportInfo (airport) {
			expect(airport.city).toBeDefined();
			expect(airport.country_code).toBeDefined();
			expect(airport.departure_option).toBeDefined();
			expect(airport.general_location).toBeDefined();
			expect(airport.iata_code).toBeDefined();
			expect(airport.latitude).toBeDefined();
			expect(airport.name).toBeDefined();
			expect(airport.state_code).toBeDefined();
		}

		it('should parse single flight path', function() {
			// AA 1
			var flightPath, arrivalAirport, departureAirport;
			response = JSON.parse(MockSingleFlightPath);
			paths = FlightPathParser.parse(response);

			flightPath = paths.flight_paths[0];
			arrivalAirport = flightPath.arrival_airports[0];
			departureAirport = flightPath.departure_airport[0];

			checkAirportInfo(arrivalAirport);
			checkAirportInfo(departureAirport);

			expect(paths.flight_paths.length).toBe(1);
			expect(flightPath.arrival_airports.length).toBe(1);
			expect(arrivalAirport.iata_code).toBe('LAX');
			expect(departureAirport.iata_code).toBe('JFK');
		});

		it('should parse multi-stop flight path', function() {
			// WN 4103
			var path0, path1, path2, path3;
			response = JSON.parse(MockMultiStopFlightPath);
			paths = FlightPathParser.parse(response);
			path0 = paths.flight_paths[0];
			path1 = paths.flight_paths[1];
			path2 = paths.flight_paths[2];
			path3 = paths.flight_paths[3];

			checkAirportInfo(paths.arrivalAirport);
			checkAirportInfo(paths.departureAirport);
			expect(paths.flight_paths.length).toBe(4);

			// path 1
			expect(path0.arrival_airports.length).toBe(4);
			expect(path0.arrival_airports[0].iata_code).toBe('MCI');
			expect(path0.arrival_airports[1].iata_code).toBe('MDW');
			expect(path0.arrival_airports[2].iata_code).toBe('EWR');
			expect(path0.arrival_airports[3].iata_code).toBe('PHX');
			expect(path0.departure_airport[0].iata_code).toBe('DAL');

			// path2
			expect(path1.arrival_airports.length).toBe(3);
			expect(path1.arrival_airports[0].iata_code).toBe('MDW');
			expect(path1.arrival_airports[1].iata_code).toBe('EWR');
			expect(path1.arrival_airports[2].iata_code).toBe('PHX');
			expect(path1.departure_airport[0].iata_code).toBe('MCI');

			// path3
			expect(path2.arrival_airports.length).toBe(2);
			expect(path2.arrival_airports[0].iata_code).toBe('EWR');
			expect(path2.arrival_airports[1].iata_code).toBe('PHX');
			expect(path2.departure_airport[0].iata_code).toBe('MDW');

			// path4
			expect(path3.arrival_airports.length).toBe(1);
			expect(path3.arrival_airports[0].iata_code).toBe('PHX');
			expect(path3.departure_airport[0].iata_code).toBe('EWR');
		});

		it('should parse multiple flight paths', function() {
			// DL 275
			var path0, path1;
			response = JSON.parse(MockMultipleFlightPaths);
			paths = FlightPathParser.parse(response);
			path0 = paths.flight_paths[0];
			path1 = paths.flight_paths[1];

			checkAirportInfo(paths.arrivalAirport);
			checkAirportInfo(paths.departureAirport);
			expect(paths.flight_paths.length).toBe(2);

			// path 0
			expect(path0.arrival_airports.length).toBe(2);
			expect(path0.arrival_airports[0].iata_code).toBe('NRT');
			expect(path0.arrival_airports[1].iata_code).toBe('TPE');
			expect(path0.departure_airport[0].iata_code).toBe('DTW');

			// path 1
			expect(path1.arrival_airports.length).toBe(1);
			expect(path1.arrival_airports[0].iata_code).toBe('TPE');
			expect(path1.departure_airport[0].iata_code).toBe('NRT');
		});

		it('should parse shuttle flight path', function() {
			// UA 5307
			var path0, path1;
			response = JSON.parse(MockShuttleFlightPath);
			paths = FlightPathParser.parse(response);
			path0 = paths.flight_paths[0];
			path1 = paths.flight_paths[1];

			expect(paths.flight_paths.length).toBe(2);

			// path 0
			expect(path0.arrival_airports.length).toBe(1);
			expect(path0.arrival_airports[0].iata_code).toBe('CIC');
			expect(path0.departure_airport[0].iata_code).toBe('SFO');

			// path 1
			expect(path1.arrival_airports.length).toBe(1);
			expect(path1.arrival_airports[0].iata_code).toBe('SFO');
			expect(path1.departure_airport[0].iata_code).toBe('CIC');
		});

		it('should parse past-day timezone/past date flight path', function() {
			// UA 200, Aug 12 2013
			var path;
			response = JSON.parse(MockPastDateFlightPath);
			paths = FlightPathParser.parse(response);
			path = paths.flight_paths[0];

			expect(paths.flight_paths.length).toBe(1);
			expect(path.arrival_airports.length).toBe(2);
			expect(path.arrival_airports[0].iata_code).toBe('HNL');
			expect(path.arrival_airports[1].iata_code).toBe('IAH');
			expect(path.departure_airport[0].iata_code).toBe('GUM');
		});
	});
});