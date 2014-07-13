require(['namespace', 'backbone', 'underscore',
	'text!fixtures/mock_trip_response.json',
	'parsers/trip_parser'
],
	function(app, Backbone, _, mockTripResponseString, TripParser) {

		describe('Generic Trip Item Parser', function() {

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

			it('can parse generic food & drink item from trip service response', function() {
				var foodItem;

				tripModel.parse(mockTripResponse);

				foodItem = tripModel.tripItems.at(3);
				expect(foodItem).toBeDefined();
				expect(foodItem.get('calendar_end')).toEqual('2013-06-11T16:00:00');
				expect(foodItem.get('calendar_end_timezone_name')).toEqual('America/Antigua');
				expect(foodItem.get('calendar_start')).toEqual('2013-06-11T13:00:00');
				expect(foodItem.get('calendar_start_timezone_name')).toEqual('America/Antigua');
				expect(foodItem.get('confirmation_number')).toEqual('C34vd56');
				expect(foodItem.get('end_date')).toEqual('2013-06-11T16:00:00');
				expect(foodItem.get('end_time')).toEqual('2013-06-11T16:00:00');
				expect(foodItem.get('id')).toEqual(75947);
				expect(foodItem.get('is_trip_active')).toEqual(true);
				expect(foodItem.get('map_name')).toEqual('Beach picinic');
				expect(foodItem.get('name')).toEqual('Beach picinic');
				expect(foodItem.get('named_type')).toEqual('Generic');
				expect(foodItem.get('note')).toEqual('Transportation from the hotel is provided');
				expect(foodItem.get('read_only')).toEqual(false);
				expect(foodItem.get('short_description')).toEqual('Beach picinic');
				expect(foodItem.get('start_date')).toEqual('2013-06-11T13:00:00');
				expect(foodItem.get('start_time')).toEqual('2013-06-11T13:00:00');
				expect(foodItem.get('trip_id')).toEqual(19674);
				expect(foodItem.get('type')).toEqual('Food_drink');
			});

			it('can parse generic ferry trip item from trip service response', function() {
				var cruiseItem;

				tripModel.parse(mockTripResponse);

				cruiseItem = tripModel.tripItems.at(4);
				expect(cruiseItem).toBeDefined();
				expect(cruiseItem.get('calendar_end')).toEqual('2013-06-15T23:30:00');
				expect(cruiseItem.get('calendar_end_timezone_name')).toEqual('America/Aruba');
				expect(cruiseItem.get('calendar_start')).toEqual('2013-06-13T16:30:00');
				expect(cruiseItem.get('calendar_start_timezone_name')).toEqual('America/Antigua');
				expect(cruiseItem.get('confirmation_number')).toEqual('123456789');
				expect(cruiseItem.get('end_date')).toEqual('2013-06-15T23:30:00');
				expect(cruiseItem.get('end_time')).toEqual('2013-06-15T23:30:00');
				expect(cruiseItem.get('id')).toEqual(75948);
				expect(cruiseItem.get('is_trip_active')).toEqual(true);
				expect(cruiseItem.get('map_name')).toEqual('Dinner Cruise');
				expect(cruiseItem.get('name')).toEqual('Dinner Cruise');
				expect(cruiseItem.get('named_type')).toEqual('Generic');
				expect(cruiseItem.get('note')).toEqual('Dinner and open bar are included');
				expect(cruiseItem.get('read_only')).toEqual(false);
				expect(cruiseItem.get('short_description')).toEqual('Dinner Cruise');
				expect(cruiseItem.get('start_date')).toEqual('2013-06-13T16:30:00');
				expect(cruiseItem.get('start_time')).toEqual('2013-06-13T16:30:00');
				expect(cruiseItem.get('trip_id')).toEqual(19674);
				expect(cruiseItem.get('type')).toEqual('Cruise');
			});

		});
	}
);