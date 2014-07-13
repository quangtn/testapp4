require(['namespace', 'mediator', 'jquery', 'underscore', 'backbone', 'handlebars',
		'text!fixtures/mock_trip_response.json',
		'views/trip_feed/trip_card_view', 'models/trip'],
function(app, mediator, $, _, Backbone, Handlebars, MockTripResponseString, TripCardView, Trip) {

	describe('Trip Card View', function() {

		var model, view;
		var mockEvent = {
			preventDefault: function() {},
			currentTarget: '<div data-trip-item-id="1220" data-segment="1"/>​'
		};
		var mockTripResponse = JSON.parse(MockTripResponseString);

		beforeEach(function() {
			model = new Trip();
			model.set(model.parse(mockTripResponse));
			view = new TripCardView({
				model: model
			});

			var template = require('text!templates/' + view.template + '.tmpl');
			var context = Handlebars.compile(template);
			var data = view.serialize();
			var html = context(data);
			view.$el.html(html);
			view.delegateEvents();

			app.isOnline = true;
		});

		afterEach(function() {
			model = null;
			view = null;
			app.isOnline = false;
		});

		it('can create application objects for testing', function() {
			expect(model).toBeDefined();
			expect(view).toBeDefined();
		});

		it('can publish map mediator message from button click handler', function() {
			spyOn(mediator, 'publish');
			view.onDirectionsPick(mockEvent);
			expect(mediator.publish).toHaveBeenCalledWith('map:directions', {
				isEnd: false,
				itemId: 1220
			});
		});

		it('can publish call mediator message from button click handler', function() {
			spyOn(mediator, 'publish');
			view.onPhonePick(mockEvent);
			expect(mediator.publish).toHaveBeenCalledWith('phone_numbers:showPhoneNumbers', {
				tripId: 19674,
				itemId: 1220
			});
		});

		it('can publish weather mediator message from button click handler', function() {
			spyOn(mediator, 'publish');
			view.onWeatherPick(mockEvent);
			expect(mediator.publish).toHaveBeenCalledWith('weather:show', {
				tripItemId: 1220
			});
		});

		it('can publish alternate flights mediator message from button click handler', function() {
			spyOn(mediator, 'publish');
			view.onAltFlight(mockEvent);
			expect(mediator.publish).toHaveBeenCalledWith('altflights:show', {
				itemId: 1220
			});
		});

		describe('render', function() {
			var createTripCardView = function() {
				spyOn(TripCardView.prototype, '_getPresenter');
				model = new Backbone.Model({
					id: 123
				});
				model.getMostRelevantEventIndex = $.noop;
				model.isInProgress = $.noop;
				model.startsSoon = $.noop;
				model.fetch = $.noop;
				var view = new TripCardView({
					model: model
				});
				return view;
			};

			it('should exist', function() {
				var view = createTripCardView();
				expect(view.render).toBeTruthy();
			});

			it('should publish view change event', function() {
				spyOn(mediator, 'publish');
				var view = createTripCardView();
				var thingManageReturns = { render: $.noop };
				var manage = function() {
					return thingManageReturns;
				};
				spyOn(thingManageReturns, 'render');
				view.render(manage);
				expect(mediator.publish).toHaveBeenCalledWith(
					'trip_items:feed:change', { tripId: 123 }
				);
			});

			it('subscribes to mediator messages for scrolling left', function() {
				spyOn(mediator, 'subscribe');
				var view = createTripCardView();

				expect(mediator.subscribe).toHaveBeenCalledWith(
					'tripfeed:scrollleft', view.scrollLeft
				);
			});

			it('subscribes to mediator messages for scrolling right', function() {
				spyOn(mediator, 'subscribe');
				var view = createTripCardView();

				expect(mediator.subscribe).toHaveBeenCalledWith(
					'tripfeed:scrollright', view.scrollRight
				);
			});

			it('unsubscribes to mediator messages for scrolling left', function() {
				spyOn(mediator, 'unsubscribe');
				var view = createTripCardView();
				view.cleanup();

				expect(mediator.unsubscribe).toHaveBeenCalledWith(
					'tripfeed:scrollleft', view.scrollLeft
				);
			});

			it('unsubscribes to mediator messages for scrolling right', function() {
				spyOn(mediator, 'unsubscribe');
				var view = createTripCardView();
				view.cleanup();

				expect(mediator.unsubscribe).toHaveBeenCalledWith(
					'tripfeed:scrollright', view.scrollRight
				);
			});

			it("shows card at 0 if the trip doesn't start soon", function() {
				model.isInProgress = function() {
					return false;
				};
				model.startsSoon = function() {
					return false;
				};
				var view = new TripCardView({
					model: model
				});
				expect(view.activeItemIndex).toBe(0);
			});

			it("shows card at 4 if the event index is 3 and trip is in progress", function() {
				model.isInProgress = function() {
					return true;
				};
				model.getMostRelevantEventIndex = function() {
					return 3;
				};
				var view = new TripCardView({
					model: model
				});
				expect(view.activeItemIndex).toBe(4);
			});

			it("shows card at 1 if the event index is 0 and trip starts soon", function() {
				model.isInProgress = function() {
					return false;
				};
				model.startsSoon = function() {
					return true;
				};
				model.getMostRelevantEventIndex = function() {
					return 0;
				};
				var view = new TripCardView({
					model: model
				});
				expect(view.activeItemIndex).toBe(1);
			});
		});
	});
});
