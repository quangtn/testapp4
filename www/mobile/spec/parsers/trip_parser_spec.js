require([
	'namespace', 'backbone', 'underscore',
	'text!fixtures/mock_trip_response.json',
	'parsers/trip_parser'
], function(
	app, Backbone, _,
	mockTripResponseString,
	TripParser
) {

		describe('Trip Parser', function() {
			var tripModel, mockTripResponse = JSON.parse(mockTripResponseString);

			beforeEach(function() {
				tripModel = new Backbone.Model();
				_.extend(tripModel, TripParser);
			});

			it('can create application objects for testing', function() {
				expect(mockTripResponseString).toBeDefined();
				expect(TripParser).toBeDefined();

				expect(mockTripResponse).toBeDefined();
				expect(tripModel).toBeDefined();
				expect(tripModel.parse).toBeDefined();
			});

			it('can parse top-level trip from service response', function() {
				var parsedObject = tripModel.parse(mockTripResponse);

				expect(parsedObject).toBeDefined();
				expect(parsedObject.active).toEqual(true);
				expect(parsedObject.create_source).toEqual('browser');
				expect(parsedObject.default_date_and_times).toBeDefined();
				expect(parsedObject.default_item_create_date).toEqual('2013-06-09');
				expect(parsedObject.destination).toEqual('Antigua, AG');
				expect(parsedObject.destination_country).toEqual('AG');
				expect(parsedObject.destination_images).toBeDefined();
				expect(parsedObject.end_time).toEqual('2013-06-15T23:30:00');
				expect(parsedObject.id).toEqual(19674);
				expect(parsedObject.for_business).toBeDefined();
				expect(parsedObject.item_types).toEqual('air,vehicle,lodging,food_drink,cruise');
				expect(parsedObject.most_relevant).toEqual(false);
				expect(parsedObject.most_relevant_item).toEqual(0);
				expect(parsedObject.name).toEqual('Ken\'s trip to  ANTIGUA');
				expect(parsedObject.start_time).toEqual('2013-06-09T10:50:00');
				expect(parsedObject.user_id).toEqual('1595');
			});

			it('can parse sources from trip service response', function() {
				var source;

				tripModel.parse(mockTripResponse);

				expect(tripModel.sources).toBeDefined();
				expect(tripModel.sources.at(0)).toBeDefined();
				expect(tripModel.sources.at(1)).not.toBeDefined();

				source = tripModel.sources.at(0);
				expect(source.get('cancellable')).toEqual(false);
				expect(source.get('id')).toEqual(11497);
				expect(source.get('identifier')).toEqual('HSWTFU');
				expect(source.get('name')).toEqual('Record Locator');
			});

			it('can parse destination images from trip service response', function() {
				var images;
				var parsedObject = tripModel.parse(mockTripResponse);

				images = parsedObject.destination_images;

				expect(images).toBeDefined();
				expect(images.large).toEqual('http://www.tripcase.com/pictures/loc/destinations/destination_default_4-3_sz98.jpg');
				expect(images.medium).toEqual('http://www.tripcase.com/pictures/loc/destinations/destination_default_4-3_sz65.jpg');
				expect(images.small).toEqual('http://www.tripcase.com/pictures/loc/destinations/destination_default_4-3_sz49.jpg');
				expect(images.web).toEqual('http://www.tripcase.com/pictures/loc/destinations/destination_default_4-3_sz125.jpg');
				expect(images.xlarge).toEqual('http://www.tripcase.com/pictures/loc/destinations/destination_default_4-3_sz130.jpg');
			});

			it('can parse default date & times from trip service response', function() {
				var dateTimes;
				var parsedObject = tripModel.parse(mockTripResponse);

				dateTimes = parsedObject.default_date_and_times;
				expect(dateTimes).toBeDefined();
				expect(dateTimes.flight_departure_date).toEqual('2013-06-15');
				expect(dateTimes.generic_item_end_date).toEqual('2013-06-15');
				expect(dateTimes.generic_item_end_time).toEqual('2013-02-15T15:00:00');
				expect(dateTimes.generic_item_start_date).toEqual('2013-06-15');
				expect(dateTimes.generic_item_start_time).toEqual('2013-02-15T12:00:00');
				expect(dateTimes.hotel_check_in_date).toEqual('2013-06-09');
				expect(dateTimes.hotel_check_in_time).toEqual('2013-06-09T14:50:00');
				expect(dateTimes.hotel_check_out_date).toEqual('2013-06-15');
				expect(dateTimes.hotel_check_out_time).toEqual('2013-06-15T12:10:00');
				expect(dateTimes.vehicle_drop_off_date).toEqual('2013-06-15');
				expect(dateTimes.vehicle_drop_off_time).toEqual('2013-06-15T13:10:00');
				expect(dateTimes.vehicle_pick_up_date).toEqual('2013-06-09');
				expect(dateTimes.vehicle_pick_up_time).toEqual('2013-06-09T14:50:00');
			});

			it('can parse events sequence from trip service response', function() {
				var daysEvents;

				tripModel.parse(mockTripResponse);

				expect(tripModel.eventsGroupedByDay).toBeDefined();
				expect(tripModel.eventsGroupedByDay.length).toEqual(4);

				daysEvents = tripModel.eventsGroupedByDay[0];
				expect(daysEvents).toBeDefined();
				expect(daysEvents.events).toBeDefined();
				expect(daysEvents.events.length).toEqual(3);
				expect(daysEvents.value).toEqual('2013-06-09');
			});

			it('can parse all trip-messages from legacy trip service response', function() {
				var messages;

				tripModel.parse(mockTripResponse);

				messages = tripModel.messages;
				expect(messages).toBeDefined();
				expect(messages.at(0)).toBeDefined();
				expect(messages.at(9)).not.toBeDefined();
				expect(messages.length).toEqual(9);
				expect(messages.isLegacy).toBeTruthy();
			});

			it('can parse the first trip message from legacy trip service response', function() {
				var message;

				tripModel.parse(mockTripResponse);

				expect(tripModel.messages).toBeDefined();
				expect(tripModel.messages.at(0)).toBeDefined();

				message = tripModel.messages.at(0);
				expect(message.get('drive_suggestion_id')).not.toBeDefined();
				expect(message.get('event_action')).toEqual('GotoUrl');
				expect(message.get('event_id')).not.toBeDefined();
				expect(message.get('event_name')).toEqual('display_svt_itin');
				expect(message.get('icon_url')).toEqual('http://dharma-connect.tripcase.com/assets/000/000/006/small.png');
				expect(message.get('id')).not.toBeDefined();
				expect(message.get('start_time')).toEqual('2013-02-07T21:05:29Z');
				expect(message.get('text')).toEqual('Additional information is available for your trip JCTAZX.');
				expect(message.get('tool_name')).not.toBeDefined();
				expect(message.get('trip_id')).toEqual('');
				expect(message.get('trip_item_id')).not.toBeDefined();
				expect(message.get('url')).toEqual('http://dharma-connect.tripcase.com/messages/184/clickthrough?url=https%3A%2F%2Fcert-services.tripcase.com%2Fnew%2FreservationsPrint.html%3Fpnr%3DAL8IHD8JTFQ2%26name%3DHogue%26action%3DprintPreview%26nr%3Dtrue&key=e7d8a36&metrics[client]=browser&metrics[pk]=trip:1743');
				expect(message.get('web_url')).toEqual('http://dharma-connect.tripcase.com/messages/184/clickthrough?url=https%3A%2F%2Fcert-services.tripcase.com%2Fnew%2FreservationsPrint.html%3Fpnr%3DAL8IHD8JTFQ2%26name%3DHogue%26action%3DprintPreview%26nr%3Dtrue&key=e7d8a36&metrics[client]=browser&metrics[pk]=trip:1743');
			});

			it('should parse trip with split messages response', function() {
				mockTripResponse.messages = undefined;

				tripModel.parse(mockTripResponse);

				expect(tripModel.messages).toBeDefined();
				expect(tripModel.messages.length).toBe(0);
			});

			it('can parse trip event relevance', function() {
				var tripEventRelevance;
				var parsedObject = tripModel.parse(mockTripResponse);

				tripEventRelevance = parsedObject.trip_event_relevance;

				expect(tripEventRelevance).toBeDefined();
			});

			it('can parse all trip-items from trip service response', function() {
				var tripItems;

				tripModel.parse(mockTripResponse);

				tripItems = tripModel.tripItems;
				expect(tripItems).toBeDefined();
				expect(tripItems.length).toEqual(6);
				expect(tripItems.at(0).getType()).toEqual('Air');
				expect(tripItems.at(1).getType()).toEqual('Vehicle');
				expect(tripItems.at(2).getType()).toEqual('Hotel');
				expect(tripItems.at(3).getType()).toEqual('Food_drink');
				expect(tripItems.at(4).getType()).toEqual('Cruise');
				expect(tripItems.at(5).getType()).toEqual('Air');
			});

			it("sets an attribute for start_time_utc", function() {
				var parsedObject = tripModel.parse({'start_time_utc': '2013-04-19T05:34:23'});
				expect(parsedObject.start_time_utc).toEqual('2013-04-19T05:34:23');
			});

			it("sets an attribute for end_time_utc", function() {
				var parsedObject = tripModel.parse({'end_time_utc': '2013-04-15T05:34:23'});
				expect(parsedObject.end_time_utc).toEqual('2013-04-15T05:34:23');
			});

			it('sets traveler name', function() {
				var parsedObject = tripModel.parse({'traveler_name': 'Kevin Durant'});
				expect(parsedObject.traveler_name).toEqual('Kevin Durant');
			});

			it('should set following trip', function() {
				var parsedObject = tripModel.parse({following: true});
				expect(parsedObject.isFollowing).toBeTruthy();
			});

			it('should set trip permissions', function() {
				var permissions = ['share'],
					parsedObject = tripModel.parse({permissions: permissions});

				expect(parsedObject.permissions).toBe(permissions);
			});
		});
	}
);
