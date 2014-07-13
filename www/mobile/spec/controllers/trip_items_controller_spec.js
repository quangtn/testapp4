define([
	'backbone', 'mediator', 'trips_manager',
	'controllers/trip_items_controller', 'models/trip', 'namespace'
], function(
	Backbone, mediator, TripsManager,
	TripItemsController, Trip, app
) {

	describe('Trip Items Controller', function() {
		var controller;

		beforeEach(function() {
			controller = new TripItemsController();
			controller.model = new Trip();
		});

		it('should exist', function() {
			expect(controller).toBeTruthy();
		});

		it('should call _initSubscriptions', function() {
			spyOn(TripItemsController.prototype, '_initSubscriptions');
			controller = new TripItemsController();
			expect(TripItemsController.prototype._initSubscriptions).toHaveBeenCalled();
		});

		describe('when initializing', function() {

			beforeEach(function() {
				spyOn(mediator, 'subscribe').andReturn(true);
				controller = new TripItemsController();
			});

			it('should subscribe to trip_items:index', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('trip_items:index', jasmine.any(Function));
			});

			it('should subscribe to trip_items:add', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('trip_items:add', jasmine.any(Function));
			});

			it('should subscribe to trip_items:show', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('trip_items:show', jasmine.any(Function));
			});

			it('should subscribe to trip_items:feed', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('trip_items:feed', jasmine.any(Function));
			});

			it('should subscribe to itinerary:refresh', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('itinerary:refresh', jasmine.any(Function), jasmine.any(Object));
			});

			it('should subscribe to tripFeed:refresh', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('tripFeed:refresh', jasmine.any(Function), jasmine.any(Object));
			});

			it('should subscribe to device:resume', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('device:resume', jasmine.any(Function));
			});

			it('should subscribe to following_trip_items:index', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('following_trip_items:index', jasmine.any(Function));
			});
		});

		it('should refresh trip and messesages on device resume', function() {
			spyOn(controller, 'isInView').andReturn(true);
			spyOn(controller.model, 'fetch');
			spyOn(controller.model.messages, 'fetch');
			controller.tripCardView = {
				isInView : jasmine.createSpy('isInView').andReturn(true)
			};

			controller.resume();

			expect(controller.model.fetch).toHaveBeenCalled();
			expect(controller.model.messages.fetch).toHaveBeenCalled();
		});

		it('should refresh timeline', function() {
			spyOn(TripsManager, 'getCurrentTrip').andReturn(controller.model);
			spyOn(app, 'isOnline').andReturn(true);
			spyOn(controller.model, 'fetch');

			controller.onItineraryRefresh();

			expect(controller.model.fetch).toHaveBeenCalled();
		});

		describe('refresh tripfeed', function() {
			beforeEach(function() {
				spyOn(app, 'isOnline').andReturn(true);
				spyOn(controller.model, 'fetch');
				spyOn(controller.model.messages, 'fetch');
			});

			it('should fetch trip and messages', function() {
				controller.onTripFeedRefresh();

				expect(controller.model.fetch).toHaveBeenCalledWith({isToRefresh: true});
				expect(controller.model.messages.fetch).toHaveBeenCalledWith({isToRefresh: true});
			});

			it('should not fetch messages for legacy app', function() {
				spyOn(controller.model.messages, 'isLegacy').andReturn(true);

				controller.onTripFeedRefresh();

				expect(controller.model.messages.fetch).not.toHaveBeenCalled();
			});
		});

		describe('Index', function() {
			var fakeTrip;
			beforeEach(function() {
				fakeTrip = new Trip();
				controller = new TripItemsController();
				controller.model = fakeTrip;
			});

			it('should show feed view if user explicitly said so', function() {
				spyOn(fakeTrip, 'getTripFeedView').andReturn(true);
				spyOn(controller, 'feed');
				spyOn(controller, 'itinerary');

				controller._goToBestView({tripId: '123'});

				expect(controller.feed).toHaveBeenCalled();
			});

			it('should show itinerary view if user explicitly said so', function() {
				spyOn(fakeTrip, 'getTripFeedView').andReturn(false);
				spyOn(controller, 'itinerary');
				spyOn(controller, 'feed');

				controller._goToBestView({tripId: '123'});

				expect(controller.itinerary).toHaveBeenCalled();
			});

			it('should show feed view if user never explicitly selected either', function() {
				spyOn(fakeTrip, 'getTripFeedView');
				spyOn(controller, 'feed');
				spyOn(controller, 'itinerary');

				controller._goToBestView({tripId: '123'});

				expect(controller.feed).toHaveBeenCalled();
			});
		});

		describe('following index', function() {
			var tripId, model;

			beforeEach(function() {
				tripId = controller.tripId;
				model = controller.model;
			});

			afterEach(function() {
				controller.tripId = tripId;
				controller.model = model;
			});

			it('should handle app flow', function() {
				var params = {tripId: 10};
				spyOn(TripsManager.getFollowingTrips(), 'isEmpty').andReturn(false);
				spyOn(TripsManager.getFollowingTrips(), 'get').andReturn(true);
				spyOn(controller, 'showFollowingIndex');

				controller.followingIndex(params);

				expect(controller.tripId).toEqual(params.tripId);
				expect(TripsManager.getFollowingTrips().get).toHaveBeenCalledWith(controller.tripId);
				expect(controller.showFollowingIndex).toHaveBeenCalled();
			});

			it('should handle URL load flow', function() {
				var params = {tripId: 10};
				spyOn(TripsManager.getFollowingTrips(), 'isEmpty').andReturn(true);
				spyOn(controller, 'showLoading');
				spyOn(controller, 'showFollowingIndex');

				spyOn(TripsManager.getFollowingTrips(), 'fetch').andCallFake(function(callback) {
					var trips = {get: function() {return true;}};
					callback.success(trips);

					expect(callback.localCache).toBeFalsy();
					expect(callback.fetchAllTrips).toBeTruthy();
					expect(controller.showFollowingIndex).toHaveBeenCalledWith(true, params);
				});

				controller.followingIndex(params);
			});
		});

		describe('showing following index', function() {
			beforeEach(function(){
				spyOn(mediator, 'publish');
			});

			it('should show a trip', function() {
				var trip = new Backbone.Model({id: 34});
				spyOn(controller, 'itinerary');

				controller.showFollowingIndex(trip, true);

				expect(mediator.publish).toHaveBeenCalledWith('following_trip_header:index', trip);
				expect(controller.model).toBe(trip);
				expect(controller.itinerary).toHaveBeenCalledWith(true);
			});

			it('should not show a nonexistent trip', function() {
				var trip;

				controller.showFollowingIndex(trip);

				expect(mediator.publish).toHaveBeenCalledWith('trips:index');
			});
		});

		describe('set feed view', function() {
			it('should display feed view', function() {
				spyOn(controller, '_doesModelHaveTripItems').andReturn(true);
				spyOn(controller.model.messages, 'fetch');

				if (!app.getLayout.andReturn) {
					spyOn(app, 'getLayout');
				}

				app.getLayout.andReturn({
					setViews: jasmine.createSpy('setViews'),
					then: jasmine.createSpy('then'),
					render: function() {
						return this;
					}
				});

				controller._setFeedView();

				expect(controller.tripCardView).toBeDefined();
				expect(controller.carouselHeaderView).toBeDefined();
				expect(controller.tripMessageView).toBeDefined();
				expect(controller.model.messages.fetch).toHaveBeenCalled();
			});

			it('should display add view for trips with no trip items', function() {
				spyOn(controller, 'add');
				controller._setFeedView();
				expect(controller.add).toHaveBeenCalled();
			});
		});

		describe('views in view', function() {
			it('should handle no views', function() {
				expect(controller.isInView()).toBeFalsy();
			});

			it('should handle itinerary view', function() {
				controller.itineraryView = {
					isInView: function() {return true;}
				};

				expect(controller.isInView()).toBeTruthy();
			});

			it('should handle trip card view', function() {
				controller.tripCardView = {
					isInView: function() {return true;}
				};

				expect(controller.isInView()).toBeTruthy();
			});
		});

		describe('itinerary', function() {
			var trip;

			beforeEach(function() {
				if (!app.getLayout.andReturn) {
					spyOn(app, 'getLayout');
				}
				spyOn(controller, 'showLoading');
				spyOn(controller, '_setItineraryView');
				spyOn(controller.model, 'fetch');
				trip = {
					isFollowing: function() { return false; }
				};
			});

			it('should set up itinerary', function() {
				controller.model.fetch.andReturn(function(options) {
					expect(options.silent).toBeTruthy();
					expect(options.success).toBeDefined();

					options.success(trip);

					expect(controller._setItineraryView).toHaveBeenCalled();
				});

				controller.itinerary({tripId: 2});

				expect(controller.tripId).toBe(2);
				expect(app.getLayout).toHaveBeenCalledWith('simple_with_loading');
				expect(controller.showLoading).toHaveBeenCalled();
			});
		});
	});
});
