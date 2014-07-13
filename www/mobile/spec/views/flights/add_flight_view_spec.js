define([
	'namespace',
	'factories/user_factory',
	'views/flights/add/add_flight_view',
	'backbone'
], function(
	app,
	UserFactory,
	AddFlightView,
	Backbone
) {

	describe('Add Flight View', function() {
		var addFlightView;

		beforeEach(function() {
			addFlightView = new AddFlightView({
				model: new Backbone.Model()
			});
		});

		it('should have a serialize function', function() {
			expect(addFlightView.serialize).toBeTruthy();
		});

		describe('serialize flight data', function() {
			var data;

			afterEach(function() {
				app.session.resetUser();
			});

			it('should serialize model data', function() {
				addFlightView.model = new Backbone.Model({
					departureDate: '2013-06-15T15:10:00',
					corporation: 'tripcase'
				});

				data = addFlightView.serialize();

				expect(data.departureDate).toMatch('2013-06-15T15:10');
				expect(data.showForBusinessField).toBeTruthy();
				expect(data.itemCorporation).toEqual('tripcase');
				expect(data.userCorporation).toBeUndefined();
			});

			it('should serialize with user corporation', function() {
				app.session.user = UserFactory.build({corporation: 'netflix'});

				data = addFlightView.serialize();

				expect(data.showForBusinessField).toBeTruthy();
				expect(data.itemCorporation).toBeUndefined();
				expect(data.userCorporation).toEqual('netflix');
			});

			it('should serialize and show no for business field', function() {
				data = addFlightView.serialize();
				expect(data.showForBusinessField).toBeUndefined();
				expect(data.itemCorporation).toBeUndefined();
				expect(data.userCorporation).toBeUndefined();
			});
		});
	});
});
