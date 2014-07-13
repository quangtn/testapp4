define(['jquery', 'underscore', 'models/trips/premerge_trips_model',
	'text!fixtures/mock_premerge_trips_response.json'],
	function($, _, PreMergeTripsModel, MockPreMergeResponseString) {

		describe('PreMerge Trips Model', function() {

			var SELECTED_TRIP_IDS = [26, 24];
			var preCombineTrips;


			beforeEach(function() {
				preCombineTrips = new PreMergeTripsModel();
			});


			afterEach(function() {
				preCombineTrips = null;
			});


			it('should initialize', function() {
				expect(preCombineTrips).toBeDefined();
			});


			it('should call service with proper GET URL', function() {
				spyOn($, 'ajax').andCallFake(function(options) {
					expect(options.dataType).toEqual('json');
					expect(options.type).toEqual('GET');
					expect(options.url).toMatch(/\/mapi\/merge_trips\/pre_merge\.json\?trip_ids=26,24/);

					options.success([]);
				});

				preCombineTrips.setTripIDs(SELECTED_TRIP_IDS);
				preCombineTrips.fetch({
					success: $.noop()
				});
			});


			it('can parse typical service response after .fetch', function() {
				var mockPreMergeResponse = JSON.parse(MockPreMergeResponseString);

				spyOn($, 'ajax').andCallFake(function(options) {
					options.success(mockPreMergeResponse);
				});

				preCombineTrips.setTripIDs(SELECTED_TRIP_IDS);
				preCombineTrips.fetch({
					success: function(preMergeData, response) {
						expect(response.suggested_name).toEqual('GoTo Hiwayee');
						expect(response.items).toBeDefined();
						expect(_.isArray(response.items)).toEqual(true);
						expect(response.items.length).toEqual(5);
					}
				});
			});

		});
	});
