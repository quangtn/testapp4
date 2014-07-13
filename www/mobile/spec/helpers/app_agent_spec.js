define(['helpers/app_agent'],
function(AppAgent) {

	describe('AppAgent', function() {

		it('should exist', function() {
			expect(AppAgent).toBeTruthy();
		});

		it('should get the app agent', function() {
			window.screen = {};
			window.screen.availWidth = '50';
			window.screen.availHeight = '60';
			var appAgent = AppAgent.getAppAgent();
			var re = /TripCase\/5\s\{"touch":true,"app_version":"\d+\.\d+\.\d+","locale":"en-US","screen_size":"50x60"\}/i;
			expect(appAgent).toMatch(re);
			delete window.screen;
		});

	});

});
