define(['underscore', 'backbone', 'models/phone_number', 'parsers/location_parser'], function(_, Backbone, PhoneNumberModel, LocationParser) {

	var VehicleLocationDetailParser = {

		parse: function(response) {
			this.clear({
				silent: true
			});
			var phoneNumbers = this.parsePhoneNumbers(response.phones);
			this.addPhoneNumbers(phoneNumbers);
			return this.parseVehicleLocationDetails(response);
		},

		parseVehicleLocationDetails: function(data) {
			var vehicle = LocationParser.parseLocation(data);
			vehicle.named_type = vehicle.type = 'Vehicle';
			vehicle.show_continue = true;
			vehicle.vendor_name = data.vendor.name;
			vehicle.general_location = data.address.general_location;
			vehicle.last_updated = data.last_updated;
			vehicle.operation_times = data.consolidated_operation_times;
			vehicle.general_information = data.general_information;
			vehicle.shuttle_information = data.shuttle_details;
			return vehicle;
		},

		parsePhoneNumbers: function(phonesData) {
			var phoneNumbers = _.map(phonesData, function(phone) {
				return new PhoneNumberModel({
					type: phone.type,
					number: phone.number
				});
			});
			return phoneNumbers;
		}
	};
	return VehicleLocationDetailParser;
});

