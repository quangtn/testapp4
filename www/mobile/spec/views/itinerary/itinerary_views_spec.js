define([
	'jquery', 'mediator', 'backbone',
	'views/itinerary/itinerary_views'
], function(
	$, mediator, Backbone,
	ItineraryView
) {

	describe('Itinerary View', function() {
		var view;

		beforeEach(function() {
			view = new ItineraryView();
		});

		it('should exist', function() {
			expect(view.render).toBeTruthy();
		});

		describe('render', function() {
			it('should publish trip items index change event', function() {
				spyOn(mediator, 'publish');
				var view = new ItineraryView({
					model: new Backbone.Model({ id: 123 })
				});
				var thingManageReturns = { render: $.noop };
				var manage = function() {
					return thingManageReturns;
				};
				spyOn(thingManageReturns, 'render');
				view.render(manage);
				expect(mediator.publish).toHaveBeenCalledWith(
					'trip_items:index:change', { tripId: 123 }
				);
			});
		});

		it('should serialize', function() {
			var context;
			view.model = new Backbone.Model();
			view.model.can = jasmine.createSpy().andReturn(true);

			context = view.serialize();

			expect(context.tripCanShare).toBeTruthy();
		});
	});
});
