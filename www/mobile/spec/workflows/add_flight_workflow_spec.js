define([
	'namespace',
	'factories/trip_item_factory',
	'controllers/flights_controller',
	'workflows/add_flight_workflow'
], function(
	app,
	TripItemFactory,
	FlightsController,
	AddFlightWorkflow
) {

	describe('add flight workflow', function() {
		var workflow = AddFlightWorkflow;

		beforeEach(function() {
			var controller = new FlightsController();
			controller._layout = app.getLayout('simple');

			workflow.transition('uninitialized');
			workflow.handle('initialize', {
				model: TripItemFactory.build(),
				controller: controller
			});
		});

		it('should initialize', function() {
			expect(workflow).toBeDefined();
		});

		it('should store user input', function() {
			var params = {
				airlineCode: 'aa',
				flightNumber: 123,
				departureDate: new Date(2014,1)
			};
			spyOn(workflow.flightPath, 'set');
			spyOn(workflow.flightPath, 'clear');

			workflow._userInputStore(params, {});

			expect(workflow.flightPath.clear).toHaveBeenCalled();
			expect(workflow.flightPath.set).toHaveBeenCalledWith({
				airlineName: undefined,
				airlineCode: params.airlineCode,
				flightNumber: params.flightNumber,
				departureDate: params.departureDate,
				confirmationNumber: undefined,
				for_business: false,
				note: undefined
			}, {});
		});
	});
});