define([
	'jquery', 'helpers', 'handlebars', 'backbone', 'mediator', 'moment',
	'views/flights/flight_detail_view'
], function(
	$, helpers, Handlebars, Backbone, mediator, moment, FlightDetailView
) {

	describe('flight detail view', function() {
		var flightDetailView;

		it('should subscribe to some events', function() {
			spyOn(mediator, 'subscribe').andReturn(true);
			flightDetailView = new FlightDetailView({
				model: new Backbone.Model({
					fake: 'data'
				})
			});
			expect(mediator.subscribe).toHaveBeenCalledWith('flightdetail:refresh', jasmine.any(Function), jasmine.any(Object));
			expect(mediator.subscribe).toHaveBeenCalledWith('device:resume', jasmine.any(Function), jasmine.any(Object));
		});

		it('should clean up after itself', function() {
			flightDetailView = new FlightDetailView({
				model: new Backbone.Model({
					fake: 'data'
				})
			});

			expect(flightDetailView.cleanup).toBeTruthy();
		});

		it('should unsubscribe to events during cleanup', function() {
			spyOn(mediator, 'unsubscribe').andReturn(true);
			flightDetailView = new FlightDetailView({
				model: new Backbone.Model({
					fake: 'data'
				})
			});

			flightDetailView.cleanup();

			expect(mediator.unsubscribe).toHaveBeenCalledWith(null, null, flightDetailView);
		});

		xit('should call refresh when device:resume event fires', function() {
			var flightDetailView = new FlightDetailView();
			mediator.unsubscribe();
			flightDetailView._initSubscriptions();
			spyOn(flightDetailView, 'onRefresh');
			mediator.publish('device:resume');
			expect(flightDetailView.onRefresh).toHaveBeenCalled();
		});

		it('should refresh when in view', function() {
			var flightDetailView = new FlightDetailView({
				model: new Backbone.Model({fake: 'data'})
			});
			spyOn(flightDetailView.$el, 'isInView').andReturn(true);
			spyOn(flightDetailView.model, 'fetch');

			flightDetailView.onRefresh();

			expect(flightDetailView.model.fetch).toHaveBeenCalled();
		});

		it('should not refresh when not in view', function() {
			var flightDetailView = new FlightDetailView({
				model: new Backbone.Model({
					fake: 'data'
				})
			});
			spyOn(flightDetailView.$el, 'isInView').andReturn(false);
			spyOn(flightDetailView.model, 'fetch');

			flightDetailView.onRefresh();

			expect(flightDetailView.model.fetch).not.toHaveBeenCalled();
		});

	});
});
