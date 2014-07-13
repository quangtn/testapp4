require(['jquery', 'namespace', 'backbone', 'underscore',
	'text!fixtures/mock_trip_locations_response.json',
	'collections/location_list'
],
	function($, app, Backbone, _, MockLocationsResponseString, LocationList) {

		describe('Location List Collection', function() {

			var mockLocationsResponse, locationList, mockTrip;

			beforeEach(function() {
				mockLocationsResponse = JSON.parse(MockLocationsResponseString);

				spyOn($, 'ajax').andCallFake(function (options) {
					expect(options.dataType).toEqual('json');
					expect(options.type).toEqual('GET');
					expect(options.url).toMatch(/\/mapi\/trips\/2\/trip_locations.json/);
					expect(options.success).toBeDefined();

					options.success(mockLocationsResponse);
				});

				mockTrip = new Backbone.Model({id: 2});
				locationList = new LocationList(null, {trip: mockTrip});
				locationList.fetch();
			});

			afterEach(function() {
				mockLocationsResponse = null;
				mockTrip = null;
				locationList = null;
			});

			it('can create application objects for testing', function() {
				expect(MockLocationsResponseString).toBeDefined();
				expect(mockLocationsResponse).toBeDefined();
				expect(locationList).toBeDefined();
				expect(locationList.getTripId()).toEqual(2);
			});

			it('can fetch and store all locations from mock service response', function() {
				expect(locationList.length).toEqual(8);
				expect(locationList.at(0)).toBeDefined();
				expect(locationList.at(7)).toBeDefined();
				expect(locationList.at(8)).not.toBeDefined();
			});

			it('can store first location from mock service call', function() {
				var location = locationList.at(0);

				expect(location.get('address_lines')).toBeDefined();
				expect(location.get('address_lines').length).toEqual(0);
				expect(location.get('airport_code')).toEqual('DAL');
				expect(location.get('city')).toEqual(undefined);
				expect(location.get('country')).toEqual(undefined);
				expect(location.get('county')).toEqual(undefined);
				expect(location.get('general_location')).toEqual('Dallas, TX');
				expect(location.get('label')).toEqual(undefined);
				expect(location.get('lat')).toEqual(32.8469444444444);
				expect(location.get('lng')).toEqual(-96.8533333333333);
				expect(location.get('location_code')).toEqual(undefined);
				expect(location.get('name')).toEqual('Love Field');
				expect(location.get('one_line_description')).toEqual(undefined);
				expect(location.get('postal_code')).toEqual(undefined);
				expect(location.get('property_id')).toEqual(undefined);
				expect(location.get('start_time_hint')).toEqual(undefined);
				expect(location.get('state')).toEqual(undefined);
				expect(location.get('street')).toEqual(undefined);
				expect(location.get('traffic')).toEqual(undefined);
				expect(location.get('trip_location_reference')).toEqual(undefined);
				expect(location.get('type')).toEqual('Air');
				expect(location.get('vendor_code')).toEqual(undefined);
			});

		});
	});