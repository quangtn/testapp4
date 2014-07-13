define([
	'workflows/add_vehicle_workflow',
	'factories/vehicle_trip_item_factory',
	'controllers/vehicles_controller'
], function(
	AddVehicleWorkflow,
	VehicleTripItemFactory,
	VehiclesController
) {
	describe('add vehicle workflow', function() {
		var workflow = AddVehicleWorkflow;

		beforeEach(function() {
			workflow.transition('uninitialized');
			workflow.handle('initialize', {
				model: VehicleTripItemFactory.build(),
				controller: new VehiclesController()
			});
		});

		it('should initialize', function() {
			expect(workflow).toBeDefined();
		});

		describe('validate and save vehicle item', function() {
			it('should save item', function() {
				var params = {values: {
					phone_number: '927-123-1231',
					start_date: Date(),
					start_time: Date(),
					end_date: Date(),
					end_time: Date(),
					name: 'rental',
					for_business: true
				}};

				spyOn(workflow.vehicle, 'set').andCallThrough();
				spyOn(workflow, 'saveVehicleTripItem');

				workflow.validateAndSaveVehicleTripItem(params);

				expect(workflow.vehicle.set).toHaveBeenCalled();
				expect(workflow.saveVehicleTripItem).toHaveBeenCalled();
			});

			it('should not save invalid data');
			it('should handle same location');
			it('should handle manual add');
		});
	});
});