define([
	'backbone', 'factories/user_factory', 'models/trip_item',
	'moment', 'underscore'
], function(
	Backbone, UserFactory, TripItem,
	moment, _
) {

	describe('TripItem', function() {
		var model;

		beforeEach(function() {
			model = new TripItem();
		});

		it('should exist', function() {
			expect(TripItem).toBeTruthy();
		});

		it('should instantiate', function() {
			var tripItem = new TripItem();
			expect(tripItem instanceof TripItem).toBeTruthy();
			expect(tripItem instanceof Backbone.Model).toBeTruthy();
		});
	});

	describe('Itinerary Helpers', function() {

		it('should know that start and end on the same day', function() {
			var tripItem = new TripItem();
			tripItem.set({
				calendar_start: "2012-01-03T09:00:00",
				calendar_end: "2012-01-03T10:00:00"
			}, {silent: true});
			expect(tripItem.isStartAndEndOnSameDay()).toBeTruthy();
		});

		it('should know that start and end are not on the same day', function() {
			var tripItem = new TripItem();
			tripItem.set({
				calendar_start: "2012-01-03T09:00:00",
				calendar_end: "2012-01-04T10:00:00"
			}, {silent: true});
			expect(tripItem.isStartAndEndOnSameDay()).toBeFalsy();
		});

		it('should know that the trip item is ending today', function() {
			var tripItem = new TripItem();
			var today = moment().format('YYYY-MM-DDTHH:mm:ss');
			tripItem.set({
				calendar_start: today,
				calendar_end: today
			}, {silent: true});
			expect(tripItem.isEndingToday()).toBeTruthy();
		});

		it('should reject TIs with same start/end date as having ending itinerary items', function() {
			var tripItem = new TripItem();
			tripItem.set({
				calendar_start: "2012-01-03T09:00:00",
				calendar_end: "2012-01-03T10:00:00",
				named_type: 'Vehicle'
			}, {silent: true});
			expect(tripItem.hasEndingItineraryItem()).toBeFalsy();
		});

		it('should reject Air TIs as TIs having ending itinerary items', function() {
			var tripItem = new TripItem();
			tripItem.set({
				calendar_start: "2012-01-03T09:00:00",
				calendar_end: "2012-01-04T10:00:00",
				named_type: 'Air'
			}, {silent: true});
			expect(tripItem.hasEndingItineraryItem()).toBeFalsy();
		});

		it('should reject certain Generic TIs as TIs having ending itinerary items', function() {
			var tripItem = new TripItem();
			_.each(['activity', 'attraction', 'meeting', 'food_and_drink'], function(type) {
				tripItem.set({
					calendar_start: "2012-01-03T09:00:00",
					calendar_end: "2012-01-04T10:00:00",
					named_type: 'Generic',
					type: type
				}, {silent: true});
				expect(tripItem.hasEndingItineraryItem()).toBeFalsy();
			});
		});

		it('should identify TIs as TIs having ending itinerary items', function() {
			var tripItem = new TripItem();
			_.each(['Vehicle', 'Hotel'], function(named_type) {
				tripItem.set({
					calendar_start: "2012-01-03T09:00:00",
					calendar_end: "2012-01-04T10:00:00",
					named_type: named_type
				}, {silent: true});
				expect(tripItem.hasEndingItineraryItem()).toBeTruthy();
			});
		});

		it('should identify TIs as TIs having ending itinerary items for generic types', function() {
			var tripItem = new TripItem();
			_.each(['Cruise', 'Ground_transportation', 'Rail'], function(type) {
				tripItem.set({
					calendar_start: "2012-01-03T09:00:00",
					calendar_end: "2012-01-04T10:00:00",
					named_type: "Generic",
					type: type
				}, {silent: true});
				expect(tripItem.hasEndingItineraryItem()).toBeTruthy();
			});
		});

		it('should identify Ferry TIs as TIs having ending itinerary items', function() {
			var tripItem = new TripItem();
			tripItem.set({
				calendar_start: "2012-01-03T09:00:00",
				calendar_end: "2012-01-04T10:00:00",
				named_type: 'Generic',
				type: 'Ferry'
			}, {silent: true});
			expect(tripItem.hasEndingItineraryItem()).toBeTruthy();
		});

		it('should identify current trip items', function() {
			var tripItem = new TripItem();
			tripItem.set({
				calendar_start: "2012-01-03T09:00:00",
				calendar_end: "2012-01-03T10:00:00",
				named_type: 'Generic',
				type: 'ferry'
			}, {silent: true});
			var now = new Date(2012, 0, 3, 9, 30, 0);
			expect(tripItem.isCurrent(now)).toBeTruthy();
		});

		it('should identify non current trip items', function() {
			var tripItem = new TripItem();
			tripItem.set({
				calendar_start: "2012-01-03T09:00:00",
				calendar_end: "2012-01-04T10:00:00",
				named_type: 'Generic',
				type: 'ferry'
			}, {silent: true});
			var now = new Date(2012, 0, 4, 11, 0, 0);
			expect(tripItem.isCurrent(now)).toBeFalsy();
		});

		it('should identify past trip item', function() {
			var tripItem = new TripItem();
			tripItem.set({
				calendar_start: "2012-01-03T09:00:00",
				calendar_end: "2012-01-03T10:00:00",
				named_type: 'Generic',
				type: 'ferry'
			}, {silent: true});
			var now = new Date(2012, 0, 3, 10, 30, 0);
			expect(tripItem.isPast(now)).toBeTruthy();
		});

		it('should identify non past trip item', function() {
			var tripItem = new TripItem();
			tripItem.set({
				calendar_start: "2012-01-03T09:00:00",
				calendar_end: "2012-01-04T10:00:00",
				named_type: 'Generic',
				type: 'ferry'
			}, {silent: true});
			var now = new Date(2012, 0, 3, 8, 59, 0);
			expect(tripItem.isPast(now)).toBeFalsy();
		});

		it('should identify trip items that end next for a date', function() {
			var tripItem = new TripItem();
			tripItem.set({
				calendar_start: "2012-01-03T09:00:00",
				calendar_end: "2012-01-04T10:00:00",
				named_type: 'Generic',
				type: 'ferry'
			}, {silent: true});
			var date = new Date(2012, 0, 4, 10, 30, 0);
			expect(tripItem.isEndingNext(date)).toBeTruthy();
		});

		it('should identify trip items that do not end next for a date', function() {
			var tripItem = new TripItem();
			tripItem.set({
				calendar_start: "2012-01-03T09:00:00",
				calendar_end: "2012-01-04T10:00:00",
				named_type: 'Generic',
				type: 'ferry'
			}, {silent: true});
			var date = new Date(2012, 0, 3, 8, 59, 0);
			expect(tripItem.isEndingNext(date)).toBeFalsy();
		});
	});
});