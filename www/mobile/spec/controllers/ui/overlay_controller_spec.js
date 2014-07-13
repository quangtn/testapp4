define(['namespace', 'jquery', 'backbone', 'mediator', 'controllers/ui/overlay_controller'],
	function(app, $, Backbone, mediator, OverlayController) {

		describe('Overlay Controller', function() {
			var controller = new OverlayController(),
				params = {
					templateFilename: 'overlay_create_trip',
					storageKeyName: 'create_trip',
					analyticsEvent: 'CreateTrip'
				};

			beforeEach(function() {
				localStorage.clear();
			});

			it('should exist', function() {
				expect(OverlayController).toBeDefined();
			});

			it('should initialize', function() {
				expect(controller).toBeDefined();
			});

			it('should set overlay displayed flag', function() {
				controller._setOverlayWasSeen(params.storageKeyName);
				expect(localStorage.getItem(params.storageKeyName));
			});

			it('should check overlay was displayed previously', function() {
				controller._setOverlayWasSeen(params.storageKeyName);
				var wasSeen = controller._wasOverlayEverSeen(params.storageKeyName);
				expect(wasSeen).toBe(true);
			});

			it('should check overlay was not displayed previously', function() {
				var wasSeen = controller._wasOverlayEverSeen(params.storageKeyName);
				expect(wasSeen).toBe(false);
			});

			it('should show overlay first time', function() {
				spyOn(controller, '_renderView').andCallThrough();

				controller.onShow(params);
				expect(controller._renderView.calls.length).toEqual(1);
			});

			it('should not show overlay after first time', function() {
				spyOn(controller, '_renderView').andCallThrough();

				controller.onShow(params);  // first time overlay display attempt
				controller.onShow(params);  // second time overlay display attempt
				expect(controller._renderView.calls.length).toEqual(1);
			});
		});
	});