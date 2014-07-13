define(['proxies/proxy'], function(Proxy) {

	var VehicleLocationDetailProxy = Proxy.extend({

		syncConfig: function() {
			this.url = '/mapi/services/vehicle_location_detail.json';
		},

		_getAttrs: function() {
			return {
				vendor_code: this.model.get('vendor_code'),
				location_code: this.model.get('location_code')
			};
		},

		toJSON: function() {
			return this._getAttrs();
		}
	});

	return VehicleLocationDetailProxy;
});

