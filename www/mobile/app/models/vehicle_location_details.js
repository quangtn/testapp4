define(['jquery', 'underscore', 'backbone', 'models/model', 'models/location', 'parsers/vehicle_location_detail_parser', 'proxies/vehicle_location_detail_proxy', 'collections/phone_number_list'], function($, _, Backbone, Model, Location, VehicleLocationDetailParser, VehicleLocationDetailProxy, PhoneNumberList) {

	var VehicleLocationDetail = Location.extend({

		initialize: function(attrs, options) {
			_.extend(this, VehicleLocationDetailParser);
			this.proxy = new VehicleLocationDetailProxy({},
			{
				model: this
			});
			this.phoneNumbers = new PhoneNumberList();
		},

		getPhoneNumbers: function() {
			return this.phoneNumbers;
		},

		addPhoneNumbers: function(phoneNumbers) {
			this.phoneNumbers.add(phoneNumbers);
		},

		clear: function() {
			Location.prototype.clear.call(this);
			this.phoneNumbers.reset();
		}
	});

	return VehicleLocationDetail;

});

