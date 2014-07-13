define([
	'namespace',
	'factories/user_factory',
	'views/hotels/add/add_hotel_view',
	'models/trip_item'
], function(
	app,
	UserFactory,
	AddHotelView,
	TripItem
) {
	describe('Add Hotel View', function() {
		var view, tripItem;

		beforeEach(function() {
			tripItem = new TripItem({
				named_type: 'Hotel'
			});

			view = new AddHotelView({
				model: tripItem
			});
		});

		it('should initialize', function() {
			expect(view).toBeTruthy();
		});

		describe('serialize', function() {
			var context;

			afterEach(function() {
				app.session.resetUser();
			});

			it('should serialize model data', function() {
				view.model = new TripItem({corporation: 'twc'});

				context = view.serialize();

				expect(context.showForBusinessField).toBeTruthy();
				expect(context.itemCorporation).toEqual('twc');
				expect(context.userCorporation).toBeUndefined();
			});

			it('should serialize with user corporation', function() {
				app.session.user = UserFactory.build({corporation: 'tripcase'});

				context = view.serialize();

				expect(context.itemCorporation).toBeUndefined();
				expect(context.userCorporation).toEqual('tripcase');
			});

			it('should serialize and show no for business field', function() {
				context = view.serialize();
				expect(context.itemCorporation).toBeUndefined();
				expect(context.userCorporation).toBeUndefined();
			});
		});
	});
});