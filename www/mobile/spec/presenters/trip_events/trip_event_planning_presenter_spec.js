require([
	'backbone', 'presenters/trip_events/trip_event_planning_presenter', 'moment'
], function($, TripEventPlanningPresenter, moment) {

	describe('Planning Event Presenter', function() {

		var dummyTrip;

		beforeEach(function() {
			dummyTrip = {
				getDestination: function() {
					return "Dallas";
				},
				getStartTime: function() {
					return moment();
				},
				hasEnded: function() {
					return false;
				},
				isInProgress: function() {
					return false;
				},
				startsSoon: function() {
					return false;
				},
				getStartTimeUTC: function() {
					return moment();
				}
			};
		});

		afterEach(function() {
			dummyTrip = null;
		});

		it("exists", function() {
			expect(TripEventPlanningPresenter).toBeTruthy();
		});

		it("tells the view if the trip has ended", function() {
			dummyTrip.hasEnded = function() {
				return true;
			};
			var context = TripEventPlanningPresenter.serialize(dummyTrip);
			expect(context.events[0].labelText).toBe("Your Trip has Ended");
		});

		it("tells the view if the trip starts soon", function() {
			dummyTrip.startsSoon = function() {
				return true;
			};
			var context = TripEventPlanningPresenter.serialize(dummyTrip);
			expect(context.events[0].labelText).toBe("Your Trip Starts Soon");
		});

		it("tells the view if the trip is in progress", function() {
			dummyTrip.isInProgress = function() {
				return true;
			};
			var context = TripEventPlanningPresenter.serialize(dummyTrip);
			expect(context.events[0].labelText).toBe("Your Trip has Started");
		});

	});

});