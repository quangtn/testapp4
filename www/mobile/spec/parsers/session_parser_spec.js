require(['namespace', 'backbone', 'underscore',
	'text!fixtures/mock_session_response.json',
	'parsers/session_parser'
],
	function(app, Backbone, _, MockSessionResponseString, SessionParser) {

		describe('Session Parser', function() {

			var mockSessionResponse, sessionModel;

			beforeEach(function() {
				mockSessionResponse = JSON.parse(MockSessionResponseString);

				sessionModel = new Backbone.Model();
				_.extend(sessionModel, SessionParser);

				sessionModel.set(sessionModel.parse(mockSessionResponse));
			});

			afterEach(function() {
				mockSessionResponse = null;
				sessionModel = null;
			});

			it('can create application objects for testing', function() {
				expect(MockSessionResponseString).toBeDefined();
				expect(SessionParser).toBeDefined();

				expect(mockSessionResponse).toBeDefined();
				expect(sessionModel).toBeDefined();
				expect(sessionModel.parse).toBeDefined();
			});

			it('can parse most relevant trip id', function() {
				expect(sessionModel.get('most_relevant_trip_id')).toEqual(26);
			});

			it('can parse other events meta', function() {
				expect(sessionModel.otherEventsMeta).toBeDefined();
			});

			it('can parse activity events meta', function() {
				var activity = sessionModel.otherEventsMeta.activity;

				expect(activity).toBeDefined();
				expect(activity.displayable).toEqual(true);
				expect(activity.end_date_label).toEqual('End');
				expect(activity.end_location_label).toEqual('false');
				expect(activity.icon_url).toEqual('http://localhost:3000/images/TC_tripIcons_event.png');
				expect(activity.is_transportation).toEqual(false);
				expect(activity.name).toEqual('Activity');
				expect(activity.name_label).toEqual('Name');
				expect(activity.named_type).toEqual('activity');
				expect(activity.start_date_label).toEqual('Start');
				expect(activity.start_location_label).toEqual('Location');
			});

			it('can parse attraction events meta', function() {
				var attraction = sessionModel.otherEventsMeta.attraction;

				expect(attraction).toBeDefined();
				expect(attraction.displayable).toEqual(true);
				expect(attraction.end_date_label).toEqual('End');
				expect(attraction.end_location_label).toEqual('false');
				expect(attraction.icon_url).toEqual('http://localhost:3000/images/TC_tripIcons_attraction.png');
				expect(attraction.is_transportation).toEqual(false);
				expect(attraction.name).toEqual('Attraction');
				expect(attraction.name_label).toEqual('Name');
				expect(attraction.named_type).toEqual('attraction');
				expect(attraction.start_date_label).toEqual('Start');
				expect(attraction.start_location_label).toEqual('Location');
			});

			it('can parse cruise events meta', function() {
				var cruise = sessionModel.otherEventsMeta.cruise;

				expect(cruise).toBeDefined();
				expect(cruise.displayable).toEqual(true);
				expect(cruise.end_date_label).toEqual('End');
				expect(cruise.end_location_label).toEqual('Ending Port');
				expect(cruise.icon_url).toEqual('http://localhost:3000/images/TC_tripIcons_cruise.png');
				expect(cruise.is_transportation).toEqual(true);
				expect(cruise.name).toEqual('Cruise');
				expect(cruise.name_label).toEqual('Name of Cruise Line');
				expect(cruise.named_type).toEqual('cruise');
				expect(cruise.start_date_label).toEqual('Start');
				expect(cruise.start_location_label).toEqual('Starting Port');
			});

			it('can parse ferry events meta', function() {
				var ferry = sessionModel.otherEventsMeta.ferry;

				expect(ferry).toBeDefined();
				expect(ferry.displayable).toEqual(true);
				expect(ferry.end_date_label).toEqual('End');
				expect(ferry.end_location_label).toEqual('Ending Port');
				expect(ferry.icon_url).toEqual('http://localhost:3000/images/TC_tripIcons_ferry.png');
				expect(ferry.is_transportation).toEqual(true);
				expect(ferry.name).toEqual('Ferry');
				expect(ferry.name_label).toEqual('Name of Ferry Line');
				expect(ferry.named_type).toEqual('ferry');
				expect(ferry.start_date_label).toEqual('Start');
				expect(ferry.start_location_label).toEqual('Starting Port');
			});

			it('can parse food and drink events meta', function() {
				var foodDrink = sessionModel.otherEventsMeta.food_drink;

				expect(foodDrink).toBeDefined();
				expect(foodDrink.displayable).toEqual(true);
				expect(foodDrink.end_date_label).toEqual('End');
				expect(foodDrink.end_location_label).toEqual('false');
				expect(foodDrink.icon_url).toEqual('http://localhost:3000/images/TC_tripIcons_food-drink.png');
				expect(foodDrink.is_transportation).toEqual(false);
				expect(foodDrink.name).toEqual('Food & Drink');
				expect(foodDrink.name_label).toEqual('Name');
				expect(foodDrink.named_type).toEqual('food_drink');
				expect(foodDrink.start_date_label).toEqual('Start');
				expect(foodDrink.start_location_label).toEqual('Location');
			});

			it('can parse ground transportation events meta', function() {
				var groundTransport = sessionModel.otherEventsMeta.ground_transportation;

				expect(groundTransport).toBeDefined();
				expect(groundTransport.displayable).toEqual(true);
				expect(groundTransport.end_date_label).toEqual('End');
				expect(groundTransport.end_location_label).toEqual('End Location');
				expect(groundTransport.icon_url).toEqual('http://localhost:3000/images/TC_tripIcons_groundTransport.png');
				expect(groundTransport.is_transportation).toEqual(true);
				expect(groundTransport.name).toEqual('Ground Transportation');
				expect(groundTransport.name_label).toEqual('Name/Type');
				expect(groundTransport.named_type).toEqual('ground_transportation');
				expect(groundTransport.start_date_label).toEqual('Start');
				expect(groundTransport.start_location_label).toEqual('Start Location');
			});

			it('can parse lodging events meta', function() {
				var lodging = sessionModel.otherEventsMeta.lodging;

				expect(lodging).toBeDefined();
				expect(lodging.displayable).toEqual(false);
				expect(lodging.end_date_label).toEqual('Check Out');
				expect(lodging.end_location_label).toEqual('false');
				expect(lodging.icon_url).toEqual('http://localhost:3000/images/bg_icon_trip_hotel.png');
				expect(lodging.is_transportation).toEqual(false);
				expect(lodging.name).toEqual('Lodging');
				expect(lodging.name_label).toEqual('Name');
				expect(lodging.named_type).toEqual('lodging');
				expect(lodging.start_date_label).toEqual('Check In');
				expect(lodging.start_location_label).toEqual('Location');
			});

			it('can parse meeting events meta', function() {
				var meeting = sessionModel.otherEventsMeta.meeting;

				expect(meeting).toBeDefined();
				expect(meeting.displayable).toEqual(true);
				expect(meeting.end_date_label).toEqual('End');
				expect(meeting.end_location_label).toEqual('false');
				expect(meeting.icon_url).toEqual('http://localhost:3000/images/TC_tripIcons_meeting.png');
				expect(meeting.is_transportation).toEqual(false);
				expect(meeting.name).toEqual('Meeting');
				expect(meeting.name_label).toEqual('Name');
				expect(meeting.named_type).toEqual('meeting');
				expect(meeting.start_date_label).toEqual('Start');
				expect(meeting.start_location_label).toEqual('Location');
			});

			it('can parse rail events meta', function() {
				var rail = sessionModel.otherEventsMeta.rail;

				expect(rail).toBeDefined();
				expect(rail.displayable).toEqual(true);
				expect(rail.end_date_label).toEqual('Arrival');
				expect(rail.end_location_label).toEqual('Arrival');
				expect(rail.icon_url).toEqual('http://localhost:3000/images/TC_tripIcons_rail.png');
				expect(rail.is_transportation).toEqual(true);
				expect(rail.name).toEqual('Rail');
				expect(rail.name_label).toEqual('Railway Name');
				expect(rail.named_type).toEqual('rail');
				expect(rail.start_date_label).toEqual('Departure');
				expect(rail.start_location_label).toEqual('Departure');
			});

			it('can parse trips', function() {
				expect(sessionModel.trips).toBeDefined();
				expect(sessionModel.trips.length).toEqual(18);
				expect(sessionModel.trips.at(0)).toBeDefined();
				expect(sessionModel.trips.at(17)).toBeDefined();
				expect(sessionModel.trips.at(18)).not.toBeDefined();
			});

			it('can parse the first trip', function() {
				var trip = sessionModel.trips.at(0);

				expect(trip.get('active')).toEqual(true);
				expect(trip.get('create_source')).toEqual('touch/Unknown');
				expect(trip.get('default_item_create_date')).toEqual(undefined);
				expect(trip.get('destination')).toEqual('West Palm Beach, FL');
				expect(trip.get('destination_country')).toEqual('US');
				expect(trip.get('destination_images').large).toEqual('https://www.tripcase.com/pictures/loc/destinations/Ft_Lauderdale_sq_sz98.jpg');
				expect(trip.get('destination_images').medium).toEqual('https://www.tripcase.com/pictures/loc/destinations/Ft_Lauderdale_sq_sz65.jpg');
				expect(trip.get('destination_images').small).toEqual('https://www.tripcase.com/pictures/loc/destinations/Ft_Lauderdale_sq_sz49.jpg');
				expect(trip.get('destination_images').web).toEqual('https://www.tripcase.com/pictures/loc/destinations/Ft_Lauderdale_4x3_sz125.jpg');
				expect(trip.get('destination_images').xlarge).toEqual('https://www.tripcase.com/pictures/loc/destinations/Ft_Lauderdale_sq_sz130.jpg');
				expect(trip.get('end_time')).toEqual('2013-02-22T12:00:00');
				expect(trip.get('id')).toEqual(26);
				expect(trip.get('item_types')).toEqual('air,lodging,vehicle');
				expect(trip.get('most_relevant')).toEqual(false);
				expect(trip.get('most_relevant_item')).toEqual(0);
				expect(trip.get('name')).toEqual('ActionStream Ideal Form');
				expect(trip.get('start_time')).toEqual('2013-02-19T13:40:00');
				expect(trip.get('user_id')).toEqual('2');
			});

			it('can parse the middle trip', function() {
				var trip = sessionModel.trips.at(8);

				expect(trip.get('active')).toEqual(false);
				expect(trip.get('create_source')).toEqual('touch/Unknown');
				expect(trip.get('default_item_create_date')).toEqual(undefined);
				expect(trip.get('destination')).toEqual('Honolulu, HI');
				expect(trip.get('destination_country')).toEqual('US');
				expect(trip.get('destination_images').large).toEqual('https://www.tripcase.com/pictures/loc/destinations/Honolulu_sq_sz98.jpg');
				expect(trip.get('destination_images').medium).toEqual('https://www.tripcase.com/pictures/loc/destinations/Honolulu_sq_sz65.jpg');
				expect(trip.get('destination_images').small).toEqual('https://www.tripcase.com/pictures/loc/destinations/Honolulu_sq_sz49.jpg');
				expect(trip.get('destination_images').web).toEqual('https://www.tripcase.com/pictures/loc/destinations/Honolulu_4x3_sz125.jpg');
				expect(trip.get('destination_images').xlarge).toEqual('https://www.tripcase.com/pictures/loc/destinations/Honolulu_sq_sz130.jpg');
				expect(trip.get('end_time')).toEqual('2012-12-26T15:25:00');
				expect(trip.get('id')).toEqual(14);
				expect(trip.get('item_types')).toEqual('air');
				expect(trip.get('most_relevant')).toEqual(false);
				expect(trip.get('most_relevant_item')).toEqual(0);
				expect(trip.get('name')).toEqual('new trip for add flight');
				expect(trip.get('start_time')).toEqual('2012-12-12T10:50:00');
				expect(trip.get('user_id')).toEqual('2');
			});

			it('can parse the last trip', function() {
				var trip = sessionModel.trips.at(17);

				expect(trip.get('active')).toEqual(false);
				expect(trip.get('create_source')).toEqual('mobile');
				expect(trip.get('default_item_create_date')).toEqual(undefined);
				expect(trip.get('destination')).toEqual('Montego Bay, JM');
				expect(trip.get('destination_country')).toEqual('JM');
				expect(trip.get('destination_images').large).toEqual('http://www.tripcase.com/pictures/loc/destinations/destination_default_4-3_sz98.jpg');
				expect(trip.get('destination_images').medium).toEqual('http://www.tripcase.com/pictures/loc/destinations/destination_default_4-3_sz65.jpg');
				expect(trip.get('destination_images').small).toEqual('http://www.tripcase.com/pictures/loc/destinations/destination_default_4-3_sz49.jpg');
				expect(trip.get('destination_images').web).toEqual('http://www.tripcase.com/pictures/loc/destinations/destination_default_4-3_sz125.jpg');
				expect(trip.get('destination_images').xlarge).toEqual('http://www.tripcase.com/pictures/loc/destinations/destination_default_4-3_sz130.jpg');
				expect(trip.get('end_time')).toEqual('2012-09-29T14:45:00');
				expect(trip.get('id')).toEqual(9);
				expect(trip.get('item_types')).toEqual('vehicle,air');
				expect(trip.get('most_relevant')).toEqual(false);
				expect(trip.get('most_relevant_item')).toEqual(0);
				expect(trip.get('name')).toEqual('EFYXBQ');
				expect(trip.get('start_time')).toEqual('2012-09-23T10:55:00');
				expect(trip.get('user_id')).toEqual('2');
			});

			it('can parse expense categories', function() {
				expect(sessionModel.expenseCategories).toBeDefined();
				expect(sessionModel.expenseCategories.length).toEqual(10);
				expect(sessionModel.expenseCategories[0]).toEqual('Air Travel');
				expect(sessionModel.expenseCategories[1]).toEqual('Entertainment');
				expect(sessionModel.expenseCategories[2]).toEqual('Ground Transportation');
				expect(sessionModel.expenseCategories[3]).toEqual('Lodging');
				expect(sessionModel.expenseCategories[4]).toEqual('Meal');
				expect(sessionModel.expenseCategories[5]).toEqual('Parking');
				expect(sessionModel.expenseCategories[6]).toEqual('Rental Car');
				expect(sessionModel.expenseCategories[7]).toEqual('Tips');
				expect(sessionModel.expenseCategories[8]).toEqual('Train');
				expect(sessionModel.expenseCategories[9]).toEqual('Other');
			});

			it('can parse expense payment types', function() {
				expect(sessionModel.expensePaymentTypes).toBeDefined();
				expect(sessionModel.expensePaymentTypes.length).toEqual(3);
				expect(sessionModel.expensePaymentTypes[0]).toEqual('Cash');
				expect(sessionModel.expensePaymentTypes[1]).toEqual('Credit Card');
				expect(sessionModel.expensePaymentTypes[2]).toEqual('Traveler\'s Check');
			});

			it('can parse user', function() {
				expect(sessionModel.user).toBeDefined();
				expect(sessionModel.user.get('name')).toEqual('Ken Tabor');
				expect(sessionModel.user.get('pro')).toEqual(false);
				expect(sessionModel.user.get('email')).toEqual('kenneth.tabor@sabre.com');
				expect(sessionModel.user.get('id')).toEqual(2);
			});


		});
	});