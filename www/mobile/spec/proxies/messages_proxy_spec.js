define([
	'proxies/messages_proxy',
	'collections/message_list'
], function(
	MessagesProxy,
	Messages
) {

	describe('Messages Proxy', function() {
		var messages, proxy;

		beforeEach(function() {
			proxy = new MessagesProxy({}, {
				collection: new Messages([], {trip: {id:1}})
			});
		});

		it('should exists', function() {
			expect(MessagesProxy).toBeDefined();
		});

		it('should have sync config', function() {
			spyOn(proxy, 'setupCache');

			proxy.syncConfig('POST', {isToRefresh: true});

			expect(proxy.method).toBe('POST');
			expect(proxy.url).toBe('/mapi/trips/1/messages.json');
			expect(proxy.setupCache).toHaveBeenCalledWith(true);
		});

		it('should set up cache', function() {
			proxy.setupCache(true);

			expect(proxy.cacheKey).toBe('trip_1_messages');
			expect(proxy.invalidationKeys).toEqual(['trip_1_messages']);
			expect(proxy.isToRefresh).toBeTruthy();
		});
	});
});
