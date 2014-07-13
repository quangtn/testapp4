define([
	'factory',
	'models/hotel_trip_item',
	'models/trip',
	'models/location'
], function(
	Factory,
	HotelTripItem,
	Trip,
	Location
) {
	var HotelTripItemFactory = {
		build: Factory.createFactoryMethod(HotelTripItem, null, {
			trip: new Trip()
		})
	};

	return HotelTripItemFactory;
});