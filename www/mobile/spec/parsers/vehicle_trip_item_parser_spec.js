require(['namespace', 'backbone', 'underscore',
	'text!fixtures/mock_trip_response.json',
	'parsers/trip_parser'
],
	function(app, Backbone, _, mockTripResponseString, TripParser) {

		describe('Vehicle Trip Item Parser', function() {

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

			it('can parse vehicle trip item from trip service response', function() {
				var vehicleItem;

				tripModel.parse(mockTripResponse);

				vehicleItem = tripModel.tripItems.at(1);
				expect(vehicleItem).toBeDefined();
				expect(vehicleItem.get('calendar_end')).toEqual('2013-06-15T15:10:00');
				expect(vehicleItem.get('calendar_end_timezone_name')).toEqual('America/Antigua');
				expect(vehicleItem.get('calendar_start')).toEqual('2013-06-09T13:50:00');
				expect(vehicleItem.get('calendar_start_timezone_name')).toEqual('America/Antigua');
				expect(vehicleItem.get('confirmation_number')).toEqual('N2177624-');
				expect(vehicleItem.get('end_date')).toEqual('2013-06-15T15:10:00');
				expect(vehicleItem.get('end_time')).toEqual('2013-06-15T15:10:00');
				expect(vehicleItem.get('general_information').length).toEqual(5);
				expect(vehicleItem.get('general_information')[0]).toEqual('Minimum rentals age - 21 drivers age 21-24 ... No charge');
				expect(vehicleItem.get('general_information')[1]).toEqual('Under age surcharge applies to under age 25 drivers. Prices range from 6.00 to 35.00 per day depending on the location selected.');
				expect(vehicleItem.get('general_information')[2]).toEqual('Must meet same rental requirements as renter.');
				expect(vehicleItem.get('general_information')[3]).toEqual('One way rentals may include capped mileage on rates designated for one way service. One way rentals must be booked in advance. Not all vehicles are available for one way service. Renters using their corporate account rate will receive their applicable mileage, whether capped or unlimited. One way rentals may be subject to a drop charge and when applicable, will be displayed upon confirmation.');
				expect(vehicleItem.get('general_information')[4]).toEqual('Vehicles must be returned with a full tank of gas or local refueling charges will apply.');
				expect(vehicleItem.get('general_location')).toEqual('St Johns, AG');
				expect(vehicleItem.get('id')).toEqual(75943);
				expect(vehicleItem.get('is_trip_active')).toEqual(true);
				expect(vehicleItem.get('item_title')).toEqual('Dollar Rent-A-Car');
				expect(vehicleItem.get('itinerary_locator')).toEqual('HSWTFU');
				expect(vehicleItem.get('itinerary_ref')).toEqual('0');
				expect(vehicleItem.get('last_updated')).toEqual('2013-02-15T17:00:00');
				expect(vehicleItem.get('map_name')).toEqual('Dollar Rent-A-Car');
				expect(vehicleItem.get('name')).toEqual('Dollar Rent-A-Car');
				expect(vehicleItem.get('named_type')).toEqual('Vehicle');
				expect(vehicleItem.get('operation_times').length).toEqual(1);
				expect(vehicleItem.get('operation_times')[0].closed).toEqual(false);
				expect(vehicleItem.get('operation_times')[0].end_day).toEqual('Sun');
				expect(vehicleItem.get('operation_times')[0].end_time).toEqual('22:00:00');
				expect(vehicleItem.get('operation_times')[0].start_day).toEqual('Mon');
				expect(vehicleItem.get('operation_times')[0].start_time).toEqual('08:00:00');
				expect(vehicleItem.get('operation_times')[0].end_day).toEqual('Sun');
				expect(vehicleItem.get('note')).toEqual('');
				expect(vehicleItem.get('shuttle_information').length).toEqual(1);
				expect(vehicleItem.get('shuttle_information')[0].content).toEqual('Pick up is available from hotels at no charge. . Shuttle service to and from the cruise terminal is available.  Customer must provide the name of the ship at the time of rental, or they can ask for the location at the ministry of information desk once they arrive. There is no charge.  Customer will need to provide a valid drivers license and credit card.  *see credit cards*');
				expect(vehicleItem.get('shuttle_information')[0].information).toEqual('P');
				expect(vehicleItem.get('start_date')).toEqual('2013-06-09T13:50:00');
				expect(vehicleItem.get('start_time')).toEqual('2013-06-09T13:50:00');
				expect(vehicleItem.get('trip_id')).toEqual(19674);
				expect(vehicleItem.get('type')).toEqual('Vehicle');
				expect(vehicleItem.get('vehicle_desc')).toEqual('Compact Car');
			});

		});
	}
);