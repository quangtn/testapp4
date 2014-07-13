define([
		'namespace',
		'backbone',
		'collections/trips',
		'collections/following_trips',
		'models/trip',
		'views/trips/summary_list_view',
		'strings'
], function(app, Backbone, TripCollection, FollowingTrips, Trip, SummaryListView, t) {

	describe('summary list view', function() {

		var summaryListView;

		beforeEach(function() {
			summaryListView = new SummaryListView({
				collection: new TripCollection()
			});
		});

		afterEach(function() {
			summaryListView.$el.empty();
		});

		it('should initialize', function() {
			expect(summaryListView.isActiveTrips).toBeTruthy();
		});

		it('should clean up after itself', function() {
			spyOn(summaryListView.collection, 'off');

			summaryListView.cleanup();

			expect(summaryListView.isPastFollowingTripsLoaded).toBeFalsy();
		});

		it('should render', function() {
			var preparedView = {render: function() {}};
			summaryListView.isEmpty = true;

			spyOn(preparedView, 'render');
			spyOn(summaryListView, '_prepareView').andReturn(preparedView);
			spyOn(summaryListView, '_getEmptyTripsMessage').andReturn('');
			spyOn(summaryListView, '_showPastFollowingTripsLoadButton').andReturn(true);

			summaryListView.render(function() {});

			expect(summaryListView._prepareView).toHaveBeenCalled();
			expect(preparedView.render).toHaveBeenCalledWith({
				isEmpty: true,
				isFollowingTrips: false,
				showPastFollowingTripsLoadButton: true,
				emptyMessage: ''
			});
		});

		describe('preparing view', function() {
			var view, model;

			beforeEach(function() {
				view = {insert: jasmine.createSpy()};
				spyOn(summaryListView, '_createTripSummaryItemView').andReturn(true);
				model = new Backbone.Model().set('active', true);
				model.isFollowing = function() {};
			});

			it('should insert summary item view', function() {
				summaryListView.isActiveTrips = true;

				spyOn(summaryListView.collection, 'each').andCallFake(function(callback, context) {
					callback.call(context, model);

					expect(summaryListView.isEmpty).toBeFalsy();
					expect(view.insert).toHaveBeenCalledWith('.list-panel', true);
					expect(summaryListView._createTripSummaryItemView).toHaveBeenCalledWith(model);
				});

				summaryListView._prepareView(view);
			});

			it('should not insert summary item view for active/past trip mismatch', function() {
				summaryListView.isActiveTrips = false;
				spyOn(summaryListView.collection, 'each').andCallFake(function(callback, context) {
					callback.call(context, model);

					expect(summaryListView.isEmpty).toBeTruthy();
					expect(view.insert).not.toHaveBeenCalled();
					expect(summaryListView._createTripSummaryItemView).not.toHaveBeenCalled();
				});

				summaryListView._prepareView(view);
			});

			it('should always insert summary item view for following trips', function() {
				spyOn(model, 'isFollowing').andReturn(true);
				spyOn(summaryListView.collection, 'each').andCallFake(function(callback, context) {
					callback.call(context, model);

					expect(summaryListView.isEmpty).toBeFalsy();
				});

				summaryListView._prepareView(view);
			});
		});

		describe('summary trip item view', function() {
			var tripItem,
				model = {isAmexDTR: function(){}};

			it('should create summary item view', function() {
				tripItem = summaryListView._createTripSummaryItemView(model);

				expect(tripItem).toBeDefined();
				expect(tripItem.isFollowingTrip).toBeFalsy();
			});

			it('should handle trip:select event', function() {
				spyOn(summaryListView, 'trigger');

				tripItem = summaryListView._createTripSummaryItemView(model);
				tripItem.trigger('trip:select');

				expect(summaryListView.trigger).toHaveBeenCalled();
			});
		});

		describe('empty trips message', function() {
			it('should handle no active trips', function() {
				expect(summaryListView._getEmptyTripsMessage()).toEqual(t.NoActiveTrips);
			});

			it('should handle no past trips', function() {
				summaryListView.isActiveTrips = false;
				expect(summaryListView._getEmptyTripsMessage()).toEqual(t.NoPastTrips);
			});

			it('should handle no active following trips', function() {
				summaryListView.collection = new FollowingTrips();
				expect(summaryListView._getEmptyTripsMessage()).toEqual(t.NotFollowingAnyTrips);
			});

			it('should handle no following trips', function() {
				summaryListView.collection = new FollowingTrips();
				summaryListView.isPastFollowingTripsLoaded = true;
				expect(summaryListView._getEmptyTripsMessage()).toEqual(t.NoFollowingTrips);
			});
		});

		it('should switch trips', function() {
			spyOn(summaryListView, 'setTrips');
			spyOn(summaryListView, 'render');

			summaryListView.switchTrips();

			expect(summaryListView.setTrips).toHaveBeenCalled();
			expect(summaryListView.render).toHaveBeenCalled();
		});

		describe('setting trips', function() {
			it('should set trips with a new collection', function() {
				summaryListView.setTrips(new TripCollection());

				expect(summaryListView.isActiveTrips).toEqual(false);
				expect(summaryListView.collection).toBeDefined();
			});

			it('should handle same collection reference', function() {
				var trips = new TripCollection();
				summaryListView.collection = trips;

				spyOn(summaryListView.collection, 'off');
				spyOn(summaryListView.collection, 'on');

				summaryListView.setTrips(trips);

				expect(summaryListView.collection.off).not.toHaveBeenCalled();
				expect(summaryListView.collection.on).not.toHaveBeenCalled();
			});

			it('should handle active trips', function() {
				summaryListView.setTrips(new TripCollection(), true);
				expect(summaryListView.isActiveTrips).toBeTruthy();
			});
		});

		it('should handle load past following trips', function() {
			var e = jasmine.createSpyObj('e', ['preventDefault']);
			spyOn(summaryListView, 'trigger');
			summaryListView.$el.append('<div class="js-load-past-following-trips"><li><span>hotdog</span></li></div>');

			summaryListView.loadPastFollowingTrips(e);

			expect(summaryListView.$el.find('.js-load-past-following-trips li span').length).toBeFalsy();
			expect(summaryListView.trigger).toHaveBeenCalledWith('following_trips:load');
		});

		it('should show all following trips', function() {
			spyOn(summaryListView, 'switchTrips');

			summaryListView.showAllFollowingTrips(true);

			expect(summaryListView.isPastFollowingTripsLoaded).toBeTruthy();
			expect(summaryListView.switchTrips).toHaveBeenCalledWith(true);
			expect(summaryListView.$el.find('.js-load-past-following-trips').length).toBeFalsy();
		});

		describe('showing past following trips button', function() {
			beforeEach(function() {
				summaryListView.isPastFollowingTripsLoaded = false;
				app.isOnline = true;
			});

			it('should show button', function() {
				summaryListView.collection = new FollowingTrips();
				expect(summaryListView._showPastFollowingTripsLoadButton()).toBeTruthy();
			});

			it('should not show button because collection is not following trips', function() {
				expect(summaryListView._showPastFollowingTripsLoadButton()).toBeFalsy();
			});

			it('should not show button because past following trips are already loaded', function() {
				summaryListView.isPastFollowingTripsLoaded = true;
				expect(summaryListView._showPastFollowingTripsLoadButton()).toBeFalsy();
			});

			it('should not show button because app is offline', function() {
				app.isOnline = false;
				expect(summaryListView._showPastFollowingTripsLoadButton()).toBeFalsy();
			});
		});
	});
});
