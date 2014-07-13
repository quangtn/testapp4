define(['app', 'mediator', 'namespace', 'jquery', 'trips_manager'],
	function(App, mediator, app, $, TripsManager) {

		describe('App', function() {

			it('should exist', function() {
				expect(App).toBeTruthy();
			});

			it('should have an initializer', function() {
				expect(App.initialize).toBeTruthy();
			});

			describe('when initializing', function() {

				it('should subscribe to the device:resume event', function() {
					spyOn(mediator, 'subscribe').andReturn(true);
					App.initAppEventSubscriptions();
					expect(mediator.subscribe).toHaveBeenCalledWith(
						'device:resume', jasmine.any(Function)
					);
				});

			});

			describe('resume', function() {

				it('should exist', function() {
					expect(App.resume).toBeTruthy();
				});

				it('should invalidate the trips cache every time', function() {
					mediator.unsubscribe();
					App.initAppEventSubscriptions();
					spyOn(TripsManager, 'invalidateCache');
					spyOn(TripsManager, 'getCurrentTrip').andReturn(undefined);
					mediator.publish('device:resume');
					expect(TripsManager.invalidateCache).toHaveBeenCalled();
				});

				it('should invalidate the current trip, if there is one', function() {
					mediator.unsubscribe();
					App.initAppEventSubscriptions();
					var currentTrip = {
						invalidateCache: function() {}
					};
					spyOn(currentTrip, 'invalidateCache');
					spyOn(TripsManager, 'getCurrentTrip').andReturn(currentTrip);
					mediator.publish('device:resume');
					expect(currentTrip.invalidateCache).toHaveBeenCalled();
				});

			});

		});
	});
