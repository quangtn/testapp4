require(['namespace', 'backbone', 'underscore',
	'text!fixtures/mock_trip_response.json',
	'parsers/trip_parser'
],
	function(app, Backbone, _, mockTripResponseString, TripParser) {

		describe('Hotel Trip Item Parser', function() {

			var mockTripResponse, tripModel;

			beforeEach(function() {
				tripModel = new Backbone.Model();
				_.extend(tripModel, TripParser);

				mockTripResponse = JSON.parse(mockTripResponseString);
			});

			afterEach(function() {
				tripModel = null;
				mockTripResponse = null;
			});

			it('can create application objects for testing', function() {
				expect(mockTripResponseString).toBeDefined();
				expect(TripParser).toBeDefined();

				expect(mockTripResponse).toBeDefined();
				expect(tripModel).toBeDefined();
				expect(tripModel.parse).toBeDefined();
			});

			it('can parse hotel trip item from trip service response', function() {
				var hotelItem;

				tripModel.parse(mockTripResponse);

				hotelItem = tripModel.tripItems.at(2);
				expect(hotelItem).toBeDefined();
				expect(hotelItem.get('amenities').length).toEqual(6);
				expect(hotelItem.get('amenities')[0].category).toEqual('Property');
				expect(hotelItem.get('amenities')[0].code).toEqual('FITNESS_FACILITY');
				expect(hotelItem.get('amenities')[0].description).toEqual('Fitness facility on site or within walking distance');
				expect(hotelItem.get('calendar_end')).toEqual('2013-06-15T12:10:00');
				expect(hotelItem.get('calendar_end_timezone_name')).toEqual('America/Antigua');
				expect(hotelItem.get('calendar_start')).toEqual('2013-06-09T14:50:00');
				expect(hotelItem.get('calendar_start_timezone_name')).toEqual('America/Antigua');
				expect(hotelItem.get('cancellation_number')).not.toBeDefined();
				expect(hotelItem.get('confirmation_number')).toEqual('ABC123');
				expect(hotelItem.get('end_date')).toEqual('2013-06-15T12:10:00');
				expect(hotelItem.get('end_time')).toEqual('2013-06-15T12:10:00');
				expect(hotelItem.get('general_location')).toEqual('St Johns, AG');
				expect(hotelItem.get('id')).toEqual(75946);
				expect(hotelItem.get('is_trip_active')).toEqual(true);
				expect(hotelItem.get('item_title')).toEqual('The Villas at Sunset Lane');
				expect(hotelItem.get('long_description')).not.toBeDefined();
				expect(hotelItem.get('map_name')).toEqual('St Johns, AG');
				expect(hotelItem.get('multi_media_objects').length).toEqual(12);
				expect(hotelItem.get('multi_media_objects')[0].height).toEqual(300);
				expect(hotelItem.get('multi_media_objects')[0].type).toEqual('Large');
				expect(hotelItem.get('multi_media_objects')[0].update_date).toEqual('2011-09-29');
				expect(hotelItem.get('multi_media_objects')[0].url).toEqual('http://m.travelpn.com/images/st_johns/hotel/1/144841/Beach_E_1.jpg');
				expect(hotelItem.get('multi_media_objects')[0].width).toEqual(300);
				expect(hotelItem.get('multi_media_objects')[11].height).toEqual(98);
				expect(hotelItem.get('multi_media_objects')[11].type).toEqual('ThumbnailLarge');
				expect(hotelItem.get('multi_media_objects')[11].update_date).toEqual('2011-09-29');
				expect(hotelItem.get('multi_media_objects')[11].url).toEqual('http://m.travelpn.com/images/st_johns/hotel/1/144841/Beach_H_1.jpg');
				expect(hotelItem.get('multi_media_objects')[11].width).toEqual(130);
				expect(hotelItem.get('name')).toEqual('The Villas at Sunset Lane');
				expect(hotelItem.get('named_type')).toEqual('Hotel');
				expect(hotelItem.get('note')).toEqual('Oceanfront room on request');
				expect(hotelItem.get('num_floors')).toEqual(1);
				expect(hotelItem.get('num_rooms')).toEqual(13);
				expect(hotelItem.get('read_only')).toEqual(false);
				expect(hotelItem.get('star_rating')).not.toBeDefined();
				expect(hotelItem.get('start_date')).toEqual('2013-06-09T14:50:00');
				expect(hotelItem.get('start_time')).toEqual('2013-06-09T14:50:00');
				expect(hotelItem.get('trip_id')).toEqual(19674);
				expect(hotelItem.get('type')).toEqual('Hotel');
			});
		});
	}
);