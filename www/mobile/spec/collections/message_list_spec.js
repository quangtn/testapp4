define([
	'collections/message_list'
], function(
	Messages
) {

	describe('messages', function() {
		var trip, messages;

		beforeEach(function() {
			trip = {};

			messages = new Messages([], {
				trip: trip
			});
		});

		it('should exists', function() {
			expect(Messages).toBeDefined();
		});

		it('should initialize', function() {
			expect(messages.isLegacy).toBeFalsy();
			expect(messages.isFetching).toBeFalsy();
			expect(messages.proxy).toBeDefined();
			expect(messages.trip).toBe(trip);
		});
	});
});
