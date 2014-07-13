define(['workflows/add_vehicle_workflow', 'mediator', 'namespace', 'backbone',
	'controllers/vehicles_controller'],
	function(addVehicleWorkflow, mediator, app, Backbone, Controller) {

		describe('vehicle controller', function() {
			app.router = {
				navigate: jasmine.createSpy()
			};
			var controller = new Controller();


			it('can create application objects for testing', function() {
				expect(controller).toBeDefined();
			});

			describe('initializing', function() {
				it('should subscribe to channel add', function() {
					mediator.unsubscribe('vehicles:add');
					spyOn(controller, 'add');
					controller._initSubscriptions();
					mediator.publish('vehicles:add', {
						tripId: 'test'
					});
					expect(controller.add).toHaveBeenCalled();
				});
			});

			describe('when adding', function() {
				controller = new Controller();

				it('should initialize addCarWorkFlow', function() {
					spyOn(addVehicleWorkflow, 'handle');
					controller.add({
						tripId: 'test'
					});
					expect(addVehicleWorkflow.handle).toHaveBeenCalledWith('initialize', {
						model: controller.model,
						controller: controller
					});
				});
			});
		});
	});