define([
	'namespace',
	'mediator',
	'backbone',
	'models/trip',
	'controllers/ui/header_controller',
	'collections/trips',
	'trips_manager'
], function(app, mediator, Backbone, Trip, HeaderController, Trips, TripsManager) {

	describe('Header Controller', function() {
		var controller;

		beforeEach(function() {
			controller = new HeaderController();
		});

		it('should exist', function() {
			expect(controller).toBeTruthy();
		});

		describe('when initializing', function() {


			beforeEach(function() {
				spyOn(mediator, 'subscribe').andReturn(true);
				controller = new HeaderController();
			});

			it('should subscribe to trips index event', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith(
					'trips:index', jasmine.any(Function)
				);
			});

			it('should subscribe to trip items feed change event', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith(
					'trip_items:feed:change', jasmine.any(Function)
				);
			});

			it('should subscribe to accept terms of service prompt to show itself', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('terms:prompt', controller.show);
			});

		});

		it('should call onTripItemChange() when trip_items:feed:change is fired', function() {
			mediator.unsubscribe();
			spyOn(HeaderController.prototype, 'onTripItemChange');
			var controller = new HeaderController();

			mediator.publish('trip_items:feed:change');

			expect(HeaderController.prototype.onTripItemChange).toHaveBeenCalled();
		});

		describe('trip item change handler', function() {

			it('should call set trip items header', function() {
				var trips = new Trips();
				spyOn(controller, 'setTripItemsHeader');
				spyOn(TripsManager, 'getTrips').andReturn(trips);
				spyOn(trips, 'get').andReturn({});
				controller.onTripItemChange({ tripId: 123 });
				expect(controller.setTripItemsHeader)
					.toHaveBeenCalledWith(jasmine.any(Object));
			});

			it('should not set the header if no trip id', function() {
				spyOn(controller, 'setTripItemsHeader');
				controller.onTripItemChange({});
				expect(controller.setTripItemsHeader).not.toHaveBeenCalled();
			});

		});

		describe('refresh message getter', function() {

			it('returns feed when on the feed view', function() {
				var fakeTrip = {
					getTripFeedView: function() {
						return true;
					}
				};
				expect(HeaderController.prototype.getRefreshMessage(fakeTrip))
					.toEqual('tripFeed:refresh');
			});

			it('returns itinerary when not on the feed view', function() {
				var fakeTrip = {
					getTripFeedView: function() {
						return false;
					}
				};
				var controller = new HeaderController();
				expect(HeaderController.prototype.getRefreshMessage(fakeTrip))
					.toEqual('itinerary:refresh');
			});

		});

		describe('trip items header setter', function() {
			var fakeTrip, tripAttributes;

			beforeEach(function() {
				tripAttributes = {
					name: 'lorem ipsum',
					start_time: '2011-01-15T12:00:00',
					end_time: '2011-02-20T13:00:00',
					traveler_name: 'joe nonsense'
				};
				fakeTrip = new Backbone.Model(tripAttributes);
				fakeTrip.getTripFeedView = function() { return true; };
				fakeTrip.isFollowing = function() { return false; };
			});

			it('should call show', function() {
				spyOn(controller, 'show');
				controller.setTripItemsHeader(fakeTrip);
				expect(controller.show).toHaveBeenCalledWith({
					subtitleText: 'Sat Jan 15 - Sun Feb 20',
					titleText: 'lorem ipsum',
					travelerName: 'joe nonsense',
					isFollowingTrip: false,
					isTallHeader: false,
					leftButtons: [{
						name: 'menu',
						iconClass: 'btn_icon_menu_25px button-icon',
						action: 'sidemenu:toggle'
					}],
					rightButtons: [{
						name: 'trip-item-refresh',
						iconURL: 'button-icon btn_icon_refresh_25px',
						action: 'tripFeed:refresh'
					}]
				});
			});

			it('should handle following trip', function() {
				fakeTrip = new Trip(tripAttributes).set('isFollowing', true);
				spyOn(controller, 'show');

				controller.setTripItemsHeader(fakeTrip, true);

				expect(controller.show).toHaveBeenCalledWith({
					subtitleText: 'Sat Jan 15 - Sun Feb 20',
					titleText: 'lorem ipsum',
					travelerName: 'joe nonsense',
					isFollowingTrip: true,
					isTallHeader: true,
					leftButtons: [{
						name: 'menu',
						iconClass: 'btn_icon_menu_25px button-icon',
						action: 'sidemenu:toggle'
					}],
					rightButtons: [{
						name: 'trip-item-refresh',
						iconURL: 'button-icon btn_icon_refresh_25px',
						action: 'itinerary:refresh'
					}]
				});
			});
		});
	});
});
