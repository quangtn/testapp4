require(['jquery', 'text!fixtures/mock_search_vehicle_locations_response.json',
	'collections/vehicle_location_list'],
	function($, MockLocationsResponseString, VehicleLocationList) {

		describe('Vehicle Location List Collection', function() {

			var vehicleLocationList, mockLocationsResponse, firstLocation;

			mockLocationsResponse = JSON.parse(MockLocationsResponseString);

			beforeEach(function() {
				spyOn($, 'ajax').andCallFake(function(options) {
					options.success(mockLocationsResponse);
				});

				vehicleLocationList = new VehicleLocationList();
				vehicleLocationList.setLocation({
					lat: 32.942549,
					lng: -97.133445
				});
				vehicleLocationList.fetch();

				firstLocation = vehicleLocationList.at(0);
			});


			it('can create application objects for testing', function() {
				expect(mockLocationsResponse).toBeDefined();
				expect(vehicleLocationList).toBeDefined();
			});

			it('can call .fetch passing ajax with proper params', function() {
				expect($.ajax.mostRecentCall.args[0].dataType).toEqual('json');
				expect($.ajax.mostRecentCall.args[0].type).toEqual('GET');
				expect($.ajax.mostRecentCall.args[0].url).toMatch(/\/mapi\/geocodes\/search_vehicle_locations.json/);
				expect($.ajax.mostRecentCall.args[0].success).toBeDefined();
			});

			it('can fetch and store all vehicle locations from a mocked service response', function() {
				expect(vehicleLocationList.length).toEqual(72);
				expect(vehicleLocationList.at(0)).toBeDefined();
				expect(vehicleLocationList.at(71)).toBeDefined();
				expect(vehicleLocationList.at(72)).toBeUndefined();
			});

			it('can store formatted address lines from first entry of mock service call', function() {
				expect(firstLocation.get('address_lines')).toBeDefined();
				expect(firstLocation.get('address_lines')[0]).toEqual('1816 North 24th Street');
				expect(firstLocation.get('address_lines')[1]).toEqual('Dallas, TX 75261-9428');
			});

			it('can store lat/lng from first entry of mock service call', function() {
				expect(firstLocation.get('lat')).toBeUndefined();
				expect(firstLocation.get('lng')).toBeUndefined();
			});

			it('can store address details from first entry of mock service call', function() {
				expect(firstLocation.get('city')).toEqual('Dallas');
				expect(firstLocation.get('country')).toEqual('US');
				expect(firstLocation.get('county')).toBeUndefined();
				expect(firstLocation.get('postal_code')).toEqual('75261-9428');
				expect(firstLocation.get('state')).toEqual('TX');
				expect(firstLocation.get('street')).toEqual('1816 North 24th Street');
			});

			it('can store general business info from first entry of mock service call', function() {
				expect(firstLocation.get('label')).toBeUndefined();
				expect(firstLocation.get('name')).toEqual('AVIS Rent-A-Car');
				expect(firstLocation.get('one_line_description')).toBeUndefined();
				expect(firstLocation.get('property_id')).toBeUndefined();
				expect(firstLocation.get('type')).toBeUndefined();
				expect(firstLocation.get('vendor_code')).toEqual('ZI');
			});

			it('can store general location details from first entry of mock service call', function() {
				expect(firstLocation.get('airport_code')).toBeUndefined();
				expect(firstLocation.get('general_location')).toEqual('Dallas, TX');
				expect(firstLocation.get('location_code')).toEqual('DFWC022');
				expect(firstLocation.get('trip_location_reference')).toBeUndefined();
			});

			it('can store search distance details from first entry of mock service call', function() {
				expect(firstLocation.get('search_distance_km')).toEqual('0.94951296');
				expect(firstLocation.get('search_distance_mi')).toEqual('0.59');
			});

			it('can store traffic info from first entry of mock service call', function() {
				expect(firstLocation.get('start_time_hint')).toBeUndefined();
				expect(firstLocation.get('traffic')).toBeUndefined();
			});

		});
	});