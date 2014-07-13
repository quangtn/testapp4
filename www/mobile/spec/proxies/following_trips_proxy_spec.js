define([
	'proxies/following_trips_proxy'],
function(
	FollowingTripsProxy) {

	describe('Following Trips Proxy', function() {
		var proxy;

		it('should initialize', function() {
			proxy = new FollowingTripsProxy();

			expect(proxy.url).toBeFalsy();
			expect(proxy.cacheKey).toEqual('following_trip_list');
			expect(proxy.cacheTTL).toEqual(15);
			expect(proxy.cacheTTLmultiplier).toEqual('minutes');
			expect(proxy.invalidationKeys).toEqual([proxy.cacheKey, 'session']);
		});

		describe('syncing', function() {
			it('should sync', function() {
				proxy.syncConfig('post', {});
				expect(proxy.method).toEqual('post');
			});

			it('should handle refresh', function() {
				proxy.syncConfig('', {isToRefresh: true});
				expect(proxy.isToRefresh).toBeTruthy();
			});

			it('should handle url for active trips', function() {
				proxy.syncConfig('get', {fetchActiveTrips: true});
				expect(proxy.url).toEqual('/mapi/trips/following.json?active=true');
			});

			it('should handle url for past trips', function() {
				proxy.syncConfig('get', {});
				expect(proxy.url).toEqual('/mapi/trips/following.json?active=false');
			});

			it('should handle url for all trips', function() {
				proxy.syncConfig('get', {fetchAllTrips: true});
				expect(proxy.url).toEqual('/mapi/trips/following.json?active=');
			});
		});
	});
});