require(['namespace', 'backbone', 'underscore',
	'text!fixtures/mock_find_service_response.json',
	'parsers/location_parser'
],
	function(app, Backbone, _, MockFindResponseString, LocationParser) {

		describe('Location Parser', function() {

			var mockFindResponse, locationModel;

			beforeEach(function() {
				mockFindResponse = JSON.parse(MockFindResponseString);

				locationModel = new Backbone.Model();
				_.extend(locationModel, LocationParser);

				locationModel.set(locationModel.parse(mockFindResponse));
			});

			afterEach(function() {
				mockFindResponse = null;
				locationModel = null;
			});

			it('can create application objects for testing', function() {
				expect(MockFindResponseString).toBeDefined();
				expect(LocationParser).toBeDefined();

				expect(mockFindResponse).toBeDefined();
				expect(locationModel).toBeDefined();
				expect(locationModel.parse).toBeDefined();
			});

			it('can parse a service response', function() {
				expect(locationModel.get('airport_code')).not.toBeDefined();
				expect(locationModel.get('city')).toEqual('Irving');
				expect(locationModel.get('country')).toEqual('US');
				expect(locationModel.get('county')).toEqual('Dallas County');
				expect(locationModel.get('label')).not.toBeDefined();
				expect(locationModel.get('lat')).toEqual(32.961238);
				expect(locationModel.get('lng')).toEqual(-97.00321);
				expect(locationModel.get('location_code')).not.toBeDefined();
				expect(locationModel.get('name')).not.toBeDefined();
				expect(locationModel.get('one_line_description')).not.toBeDefined();
				expect(locationModel.get('postal_code')).toEqual('75019-3252');
				expect(locationModel.get('property_id')).not.toBeDefined();
				expect(locationModel.get('start_time_hint')).not.toBeDefined();
				expect(locationModel.get('state')).toEqual('TX');
				expect(locationModel.get('street')).toEqual('213 Osage St');
				expect(locationModel.get('traffic')).not.toBeDefined();
				expect(locationModel.get('trip_location_reference')).not.toBeDefined();
				expect(locationModel.get('type')).not.toBeDefined();
				expect(locationModel.get('vendor_code')).not.toBeDefined();
			});

		});
	});