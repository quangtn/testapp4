define([
		'underscore', 'mediator', 'namespace', 'backbone',
		'controllers/trips_controller', 'models/trip', 'models/air_trip_item',
		'collections/trips', 'analytics'
], function(
		_, mediator, app, Backbone, TripsController, TripModel,
		AirTripItemModel, Trips, Analytics
) {

	describe('trips controller', function() {

		var controller;

		beforeEach(function() {
			controller = new TripsController();
			controller.activePastTrips = new Trips();
			controller.followingTrips = new Trips();
		});

		it('should exist', function() {
			expect(controller).toBeTruthy();
		});

		it('should call _initSubscriptions', function() {
			spyOn(TripsController.prototype, '_initSubscriptions');
			controller = new TripsController();
			expect(TripsController.prototype._initSubscriptions).toHaveBeenCalled();
		});

		describe('when initializing', function() {

			var controlla;

			beforeEach(function() {
				spyOn(mediator, 'subscribe').andReturn(true);
				controlla = new TripsController();
			});

			it('should subscribe to trips:index', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('trips:index', controlla.tripsIndex);
			});

			it('should subscribe to trips:showActive', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('trips:showActive', controlla.switchToActiveTab);
			});

			it('should subscribe to trips:showPast', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('trips:showPast', controlla.switchToPastTab);
			});

			it('should subscribe to trips:showFollowing', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('trips:showFollowing', controlla.switchToFollowingTab);
			});

			it('should subscribe to trips:edit', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('trips:edit', controlla.edit);
			});

			it('should subscribe to trips:share', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('trips:share', controlla.share);
			});

			it('should subscribe to trips:rename', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('trips:rename', controlla.rename);
			});

			it('should subscribe to trips:create', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('trips:create', controlla.create);
			});

			it('should subscribe to trips:refresh', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('trips:refresh', controlla.refresh);
			});

			it('should subscribe to device:resume', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('device:resume', controlla.resume);
			});

			it('should subscribe to trips:select', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('trips:select', controlla._showTrip);
			});
		});

		it('should call resume() when device:resume event is fired', function() {
			var controller = new TripsController();
			mediator.unsubscribe();
			spyOn(controller, 'resume');
			controller._initSubscriptions(); // reset it to re-subscribe to the event, which will fire the spy
			mediator.publish('device:resume');
			expect(controller.resume).toHaveBeenCalled();
		});

		describe('resume', function() {
			beforeEach(function() {
				spyOn(controller.SummaryListView, 'isInView').andReturn(true);
				spyOn(mediator, 'publish');
			});

			it('should fetch following trips', function() {
				spyOn(controller, 'showFollowing');
				spyOn(controller, '_fetchTrips').andCallFake(function(callback) {
					callback.success();

					expect(callback.isRefresh).toBeTruthy();
					expect(controller.showFollowing).toHaveBeenCalledWith(false);
					expect(controller.isFetchingData).toBeFalsy();
					expect(mediator.publish).toHaveBeenCalledWith('trips:listRefreshed');
				});
				controller.tripScopeBar.selectedTab = 'following';

				controller.resume();
			});

			it('should fetch active/past trips', function() {
				spyOn(controller.followingTrips, 'invalidateCache');
				spyOn(controller, 'showSelectedTab');
				spyOn(controller.activePastTrips, 'fetch').andCallFake(function(callback) {
					callback.success();

					expect(callback.isToRefresh).toBeTruthy();
					expect(controller.showSelectedTab).toHaveBeenCalled();
					expect(controller.isFetchingData).toBeFalsy();
					expect(mediator.publish).toHaveBeenCalledWith('trips:listRefreshed');
				});
				controller.tripScopeBar.selectedTab = 'active';

				controller.resume();
			});
		});

		it('should handle trips index', function() {
			spyOn(controller, 'clearCurrentTrip');
			spyOn(controller, 'showSelectedTab');

			controller.tripsIndex();

			expect(controller.clearCurrentTrip).toHaveBeenCalled();
			expect(controller.showSelectedTab).toHaveBeenCalledWith({
				active: true,
				past: true,
				following: true
			});
		});

		it('should fetch both trips', function() {
			var options = {success: jasmine.createSpy()};
			spyOn(controller.SummaryListView, 'cleanup');
			spyOn(controller.followingTrips, 'fetch').andCallFake(function(callback) {
				callback.success();
			});
			spyOn(controller.activePastTrips, 'fetch').andCallFake(function(callback) {
				callback.success();

				expect(options.success).toHaveBeenCalled();
			});

			controller._fetchTrips(options);
		});

		it('should load past following trips', function() {
			spyOn(controller.SummaryListView, 'showAllFollowingTrips');
			spyOn(controller.followingTrips, 'fetch').andCallFake(function(callback) {
				callback.success();

				expect(callback.localCache).toBeFalsy();
				expect(callback.add).toBeTruthy();
				expect(controller.SummaryListView.showAllFollowingTrips).toHaveBeenCalled();
			});

			controller.loadPastFollowingTrips();
		});

		it('should refresh', function() {
			spyOn(controller, 'showSelectedTab');
			spyOn(mediator, 'publish');
			spyOn(Analytics, 'trackEvent');
			spyOn(controller, '_fetchTrips').andCallFake(function(callback) {
				callback.success.apply(controller);

				expect(callback.isRefresh).toBeTruthy();
				expect(controller.showSelectedTab).toHaveBeenCalled();
				expect(mediator.publish).toHaveBeenCalledWith('trips:listRefreshed');
			});

			controller.refresh();

			expect(Analytics.trackEvent).toHaveBeenCalledWith('MyTrips', 'Refresh', app);
			expect(controller._fetchTrips).toHaveBeenCalled();
		});

		describe('showing trips', function() {
			beforeEach(function() {
				spyOn(controller, '_setTripsListView');
				spyOn(controller.SummaryListView, 'setTrips');
			});

			it('should show active/past trips', function() {
				controller.tripScopeBar.selectedTab = 'active';

				controller.showTrips(controller.activePastTrips);

				expect(controller.SummaryListView.setTrips).toHaveBeenCalledWith(controller.activePastTrips, true);
				expect(controller._setTripsListView).toHaveBeenCalled();
			});

			it('should show following trips', function() {
				controller.tripScopeBar.selectedTab = 'following';

				controller.showTrips(controller.followingTrips);

				expect(controller.SummaryListView.setTrips).toHaveBeenCalledWith(controller.followingTrips, false);
			});
		});

		describe('showing active trips', function() {
			beforeEach(function() {
				spyOn(controller, 'showTrips');
			});

			it('should show and fetch active trips', function() {
				spyOn(Analytics, 'trackEvent');
				spyOn(mediator, 'publish');
				spyOn(controller, 'showLoading');
				spyOn(controller.activePastTrips, 'fetch').andCallFake(function(callback) {
					callback.success(controller.activePastTrips);

					expect(callback.isRefresh).toBeFalsy();
					expect(controller.showTrips).toHaveBeenCalledWith(controller.activePastTrips);
				});

				controller.showActive(true);

				expect(Analytics.trackEvent).toHaveBeenCalledWith('MyTrips', 'ActiveTrips', app);
				expect(controller.tripScopeBar.selectedTab).toEqual('active');
				expect(mediator.publish).toHaveBeenCalledWith('trips:tripToggle', true);
				expect(controller.showLoading).toHaveBeenCalled();
			});

			it('should show and used cached active trips', function() {
				spyOn(controller.activePastTrips, 'fetch');

				controller.showActive(false);

				expect(controller.activePastTrips.fetch).not.toHaveBeenCalled();
				expect(controller.showTrips).toHaveBeenCalledWith(controller.activePastTrips);
			});
		});

		describe('showing past trips', function() {
			beforeEach(function() {
				spyOn(controller, 'showTrips');
			});

			it('should show and fetch past trips', function() {
				spyOn(Analytics, 'trackEvent');
				spyOn(mediator, 'publish');
				spyOn(controller, 'showLoading');
				spyOn(controller.activePastTrips, 'fetch').andCallFake(function(callback) {
					callback.success(controller.activePastTrips);

					expect(callback.isRefresh).toBeFalsy();
					expect(controller.showTrips).toHaveBeenCalledWith(controller.activePastTrips);
				});

				controller.showPast(true);

				expect(Analytics.trackEvent).toHaveBeenCalledWith('MyTrips', 'PastTrips', app);
				expect(controller.tripScopeBar.selectedTab).toEqual('past');
				expect(mediator.publish).toHaveBeenCalledWith('trips:tripToggle', false);
				expect(controller.showLoading).toHaveBeenCalled();
			});

			it('should show and used cached past trips', function() {
				spyOn(controller.activePastTrips, 'fetch');

				controller.showPast(false);

				expect(controller.activePastTrips.fetch).not.toHaveBeenCalled();
				expect(controller.showTrips).toHaveBeenCalledWith(controller.activePastTrips);
			});
		});

		describe('showing following trips', function() {
			beforeEach(function() {
				spyOn(controller, 'showTrips');
			});

			it('should show and fetch active trips', function() {
				spyOn(Analytics, 'trackEvent');
				spyOn(controller, 'showLoading');
				spyOn(controller.followingTrips, 'fetch').andCallFake(function(callback) {
					callback.success(controller.followingTrips);

					expect(callback.isRefresh).toBeFalsy();
					expect(controller.showTrips).toHaveBeenCalledWith(controller.followingTrips);
				});

				controller.showFollowing(true);

				expect(Analytics.trackEvent).toHaveBeenCalledWith('MyTrips', 'FollowingTrips', app);
				expect(controller.tripScopeBar.selectedTab).toEqual('following');
				expect(controller.showLoading).toHaveBeenCalled();
			});

			it('should show and used cached active trips', function() {
				spyOn(controller.followingTrips, 'fetch');

				controller.showFollowing(false);

				expect(controller.followingTrips.fetch).not.toHaveBeenCalled();
				expect(controller.showTrips).toHaveBeenCalledWith(controller.followingTrips);
			});
		});

		describe('show selected tab', function() {
			describe('show following', function() {
				beforeEach(function() {
					spyOn(controller, 'showFollowing');
					controller.tripScopeBar.selectedTab = 'following';
				});

				it('should fetch following trips', function() {
					controller.showSelectedTab({following: true});
					expect(controller.showFollowing).toHaveBeenCalledWith(true);
				});

				it('should use cached following trips', function() {
					controller.showSelectedTab();
					expect(controller.showFollowing).toHaveBeenCalledWith(false);
				});
			});

			describe('show past', function() {
				beforeEach(function() {
					spyOn(controller, 'showPast');
					controller.tripScopeBar.selectedTab = 'past';
				});

				it('should show past', function() {
					controller.showSelectedTab({past: true});
					expect(controller.showPast).toHaveBeenCalledWith(true);
				});

				it('should show and use cached past trips', function() {
					controller.showSelectedTab();
					expect(controller.showPast).toHaveBeenCalledWith(false);
				});
			});

			describe('show active', function() {
				beforeEach(function() {
					spyOn(controller, 'showActive');
					controller.tripScopeBar.selectedTab = 'active';
				});

				it('should show active', function() {
					controller.showSelectedTab({active: true});
					expect(controller.showActive).toHaveBeenCalledWith(true);
				});
				it('should show and use cached active trips', function() {
					controller.showSelectedTab();
					expect(controller.showActive).toHaveBeenCalledWith(false);
				});
			});
		});

		describe('switch to active tab', function() {
			beforeEach(function() {
				spyOn(controller, 'showActive');
			});

			it('should show active trips', function() {
				controller.tripScopeBar.selectedTab = 'following';
				controller.switchToActiveTab();
				expect(controller.showActive).toHaveBeenCalledWith(false);
			});

			it('should not re-render if already on the same tab', function() {
				controller.tripScopeBar.selectedTab = 'active';
				controller.switchToActiveTab();
				expect(controller.showActive).not.toHaveBeenCalled();
			});
		});

		describe('switch to past tab', function() {
			beforeEach(function() {
				spyOn(controller, 'showPast');
			});

			it('should show past trips', function() {
				controller.tripScopeBar.selectedTab = 'following';
				controller.switchToPastTab();
				expect(controller.showPast).toHaveBeenCalledWith(false);
			});

			it('should not re-render if already on the same tab', function() {
				controller.tripScopeBar.selectedTab = 'past';
				controller.switchToPastTab();
				expect(controller.showPast).not.toHaveBeenCalled();
			});
		});

		describe('switch to following tab', function() {
			beforeEach(function() {
				spyOn(controller, 'showFollowing');
			});

			it('should show following trips', function() {
				controller.tripScopeBar.selectedTab = 'active';
				controller.switchToFollowingTab();
				expect(controller.showFollowing).toHaveBeenCalledWith(true);
			});

			it('should not re-render if already on the same tab', function() {
				controller.tripScopeBar.selectedTab = 'following';
				controller.switchToFollowingTab();
				expect(controller.showFollowing).not.toHaveBeenCalled();
			});
		});
	});
});
