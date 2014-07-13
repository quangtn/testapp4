define(['models/terms'], function(Terms) {
	describe("Terms Model", function() {

		it("should exist", function() {
			expect(Terms).toBeTruthy();
		});

		it("should initialize", function() {
			var model = new Terms();
			expect(model).toBeDefined();
		});

		it('should initialize a proxy', function() {
			var model = new Terms();
			expect(model.proxy).toBeDefined();
		});

		it('should call save when accepting terms', function() {
			var model = new Terms();
			spyOn(model, 'save');

			model.accept();

			expect(model.save).toHaveBeenCalled();
		});

	});
});