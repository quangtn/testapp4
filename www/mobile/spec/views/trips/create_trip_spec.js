require(['mediator', 'jquery', 'underscore', 'backbone', 'namespace', 'strings',
	'models/trip', 'views/trips/create_trip_view'
	],
	function(mediator, $, _, Backbone, app, t, Trip, CreateTripView) {

		describe('Create Trip View', function() {

			var createModel, createView;

			beforeEach(function() {
				createModel = new Trip();
				createView = new CreateTripView({model: createModel});
			});

			afterEach(function() {
				createModel = null;
				createView = null;
			});

			it('can create application objects for testing', function() {
				expect(createModel).toBeDefined();
				expect(createView).toBeDefined();
			});

			it('adds an error listner on model', function() {
				var fakeTrip = new Backbone.Model();
				spyOn(fakeTrip, "on");
				var view = new CreateTripView({model: fakeTrip});
				expect(fakeTrip.on).toHaveBeenCalledWith("error", view._showError, view);
			});

			it('calls the mediator to show the error modal', function() {
				var errors = [];
				spyOn(mediator, "publish");
				createView._showError(createModel, errors);
				expect(mediator.publish).toHaveBeenCalledWith('error:trigger', 'form_validation', errors);
			});

		});
	}
);