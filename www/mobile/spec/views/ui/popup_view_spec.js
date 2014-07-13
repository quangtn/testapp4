define([
	'jquery', 'backbone', 'handlebars', 'views/ui/popup_view', 'text!templates/logout_confirm.tmpl'
], function(
	$, Backbone, Handlebars, PopUpView, LogoutConfirmTemplate
) {

	describe('summary list view', function() {

		var popup;
		var mockApp;

		beforeEach(function() {
			popup = new PopUpView({
				template: LogoutConfirmTemplate,
				presenter: {}
			});

			mockApp = document.createElement('div');
			mockApp.innerHTML = "<div id='app-page'></div>";
		});

		it('should remove itself from DOM on cancel', function() {
			popup.render();

			popup.onCancel(document.createEvent('Event'));

			var foundIt = $(mockApp).find('.pop-up').length;
			expect(foundIt).toBeFalsy();
		});

	});

});
