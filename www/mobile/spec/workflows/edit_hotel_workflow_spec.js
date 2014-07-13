define([
	'workflows/edit_hotel_workflow',
	'workflows/add_hotel_workflow',
	'controllers/hotels_controller',
	'factories/hotel_trip_item_factory'
], function(
	workflow,
	addHotelWorkflow,
	HotelsController,
	HotelTripItemFactory
) {
	describe('Edit Hotel Workflow', function() {
		beforeEach(function() {
			var config = {
				controller: new HotelsController(),
				model: HotelTripItemFactory.build()
			};
			workflow.transition('uninitialize');
			workflow.handle('initialize', config);
		});

		describe('showingForm state', function() {
			beforeEach(function() {
				workflow.transition('showingForm');
			});

			describe('save handle', function() {
				it('should save', function() {
					spyOn(addHotelWorkflow, 'validateAndSaveHotelTripItem');

					workflow.handle('save');

					expect(addHotelWorkflow.validateAndSaveHotelTripItem).toHaveBeenCalled();
				});
				it('should handle imported hotel', function() {
					spyOn(workflow.hotel, 'isImported').andReturn(true);
					spyOn(workflow.hotel, 'set');
					spyOn(addHotelWorkflow, 'saveHotelTripItem');

					workflow.handle('save', {
						note: 'check out the pool'
					});

					expect(addHotelWorkflow.saveHotelTripItem).toHaveBeenCalled();
					expect(workflow.hotel.set).toHaveBeenCalledWith({
						note: 'check out the pool',
						for_business: false
					}, {silent: true});
				});
			});
		});
	});
});