require(['jquery', 'handlebars', 'text!fixtures/mock_trip_response.json',
	'models/trip', 'text!templates/trip_feed/trip_cards.tmpl',
	'presenters/trip_events_presenter'
],
	function($, Handlebars, MockTripResponseString, Trip, ViewTemplate, TripEventsPresenter) {
		describe('Trip Card Template', function() {
			var mockTripResponse, model, context, data;
			var html, $el;

			mockTripResponse = JSON.parse(MockTripResponseString);
			model = new Trip();
			model.set(model.parse(mockTripResponse));
			context = Handlebars.compile(ViewTemplate);
			data = new TripEventsPresenter({model: model});
			html = context(data);
			$el = $(html);

			it('can create html and DOM element for testing', function() {
				expect(html).toBeDefined();
				expect($el).toBeDefined();
			});

			it('can render DOM hierarchy against the model', function() {
				expect($el).toBeDefined();
				expect($el.attr("id")).toEqual("cards");
				expect($el.find(".flight").length).toEqual(2);
			});

			describe('can render trip item cards', function() {
				var $cards = $el.find('.card');

				it('of type air', function() {
					expect($($cards[0]).data('trip-item-type')).toEqual('air');
				});

				it('of type vehicle', function() {
					expect($($cards[1]).data('trip-item-type')).toEqual('vehicle');
				});

				it('of type hotel', function() {
					expect($($cards[2]).data('trip-item-type')).toEqual('hotel');
				});

				it('of type food & drink', function() {
					expect($($cards[3]).data('trip-item-type')).toEqual('food_drink');
				});

				it('of type cruise', function() {
					expect($($cards[4]).data('trip-item-type')).toEqual('cruise');
				});
			});
		});
	}
);