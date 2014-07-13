define([
	'factory', 'models/flight_path'
], function(
	Factory, FlightPath) {

	var FlightPathFactory = {
		build: Factory.createFactoryMethod(FlightPath, {
			airlineCode: 'aa',
			flightNumber: '23'
		})
	};

	return FlightPathFactory;
});