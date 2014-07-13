define([
	'models/message'
], function(
	Message
) {
	describe('Message', function() {
		var message;

		beforeEach(function() {
			message = new Message();
		});

		it('should initialize', function() {
			expect(message).toBeDefined();
		});

		it('should return isToolLink', function() {
			message.set({
				'event_action': 'GoToTool',
				'tool_name': 'amex_benefits'
			});

			expect(message.isToolLink()).toBeTruthy();
		});
	});
});