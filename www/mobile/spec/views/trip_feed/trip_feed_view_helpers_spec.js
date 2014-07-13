require([
	'views/trip_feed/trip_feed_view_helpers', 'moment'
], function(helpers, moment) {

	describe('Trip Feed View Helpers', function() {

		it('shows the status indicator for next 24 hour flights', function() {
			var scheduledTime = moment();
			var blockOutput = helpers.ifShowStatusIndicator(scheduledTime, {
				fn: function() {
					return "status indicator content";
				}
			});
			expect(blockOutput).toEqual("status indicator content");
		});

		it('hides the status indicator for flights more than 24 hours out', function() {
			var scheduledTime = moment().add('hours', 25);
			var blockOutput = helpers.ifShowStatusIndicator(scheduledTime, {
				fn: function() {
					return "status indicator content";
				}
			});
			expect(blockOutput).toBeUndefined();
		});

		it('hides the status indicator for flights more than 24 hours past', function() {
			var scheduledTime = moment().subtract('hours', 25);
			var blockOutput = helpers.ifShowStatusIndicator(scheduledTime, {
				fn: function() {
					return "status indicator content";
				}
			});
			expect(blockOutput).toBeUndefined();
		});

		it('styles the status indicator with Canceled', function() {
			var className = helpers.statusIndicatorClass(true);
			expect(className).toEqual("canceled");
		});

		it('styles the status indicator with Delayed', function() {
			var className = helpers.statusIndicatorClass(false, 'delayed');
			expect(className).toEqual("delayed");
		});

		it('styles the status indicator with OnTime', function() {
			var className = helpers.statusIndicatorClass(false);
			expect(className).toEqual("on-time");
		});

		it('has a Canceled status indicator', function() {
			var statusText = helpers.statusIndicatorText(true);
			expect(statusText).toEqual("CANCELED");
		});

		it('has a Delayed status indicator', function() {
			var statusText = helpers.statusIndicatorText(false, 'delayed');
			expect(statusText).toEqual("delayed");
		});

		it('has an OnTime status indicator', function() {
			var statusText = helpers.statusIndicatorText(false);
			expect(statusText).toEqual("On time");
		});

		it('styles the departure time for canceled flights', function() {
			var className = helpers.departureTimeClass(true);
			expect(className).toEqual("canceled");
		});

		it('styles the arrival time for canceled flights', function() {
			var className = helpers.arrivalTimeClass(true);
			expect(className).toEqual("canceled");
		});

		it('has an alert class if the alert exists', function() {
			var className = helpers.alertClassIf("asdf");
			expect(className).toEqual("alert");
		});

		it('does not have an alert class if the alert does not exist', function() {
			var className = helpers.alertClassIf();
			expect(className).toBeUndefined();
		});

	});

});