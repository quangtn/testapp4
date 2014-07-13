define([
	'workflows/add_hotel_workflow',
	'factories/hotel_trip_item_factory',
	'controllers/hotels_controller'
], function(
	AddHotelWorkflow,
	HotelTripItemFactory,
	HotelController
) {
	describe('add hotel workflow', function() {
		var workflow = AddHotelWorkflow;

		beforeEach(function() {
			workflow.transition('uninitialized');
			workflow.handle('initialize', {
				model: HotelTripItemFactory.build(),
				controller: new HotelController()
			});
		});

		it('should initialize', function() {
			expect(workflow).toBeDefined();
		});

		describe('validating and saving hotel data', function() {
			it('should save hotel data', function() {
				var date = new Date(2014,1),
					params = {
						start_date: date,
						start_time: date,
						end_date: date,
						end_time: date,
					};
				spyOn(workflow.hotel, 'set').andCallThrough();
				spyOn(workflow, 'saveHotelTripItem');
				workflow.hotel.isManualAdd = true;

				workflow.validateAndSaveHotelTripItem(params, {});

				expect(workflow.saveHotelTripItem).toHaveBeenCalled();
				expect(workflow.hotel.set).toHaveBeenCalledWith({
					start_date: '2014-02-01T01:00:00',
					start_time: '2014-02-01T01:00:00',
					end_date: '2014-02-01T01:00:00',
					end_time: '2014-02-01T01:00:00',
					confirmation_number: undefined,
					phone_number: undefined,
					for_business: false,
					note: undefined
				}, {
					changes : { start_date : true, start_time : true, end_date : true, end_time : true, confirmation_number : true, for_business : true, note : true }
				});
			});

			it('should handle invalid data');
		});
	});
});