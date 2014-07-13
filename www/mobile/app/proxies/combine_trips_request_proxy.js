define(['proxies/proxy'],
function(Proxy) {

	var CombineTripsRequestProxy = Proxy.extend({

	syncConfig: function(method, options) {
		if (method === 'read') {
			this.url = '/mapi/merge_trips/pre_merge.json?';
		} else {
			this.url = '/mapi/merge_trips/merge.json?';
		}
	},

	_getAttrs: function() {
		return {
			trip_ids: this.model.getTripIds().join(","),
			name: this.model.get('name')
		};
	},

	toJSON: function() {
		return this._getAttrs();
	}

	});

	return CombineTripsRequestProxy;
});
