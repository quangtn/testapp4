define([
	'factories/flight_path_factory',
	'models/flight_path'],
function(
	FlightPathFactory,
	FlightPath) {
	describe('Flight Path', function() {
		var model;

		beforeEach(function() {
			model = new FlightPath();
		});

		it('should initialize', function() {
			expect(model).toBeTruthy();
		});
	});
});