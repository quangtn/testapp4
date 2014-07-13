define(['proxies/proxy'],
function(Proxy) {

	var SeatMapProxy = Proxy.extend({

		syncConfig: function(method, options) {
			this.url = '/mapi/services/flight_seat_map.json';
		},

		_getAttrs: function() {
			return {
				trip_item: this.model && this.model.getAirTripItemId()
			};
		},
		toJSON: function() {
			return this._getAttrs();
		}
	});

	return SeatMapProxy;

});
