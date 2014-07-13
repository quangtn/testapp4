define(['proxies/proxy'],
function(Proxy) {

	var AirlineListProxy = Proxy.extend({

		syncConfig: function(method, options) {
			this.url = '/mapi/data/airlines.json';
		},
		_getAttrs: function() {
			return {
				search: this.collection.searchTerm
			};
		},

		toJSON: function() {
			return this._getAttrs();
		}
	});

	return AirlineListProxy;

});
