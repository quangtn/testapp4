define([
	'namespace',
	'factories/trip_item_factory',
	'factories/user_factory',
	'views/trip_items/add_trip_item_view'
], function(
	app,
	TripItemFactory,
	UserFactory,
	AddTripItemView
) {
	describe('Add Trip Item View', function() {
		var view;

		beforeEach(function() {
			view = new AddTripItemView({
				model: TripItemFactory.build()
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
				view.model = TripItemFactory.build({corporation: 'twc'});

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