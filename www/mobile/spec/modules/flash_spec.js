require(['modules/flash'],
function(Flash) {

	describe('Flash', function() {

		var flash;

		beforeEach(function () {
			flash = new Flash();
		});

		it('should exist', function() {
			expect(Flash).toBeTruthy();
		});

		it('should initialize', function() {
			expect(flash).toBeDefined();
		});

		it('should get errors', function() {
			flash.errors = ['hi', 'there'];

			expect(flash.getErrors()).toEqual(['hi', 'there']);
		});

		it('should clear the errors once you get them', function() {
			flash.errors = ['hi', 'there'];

			expect(flash.getErrors()).toEqual(['hi', 'there']);
			expect(flash.getErrors()).toEqual([]);
		});

		describe('add error', function() {

			it('should add one error', function() {
				flash.addError('hi');

				expect(flash.getErrors()).toEqual(['hi']);
			});

			it('should add multiple errors', function() {
				flash.addErrors(['hi', 'there']);

				expect(flash.getErrors()).toEqual(['hi', 'there']);
			});

			it('should return the new number of errors', function() {
				flash.errors = ['one'];
				expect(flash.addError('two')).toEqual(2);
				expect(flash.addErrors(['three', 'four'])).toEqual(4);
			});

			it('should append to existing errors', function() {
				flash.errors = ['one', 'two'];
				flash.addErrors(['three', 'four']);

				expect(flash.getErrors()).toEqual(['one', 'two', 'three', 'four']);
			});

		});

		describe('add error from URI', function() {

			it('should add error with decoded message', function() {
				var encodedError = "A%20TripCase%20account%20already%20exists%20with%20the%20email%20%3Cstrong%3Esean%40moubry.com%3C%2Fstrong%3E";
				var decodedError = "A TripCase account already exists with the email <strong>sean@moubry.com</strong>";
				spyOn(flash, 'addError');
				spyOn(window, 'decodeURIComponent').andReturn(decodedError);

				flash.addErrorFromURI(encodedError);

				expect(decodeURIComponent).toHaveBeenCalledWith(encodedError);
				expect(flash.addError).toHaveBeenCalledWith(decodedError);
			});

		});

	});

});
