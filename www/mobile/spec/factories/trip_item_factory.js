define([
	'factory',
	'models/trip_item',
	'models/trip',
	'models/location'
], function(
	Factory,
	TripItem,
	Trip,
	Location
) {
	var _TripItem = TripItem.extend({
		initialize: function(attributes) {
			TripItem.prototype.initialize.apply(this, arguments);
			this.setStartLocation(attributes.startLocation);
			this.set({
				type: attributes.type,
				named_type: attributes.named_type
			});
		}
	});

	var TripItemFactory = {
		build: Factory.createFactoryMethod(_TripItem, {
			startLocation: new Location(),
			type: 'activity',
			named_type: 'generic'
		}, {
			trip: new Trip()
		})
	};

	return TripItemFactory;
});