require([
	'jquery', 'handlebars', 'text!templates/trip_feed/flight_card.tmpl'
], function($, Handlebars, template) {

	describe('Flight Card Template', function() {

		var html,
			$el,
			tmpl = Handlebars.compile(template);


		afterEach(function() {
			html = null;
			$el = null;
		});

		it('is a card', function() {
			$el = getHtml();
			expect($el.hasClass('card')).toBeTruthy();
		});

		it('is a flight', function() {
			$el = getHtml();
			expect($el.hasClass('flight')).toBeTruthy();
		});

		it('has an item id attribute for triggering events', function() {
			$el = getHtml({
				id: 876012
			});
			expect($el.data('trip-item-id')).toEqual(876012);
		});

		it('has a start/end attribute', function() {
			$el = getHtml({
				event_type: "end"
			});
			expect($el.data('location')).toEqual("end");
		});

		it('shows the carrier code and flight number', function() {
			$el = getHtml({
				airline_code: "AA",
				flight_number: 2
			});
			expect($el.find("span:contains('AA 2')").length).toEqual(1);
		});

		it('shows the carrier', function() {
			$el = getHtml({
				airline: "TripCase Airlines"
			});
			expect($el.find("h3:contains('TripCase Airlines')").length).toEqual(1);
		});


		function getHtml(context) {
			context = context || {};
			html = tmpl(context);
			return $(html);
		}

	});
});