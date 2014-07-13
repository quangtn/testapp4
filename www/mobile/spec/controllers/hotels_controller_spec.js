define(['mediator', 'namespace', 'backbone', 'controllers/hotels_controller'],
	function(mediator, app, Backbone, Controller) {
		describe('hotel controller', function() {

			var controller = new Controller();

			it('can create application objects for testing', function() {
				expect(controller).toBeDefined();
			});

			it('should assign a layout', function() {
				expect(controller._layout).toBeDefined();
			});

			it('should subscribe to mediator message :show', function() {
				mediator.unsubscribe('hotels:show');
				spyOn(controller, 'show');
				controller._initSubscriptions();
				mediator.publish('hotels:show', {
					hotel: {test: 'test'}
				});
				expect(controller.show).toHaveBeenCalledWith({hotel: {test: 'test'}});
			});

		});
	});