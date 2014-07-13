define(['proxies/proxy'],
function(Proxy) {

describe('Proxy', function() {

	it('should exist', function() {
		expect(Proxy).toBeTruthy();
	});

	it('should instantiate', function() {
		var proxy = new Proxy();
		expect(proxy instanceof Proxy).toBeTruthy();
	});

	it('should have invalidateCache', function() {
		var proxy = new Proxy();
		expect(proxy.invalidateCache).toBeTruthy();
	});

	describe('invalidateCache', function() {
		var proxy;
		beforeEach(function() {
			proxy = new Proxy();
		});
		afterEach(function() {
			localStorage.clear();
		});
		it('should get the current invalidation keys', function () {
			spyOn(proxy, 'getInvalidationKeys').andCallThrough();

			proxy.invalidateCache();

			expect(proxy.getInvalidationKeys).toHaveBeenCalled();
		});

		it('should invalidate the cache TTL based on the invalidation keys', function () {
			proxy.invalidationKeys = ['happy', 'sad'];
			spyOn(localStorage, 'setItem');

			proxy.invalidateCache();

			expect(localStorage.setItem).toHaveBeenCalledWith('happycachettl', 0);
			expect(localStorage.setItem).toHaveBeenCalledWith('sadcachettl', 0);
		});

		it('should invalidate the cache TTL based on the dynamic invalidation keys', function () {
			proxy.invalidationKeys = ['happy', 'sad'];
			proxy.getInvalidationKeys = function () {
				var keys = this.invalidationKeys;
				keys.push('dynamicallyAddedKey');
				return keys;
			};

			spyOn(localStorage, 'setItem');

			proxy.invalidateCache();

			expect(localStorage.setItem).toHaveBeenCalledWith('happycachettl', 0);
			expect(localStorage.setItem).toHaveBeenCalledWith('sadcachettl', 0);
			expect(localStorage.setItem).toHaveBeenCalledWith('dynamicallyAddedKeycachettl', 0);
		});

		it('should set its invalidationKeys to the one created by getInvalidationKeys', function() {
			proxy.invalidationKeys = ['happy', 'sad'];
			proxy.getInvalidationKeys = function () {
				var keys = this.invalidationKeys;
				keys.push('dynamicallyAddedKey');
				return keys;
			};
			expect(proxy.invalidationKeys).toEqual(['happy', 'sad']);

			proxy.invalidateCache();

			expect(proxy.invalidationKeys).toEqual(['happy', 'sad', 'dynamicallyAddedKey']);
		});
	});
});

});

