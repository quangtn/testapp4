define(['helpers/url_helpers'],
function(helpers) {

	describe('URL Helpers', function() {

		it('should exist', function() {
			expect(helpers).toBeTruthy();
		});

		describe('getApiURL', function() {
			it('returns a blank string if api host is blank', function() {
				var apiHost = '';
				var apiURL;

				apiURL = helpers.getApiURL(apiHost);

				expect(apiURL).toEqual('');
			});

			it('prepends the apiProtocol if given', function() {
				var apiHost = 'www.tripcase.com';
				var apiProtocol = 'https://';
				var apiURL;

				apiURL = helpers.getApiURL(apiHost, apiProtocol);

				expect(apiURL).toEqual('https://www.tripcase.com');
			});

			it('adds the double meh :// if the apiProtocol doesnt have it', function() {
				var apiHost = 'www.tripcase.com';
				var apiProtocol = 'https';
				var apiURL;

				apiURL = helpers.getApiURL(apiHost, apiProtocol);

				expect(apiURL).toEqual('https://www.tripcase.com');
			});

			it('prepends http if no apiProtocol given', function() {
				var apiHost = 'www.tripcase.com';
				var apiProtocol = '';
				var apiURL;

				apiURL = helpers.getApiURL(apiHost, apiProtocol);

				expect(apiURL).toEqual('http://www.tripcase.com');
			});
		});

	});

});
