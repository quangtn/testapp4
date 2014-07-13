define([
	'workflows/edit_vehicle_workflow',
	'workflows/add_vehicle_workflow',
	'controllers/vehicles_controller',
	'factories/vehicle_trip_item_factory'
], function(
	workflow,
	addVehicleWorkflow,
	VehiclesController,
	VehicleTripItemFactory
) {
	describe('edit vehicle workflow', function() {
		beforeEach(function() {
			var config = {
				controller: new VehiclesController(),
				model: VehicleTripItemFactory.build()
			};

			workflow.transition('uninitialized');
			workflow.handle('initialize', config);
		});

		describe('showingForm state', function() {
			describe('save handler', function() {
				it('should save', function() {
					spyOn(addVehicleWorkflow, 'validateAndSaveVehicleTripItem');

					workflow.handle('save');

					expect(addVehicleWorkflow.validateAndSaveVehicleTripItem).toHaveBeenCalled();
				});
				it('should save imported vehicle', function() {
					spyOn(workflow.vehicle, 'isImported').andReturn(true);
					spyOn(workflow.vehicle, 'set');
					spyOn(addVehicleWorkflow, 'saveVehicleTripItem');

					workflow.handle('save', {
						note: 'sweet Audi, bro',
						for_business: true
					});

					expect(workflow.vehicle.set).toHaveBeenCalledWith({
						note: 'sweet Audi, bro',
						for_business: true
					}, {silent: true});
					expect(addVehicleWorkflow.saveVehicleTripItem).toHaveBeenCalled();
				});
			});
		});
	});
});