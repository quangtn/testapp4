define([
	'backbone', 'proxies/trip_proxy'
], function(
	Backbone, TripProxy
) {

	describe('Trip Proxy', function() {
		var proxy;

		beforeEach(function() {
			proxy = new TripProxy();
		});

		it('should exist', function() {
			expect(TripProxy).toBeTruthy();
		});

		it('should instantiate', function() {
			expect(proxy instanceof TripProxy).toBeTruthy();
		});

		it('should have invalidateCache', function() {
			expect(proxy.invalidateCache).toBeTruthy();
		});

		describe('sync config', function() {
			beforeEach(function() {
				spyOn(proxy, 'getInvalidationKeys');
			});

			it('should handle read method', function() {
				proxy.model = {id: 1};
				proxy.syncConfig('read', {});
				expect(proxy.url).toBe('/mapi/trips/1.json?suppress_messages=true');
			});
		});

		describe('invalidation keys', function() {
			beforeEach(function() {
				proxy = new TripProxy(null, {
					model: new Backbone.Model({id: 5})
				});
			});

			it('should have the keys for items that this model affects', function () {
				spyOn(proxy, 'getFlightGroupIds').andReturn([1,2,3]);

				var keys = proxy.getInvalidationKeys();

				expect(keys).toContain('trip_list');
				expect(keys).toContain('session');
			});

			it('should have the keys for its associated flight groups', function() {
				spyOn(proxy, 'getFlightGroupIds').andReturn([1,2,3]);

				var keys = proxy.getInvalidationKeys();

				expect(keys).toContain('trip_item_1');
				expect(keys).toContain('trip_item_2');
				expect(keys).toContain('trip_item_3');
			});

			it('should have the key for itself', function() {
				spyOn(proxy, 'getFlightGroupIds').andReturn([1,2,3]);

				var keys = proxy.getInvalidationKeys();

				expect(keys).toContain('trip_5');
			});
		});
	});
});
