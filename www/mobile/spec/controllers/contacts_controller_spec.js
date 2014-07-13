define([
	'namespace',
	'mediator',
	'analytics',
	'controllers/contacts_controller'],
function(
	app,
	mediator,
	analytics,
	ContactsController){

	describe('Contacts Controller', function() {
		var controller = new ContactsController();

		it('should initialize', function() {
			spyOn(mediator, 'subscribe');

			controller.initialize();
			expect(controller).toBeDefined();
			expect(controller.workflow).toBeDefined();
			expect(mediator.subscribe).toHaveBeenCalledWith(
				'contacts:show', controller.onShowContacts, controller);
		});
		it('should show contacts and track analytics', function() {
			spyOn(controller.workflow, 'transition');
			spyOn(controller.workflow, 'handle');
			spyOn(analytics, 'trackEvent');

			controller.onShowContacts();
			expect(controller.workflow.transition).toHaveBeenCalledWith('uninitialized');
			expect(controller.workflow.handle).toHaveBeenCalledWith('initialize', {controller: controller});
			expect(controller.workflow.transition).toHaveBeenCalledWith('showContacts');
			expect(analytics.trackEvent).toHaveBeenCalledWith('Contacts', 'Show', app);
		});
	});
});