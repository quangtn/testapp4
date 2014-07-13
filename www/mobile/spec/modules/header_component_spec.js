define([
	'modules/header/header_component'],
function(
	HeaderComponent) {
	describe('Header Component', function() {
		var component, model;

		beforeEach(function() {
			component = new HeaderComponent();
		});

		describe('header height', function() {
			beforeEach(function() {
				component.$el.append('<div class=header></div>');
			});

			afterEach(function() {
				component.$el.empty();
			});

			it('should handle standard height header', function() {
				component._resizeHeaderHeight();
				expect(component.$el.find('.header--tall').length).toBeFalsy();
			});

			it('should handle tall header', function() {
				component.model.set('isTallHeader', true);
				component._resizeHeaderHeight();
				expect(component.$el.find('.header--tall').length).toBeTruthy();
			});
		});
	});
});