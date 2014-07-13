define([
	'helpers/error_handler', 'mediator'
], function(ErrorHandler, mediator) {

	describe("ErrorHandler", function() {

		it('should exist', function() {
			expect(ErrorHandler).toBeTruthy();
		});

		it('should use the default error for blank service responses', function() {
			spyOn(mediator, "publish");
			ErrorHandler._handleServerError({
				responseText: ''
			});
			expect(mediator.publish).toHaveBeenCalledWith('error:trigger', 'service', [{
				message: 'An internal error occurred while processing your request'
			}]);
		});

		it('should ignore whitespace in blank service responses', function() {
			spyOn(mediator, "publish");
			ErrorHandler._handleServerError({
				responseText: ' '
			});
			expect(mediator.publish).toHaveBeenCalledWith('error:trigger', 'service', [{
				message: 'An internal error occurred while processing your request'
			}]);
		});

		it('should use the service response error', function() {
			spyOn(mediator, "publish");
			ErrorHandler._handleServerError({
				responseText: 'service error'
			});
			expect(mediator.publish).toHaveBeenCalledWith('error:trigger', 'service', [{
				message: 'service error'
			}]);
		});

		describe('Require Terms', function() {
			it('should not require terms if not given an error', function() {
				var shouldHandleTerms;

				shouldHandleTerms = ErrorHandler._requireTerms();

				expect(shouldHandleTerms).toBeFalsy();
			});

			it('should not require terms given a response that isnt 401', function() {
				var shouldHandleTerms;

				shouldHandleTerms = ErrorHandler._requireTerms({
					status: 500
				});

				expect(shouldHandleTerms).toBeFalsy();
			});

			it('should not require terms given a response that is 401 but has no response text', function() {
				var shouldHandleTerms;

				shouldHandleTerms = ErrorHandler._requireTerms({
					status: 401
				});

				expect(shouldHandleTerms).toBeFalsy();
			});

			it('should require terms given a response that includes "terms" and is status 401', function() {
				var shouldHandleTerms;

				shouldHandleTerms = ErrorHandler._requireTerms({
					status: 401,
					responseText: '{"error":"You must accept Terms and Conditions."}'
				});

				expect(shouldHandleTerms).toBeTruthy();
			});

		});

		describe('handleRequireTerms', function() {
			it('should return true when called', function() {
				var handleResponse;
				spyOn(mediator, 'publish');

				handleResponse = ErrorHandler._handleRequireTerms();

				expect(handleResponse).toEqual(true);
			});

			it('should publish the terms:prompt message', function() {
				spyOn(mediator, 'publish');

				ErrorHandler._handleRequireTerms();

				expect(mediator.publish).toHaveBeenCalledWith('terms:prompt');
			});
		});

		describe('handle', function() {
			it('should return true when handleRequireTerms()', function() {
				var handleResponse;
				spyOn(mediator, 'publish');
				spyOn(ErrorHandler, '_requireTerms').andReturn(true);

				handleResponse = ErrorHandler.handle();

				expect(handleResponse).toEqual(true);
			});
		});


	});

});