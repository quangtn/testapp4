define([
	'factory',
	'models/vehicle_trip_item',
	'models/trip',
	'models/location'
], function(
	Factory,
	VehicleTripItem,
	Trip,
	Location
) {
	var VehicleTripItemFactory = {
		build: Factory.createFactoryMethod(VehicleTripItem, null, {
			trip: new Trip(),
			start_location: new Location({vendor_code: 'aa'}),
			end_location: new Location({vendor_code: 'aa'})
		})
	};

	return VehicleTripItemFactory;
});