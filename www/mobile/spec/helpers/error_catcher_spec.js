define(['helpers/error_catcher'],
function() {

	xdescribe('ErrorCatcher', function() {
		beforeEach(function() {
			var error_smoke_checker = document.createElement("div");
			error_smoke_checker.id = "smoke-checker";
			error_smoke_checker.style.backgroundColor = "white";
			error_smoke_checker.innerHTML = "Smoke Check for Background Change";
			document.body.appendChild(error_smoke_checker);

			var error_get_request = document.createElement("error-propagate");
			error_get_request.id = 'error-propagate';
			error_get_request.src = '';
			document.body.appendChild(error_get_request);

			spyOn(XMLHttpRequest.prototype, 'open').andCallThrough();
			spyOn(XMLHttpRequest.prototype, 'send');

			window.onerror('simulate', 'throwing', 'an error');
		});

		it('should turn background blue on error', function() {
			var error_smoke_checker = document.getElementById('smoke-checker');
			expect(error_smoke_checker.style.backgroundColor).toBe('blue');
		});

		it('should turn the error img src to our data', function() {
			var error_propagate = document.getElementById('error-propagate');
			expect(error_propagate.src).toBe('/error_check.jpg?where=here');
		});

		it("should have sent an XMLHttpRequest", function() {
			expect(XMLHttpRequest.prototype.open).toHaveBeenCalled();
			expect(XMLHttpRequest.prototype.send).toHaveBeenCalled();
		});
	});

});
