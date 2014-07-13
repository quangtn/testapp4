require([
	'jquery', 'handlebars', 'text!templates/trip_feed/plan_event_card.tmpl'
], function($, Handlebars, template) {

	describe('Plan Event Card Template', function() {

		var html,
			$el,
			tmpl = Handlebars.compile(template);

		afterEach(function() {
			html = null;
			$el = null;
		});

		it("displays label text when there is no clock", function() {
			$el = getHtml({
				hasClockTimer: false,
				labelText: "label text"
			});
			var headerText = $el.find('.plan-event-header .cell:first-child').text().trim();
			expect(headerText).toEqual("label text");
		});

		function getHtml(context) {
			context = context || {};
			html = tmpl(context);
			return $(html);
		}

	});

});