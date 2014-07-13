define(['namespace', 'jquery', 'backbone', 'underscore', 'mediator',
		'views/maps/map_view', 'trips_manager'],
	function(app, $, Backbone, _, mediator, MapView, TripsManager) {

		var mapModel, mapView;
		var fakeElEvent, fakeTrip;


		describe('Map View', function() {

			beforeEach(function() {
				mapModel = new Backbone.Model({itemId: '123'});
				mapView = new MapView({model: mapModel});

				fakeElEvent = {
					preventDefault: function() {
						$.noop();
					}
				};

				fakeTrip = new Backbone.Model({
					itemId: '789'
				});
				fakeTrip.tripItems = {
					get: function() {
						return 1234;
					}
				};
			});


			afterEach(function() {
				mapView = null;
				mapModel = null;
				fakeElEvent = null;
				fakeTrip = null;
			});


			it('publishes proper call message when "call" button is pressed', function() {
				spyOn(TripsManager, 'getCurrentTrip').andCallFake(function() {
					return fakeTrip;
				});

				spyOn(mediator, 'publish').andCallFake(function(message, params) {
					expect(message).toBe('phone_numbers:showPhoneNumbers');
					expect(params).toBeDefined();
					expect(params).toEqual(1234);
				});

				mapView.onCall(fakeElEvent);
			});


			it('publishes proper directions message when "directions" button is pressed', function() {
				spyOn(TripsManager, 'getCurrentTrip').andCallFake(function() {
					return fakeTrip;
				});

				spyOn(mediator, 'publish').andCallFake(function(message, params) {
					expect(message).toBe('map:directions');
					expect(params).toBeDefined();
					expect(params.itemId).toEqual("123");
					expect(params.isFromMapPopup).toEqual(true);
				});

				mapView.onDirections(fakeElEvent);
			});

		});
	});