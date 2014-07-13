define([
	'backbone', 'models/trip', 'collections/trip_item_list', 'moment'
], function(
	Backbone, Trip, TripItemList, moment
) {
		describe('Trip model', function() {
			var trip, pending = function () {
				expect('pending').toEqual('completed');
			};

			beforeEach(function() {
				trip = new Trip();
			});

			it('should exist', function() {
				expect(Trip).toBeTruthy();
			});

			describe('creation', function() {
				it('should instantiate', function() {
					expect(trip instanceof Trip).toBeTruthy();
					expect(trip instanceof Backbone.Model).toBeTruthy();
				});
			});

			describe('best view type', function() {

				beforeEach(function() {
					// Mon, 25 Feb 2013 00:51:54 GMT
					this.clock = sinon.useFakeTimers(1361753514000);
				});

				afterEach(function() {
					this.clock.restore();
				});

				it('is none when trip is not active', function() {
					var trip = new Trip({
						'start_time': '1999-02-20T09:00:00',
						'active': false
					});
					expect(trip.bestViewTypeBasedOnStartTime()).toEqual('none');
				});

				it('is none when trip starts in more than 3 months', function() {
					var trip = new Trip({
						'start_time': '2014-12-28T09:00:00',
						'active': true
					});
					expect(trip.bestViewTypeBasedOnStartTime()).toEqual('none');
				});

				it('is action view when trip starts in less than 3 months', function() {
					var trip = new Trip({
						'start_time': '2013-02-28T09:00:00',
						'active': true
					});
					expect(trip.bestViewTypeBasedOnStartTime()).toEqual('feed');
				});

				it('is action view, even if super old, as long as active', function() {
					var trip = new Trip({
						'start_time': '1999-02-28T09:00:00',
						'end_time': '2000-08-13T05:00:00',
						'active': true
					});
					expect(trip.bestViewTypeBasedOnStartTime()).toEqual('feed');
				});
			});

			it('should have invalidateCache', function() {
				expect( trip.invalidateCache ).toBeTruthy();
			});

			it('should defer to the proxy to invalidateCache', function() {
				spyOn(trip.proxy, 'invalidateCache');

				trip.invalidateCache();

				expect(trip.proxy.invalidateCache).toHaveBeenCalled();
			});

			it("should have getMostRelevantEvents", function() {
				expect( trip.getMostRelevantEvents ).toBeTruthy();
			});

			it("should have getMostRelevantEventIndex", function() {
				expect( trip.getMostRelevantEventIndex ).toBeTruthy();
			});

			describe("most relevant event hash", function() {
				// TODO:
				// Scrap the mock data below, and move all tests within this describe block into a more
				// relevent spec that can access actual payload data, such as the trip parser spec.
				//
				// Also activate commented out tests and sections within describe block that have
				// the potential to pass with dynamic data in an alternate spec with payload data
				var hash = [
					{ 'event_index': 0, 'relevant_at_epoch': 1366308900, '@name': 'event' },
					{ 'event_index': 1, 'relevant_at_epoch': 1366322700, '@name': 'event' },
					{ 'event_index': 2, 'relevant_at_epoch': 1366318800, '@name': 'event' },
					{ 'event_index': 3, 'relevant_at_epoch': 1366347600, '@name': 'event' },
					{ 'event_index': 4, 'relevant_at_epoch': 1366318800, '@name': 'event' },
					{ 'event_index': 5, 'relevant_at_epoch': 1366716180, '@name': 'event' },
					{ 'event_index': 6, 'relevant_at_epoch': 1366322700, '@name': 'event' },
					{ 'event_index': 7, 'relevant_at_epoch': 1366790400, '@name': 'event' },
					{ 'event_index': 8, 'relevant_at_epoch': 1366844100, '@name': 'event' },
					{ 'event_index': 9, 'relevant_at_epoch': 1366845000, '@name': 'event' },
					{ 'event_index': 10, 'relevant_at_epoch': 1366845000, '@name': 'event' },
					{ 'event_index': 11, 'relevant_at_epoch': 1367010000, '@name': 'event' }
				];

				// it("should exist and be called 'trip_event_relevance'", function() {
				// expect(trip.attributes.trip_event_relevance).toBeDefined();
				// });

				it("should be an array of JSON objects with 3 values", function() {
					expect( Array.isArray(hash) ).toBe(true);
					for (var item in hash) {
						expect( typeof hash[item] === 'object' ).toBe(true);
					}
					expect( Object.keys(hash.shift()).length ).toBe(3);
				});
				it("should not be empty unless trip is empty", function() {
					if (trip.tripItems.length !== 0) {
						expect( hash ).toBeDefined();
						expect( hash.length > 0 ).toBe(true);
					} //else {
						// expect( hash ).toBeUndefined();
					// }
				});
				it("should contain a value with a key of 'relevant_at_epoch'", function() {
					var item = hash.shift();
					var values = Object.keys(item);

					expect( values.indexOf('relevant_at_epoch') ).toBeDefined();
				});

				it("value of 'relevant_at_epoch' should be a UTC Unix Epoch Time Stamp", function() {
					var item = hash.shift();
					var timestamp = item.relevant_at_epoch;
					expect( isNaN(timestamp) ).toBeFalsy();
				});

				it("should contain a value with a key of 'event_index'", function() {
					var item = hash.shift();
					var values = Object.keys(item);

					expect( values.indexOf('event_index') ).toBeDefined();
				});

				it("should have an 'event_index' value that is an integer", function() {
					for (var item in hash) {
						expect( isNaN(hash[item].event_index) ).toBeFalsy();
					}
				});

				it("should contain only 'event_index' values that are unique to one another", function() {
					hash.sort(function() { return 0.5 - Math.random();});
					var indexValue = hash[0].event_index,
						matches = 0;
					for (var item in hash) {
						if (indexValue === hash[item].event_index) {
							matches++;
						}
					}
					expect( matches ).toBe(1);
				});
			});

			describe("most relevant item", function() {
				// Spec helper function to convert human readible dates/times into
				// a UTC Unix Epoch timestamp in seconds
				var epoch = function(testTime) {
					return Math.round(moment.utc(testTime).valueOf() / 1000);
				};

				// Spec helper class/object that builds and/or generates mock 'trip_event_relevance'
				// event timeline hashes out of human readible times and/or relative times for use
				// as mock data in the following tests
					//	Builds arrays/objects similar to the following example-
					//	[
					//		{ "relevant_at_epoch": 1362502200, "event_index": 0, "@name": "event" },
					//		{ "relevant_at_epoch": 1362531600, "event_index": 1, "@name": "event" },
					//		{ "relevant_at_epoch": 1362531601, "event_index": 2, "@name": "event" }
					//	]
				var EventHash = function(testData) {
					var sampleHash = [];
					var HashItem = function(rel, i) {
						rel = (isNaN(rel)) ? epoch(rel) : rel;
						return {
							"relevant_at_epoch": rel,
							"event_index": i,
							"@name": "event"
						};
					};
					var fillHash = function(test) {
						for (var data in test) {
							sampleHash.push(new HashItem(test[data].timeStamp, test[data].eventIndex));
						}
					};
					var generateHash = function() {
						var time = {
							past: Math.round(moment.utc().subtract("days", 100).valueOf() / 1000),
							recent: Math.round(moment.utc().subtract("hours", 3).valueOf() / 1000),
							future: Math.round(moment.utc().add("days", 100).valueOf() / 1000)
						};

						sampleHash.push(new HashItem(time.past, 0));
						sampleHash.push(new HashItem(time.recent, 1));
						sampleHash.push(new HashItem(time.future, 2));

					};
					if (testData === "relative") {
						generateHash();
					} else {
						fillHash(testData);
					}
					return sampleHash;
				};

				// Checks Trip Event Relevance Hash arrays to see if they're indexed in order by time - ascending
				var isSortedByTime = function(hash) {
					var outOfOrder = false,
						lastItem = 0;
					for (var item in hash) {
						var itemTime = hash[item].relevant_at_epoch;
						if (itemTime < lastItem) {
							outOfOrder = true;
						}
						lastItem = itemTime;
					}
					return (outOfOrder) ? false : true;
				};

				it("should come from a hash sorted by time returned via getMostRelevantEvents", function() {
					spyOn(trip, 'get').andReturn(
						new EventHash([
							{ timeStamp: "March 10, 2013 5:00 PM", eventIndex: 0 },
							{ timeStamp: "March 12, 2013 7:00 PM", eventIndex: 1 },
							// Out of order index below
							{ timeStamp: "March 17, 2013 9:00 PM", eventIndex: 2 },
							{ timeStamp: "March 15, 2013 3:00 PM", eventIndex: 3 },
							{ timeStamp: "March 16, 2013 4:00 PM", eventIndex: 4 }
						])
					);
					var hash = trip.getMostRelevantEvents();
					expect( isSortedByTime( hash ) ).toBe(true);
				});

				it("should return a value", function() {
					spyOn(trip, 'get').andReturn(
						new EventHash([
							{ timeStamp: 1362502200, eventIndex: 0 },
							{ timeStamp: 1362531600, eventIndex: 1 },
							{ timeStamp: 1362531601, eventIndex: 2 }
						])
					);
					expect( trip.getMostRelevantEventIndex() ).toBeDefined();
				});

				it("should return 0 when there are no trip items and hash is undefined", function() {
					trip.set(
						{'trip_event_relevance': undefined}
					);
					expect( trip.getMostRelevantEventIndex() ).toBe(0);
				});

				it("should return correct value when given a time", function() {

					spyOn(trip, 'get').andReturn(
						new EventHash([
							{ timeStamp: "March 7, 2013 3:00 PM", eventIndex: 0 },
							{ timeStamp: "March 9, 2013 5:30 PM", eventIndex: 1 },
							{ timeStamp: "March 11, 2013 7:00 AM", eventIndex: 2 }
						])
					);

					var relevantIndex = trip.getMostRelevantEventIndex( epoch("March 7, 2013 3:03 PM") );

					expect( relevantIndex ).toEqual( 0 );
				});

				it("should return correct value without being given a time", function() {
					spyOn(trip, 'get').andReturn( new EventHash("relative") );
					// Dynamically created hash relative to current time
						// hash #0 = 100 days ago
						// hash #1 = 3 hours ago
						// hash #2 = 100 days from now

					var relevantIndex = trip.getMostRelevantEventIndex();

					expect( relevantIndex ).toEqual(1); // expect #1 (3 hours ago) to be most relevant
				});

				it("should return the first item if the next item is the first event", function() {

					spyOn(trip, 'get').andReturn(
						new EventHash([
							{ timeStamp: "May 15, 2013 8:00 PM", eventIndex: 0 },
							{ timeStamp: "June 3, 2013 6:20 PM", eventIndex: 1 }
						])
					);

					var relevantIndex = trip.getMostRelevantEventIndex( epoch("March 17, 2013 1:00 AM") );
					expect( relevantIndex ).toBeDefined();
					expect( relevantIndex ).not.toBeLessThan(0);
				});
			});

			describe("trip ended and in progress", function() {

				var trip, now;

				beforeEach(function() {
					trip = new Trip();
					// Mon, 25 Feb 2013 00:51:54 GMT
					this.clock = sinon.useFakeTimers(1361753514000);
				});

				afterEach(function() {
					trip = null;
					this.clock.restore();
				});

				it("has ended if its end date is before now", function() {
					trip.set('end_time_utc', moment().utc().subtract("seconds", 1).format("YYYY-MM-DDTHH:mm:ss"), {silent: true});
					expect(trip.hasEnded()).toBe(true);
				});

				it("hasn't ended if its end date is after now", function() {
					trip.set('end_time_utc', moment().utc().add("seconds", 1).format("YYYY-MM-DDTHH:mm:ss"), {silent: true});
					expect(trip.hasEnded()).toBe(false);
				});

				it("is in progress if it started a day ago", function() {
					trip.set('start_time_utc', moment().utc().subtract("days", 1).format("YYYY-MM-DDTHH:mm:ss"), {silent: true});
					trip.set('end_time_utc', moment().utc().add("days", 1).format("YYYY-MM-DDTHH:mm:ss"), {silent: true});
					expect(trip.isInProgress()).toBe(true);
				});

				it("is in progress if it starts now", function() {
					trip.set('start_time_utc', moment().utc().format("YYYY-MM-DDTHH:mm:ss"), {silent: true});
					trip.set('end_time_utc', moment().utc().add("days", 1).format("YYYY-MM-DDTHH:mm:ss"), {silent: true});
					expect(trip.isInProgress()).toBe(true);
				});

				it("is not in progress if it hasn't started", function() {
					trip.set('start_time_utc', moment().utc().add("minutes", 1).format("YYYY-MM-DDTHH:mm:ss"), {silent: true});
					trip.set('end_time_utc', moment().utc().add("days", 1).format("YYYY-MM-DDTHH:mm:ss"), {silent: true});
					expect(trip.isInProgress()).toBe(false);
				});

				it("is not in progress if it has ended", function() {
					trip.set('start_time_utc', moment().utc().subtract("days", 2).format("YYYY-MM-DDTHH:mm:ss"), {silent: true});
					trip.set('end_time_utc', moment().utc().subtract("minutes", 1).format("YYYY-MM-DDTHH:mm:ss"), {silent: true});
					expect(trip.isInProgress()).toBe(false);
				});

				it("starts soon if it starts in 2 hours", function() {
					trip.set('start_time_utc', moment().utc().add("hours", 2).format("YYYY-MM-DDTHH:mm:ss"), {silent: true});
					trip.set('end_time_utc', moment().utc().add("days", 1).format("YYYY-MM-DDTHH:mm:ss"), {silent: true});
					expect(trip.startsSoon()).toBe(true);
				});

				it("starts soon if it starts in 4 hours", function() {
					trip.set('start_time_utc', moment().utc().add("hours", 4).format("YYYY-MM-DDTHH:mm:ss"), {silent: true});
					trip.set('end_time_utc', moment().utc().add("days", 1).format("YYYY-MM-DDTHH:mm:ss"), {silent: true});
					expect(trip.startsSoon()).toBe(true);
				});

				it("does not start soon if it starts in 4 hours + 1 minute", function() {
					trip.set('start_time_utc', moment().utc().add("minutes", 241).format("YYYY-MM-DDTHH:mm:ss"), {silent: true});
					trip.set('end_time_utc', moment().utc().add("days", 1).format("YYYY-MM-DDTHH:mm:ss"), {silent: true});
					expect(trip.startsSoon()).toBe(false);
				});

				it("does not start soon if it is in progress", function() {
					trip.set('start_time_utc', moment().utc().subtract("minutes", 1).format("YYYY-MM-DDTHH:mm:ss"), {silent: true});
					trip.set('end_time_utc', moment().utc().add("days", 1).format("YYYY-MM-DDTHH:mm:ss"), {silent: true});
					expect(trip.startsSoon()).toBe(false);
				});
			});

			describe('Indicator Methods', function() {

				describe('isAmexDTR', function() {

					it('is defined', function() {
						expect(trip.isAmexDTR).toBeDefined();
					});

					it('is a public method of Trip', function() {
						expect(typeof trip.isAmexDTR).toBe('function');
					});

					it('retrieves the MAPI param "is_dtr" from Trip JSON', function() {
						spyOn(trip, 'get').andCallThrough();

						trip.isAmexDTR();

						expect(trip.get).toHaveBeenCalledWith('is_dtr');
					});

					it('returns the value of the MAPI param "is_dtr" from Trip JSON', function() {
						expect(trip.isAmexDTR()).toEqual(trip.get('is_dtr'));
					});

					describe('when trip is from Amex (DTR) partner import', function() {

						it('should return True', function() {
							trip.set({ is_dtr: true }, { silent: true });

							expect(trip.isAmexDTR()).toBe(true);
						});

					});

					describe('when trip is not from Amex (DTR) partner import', function() {

						it('should return False', function() {
							trip.set({ is_dtr: false }, { silent: true });

							expect(trip.isAmexDTR()).toBe(false);
						});

					});

				});


				describe('isWorldMate', function() {

					it('knows if the trip is from Worldmate', function() {
						var trip = new Trip({'create_source': 'worldmate'});
						expect(trip.isWorldMate()).toBe(true);
					});

				});
			});

			describe('permissions', function() {
				var permissions = ['add_item'];

				beforeEach(function() {
					trip.set({
						permissions: permissions,
						name: 'whatever'
					});
				});

				it('should handle policies', function() {
					expect(trip.can('add_item')).toBeTruthy();
				});

				it('should handle no policies', function() {
					expect(trip.can('unfollow')).toBeFalsy();
				});
			});
		});
	});
