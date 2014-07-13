define(['proxies/proxy'],
function(Proxy) {

	var TripItemsImportProxy = Proxy.extend({

		syncConfig: function(method, options) {
			var tripId = this.model.get('tripId');
			var tripKey = 'trip_' + tripId;
			this. url = '/mapi/trips/' + tripId + '/trip_items/add_itinerary.json';
			this.invalidationKeys = [ tripKey, 'trip_list', 'session' ];
		},

		_getAttrs: function() {
			return this.model.toJSON();
		}

	});

	return TripItemsImportProxy;

});

