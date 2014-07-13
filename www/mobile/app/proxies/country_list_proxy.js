define(['proxies/proxy'],
function(Proxy) {

	var CountryListProxy = Proxy.extend({

		syncConfig: function(method, options) {
			this.url = '/mapi/data/countries.json';
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

	return CountryListProxy;

});
