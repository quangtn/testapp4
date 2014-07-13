require([
	'namespace', 'backbone', 'underscore', 'jquery', 'models/trip',
	'strings', 'trips_manager',
	'text!fixtures/mock_trip_response.json',
	'text!fixtures/mock_hotel_only_trip_response.json',
	'text!fixtures/mock_empty_trip_response.json'
], function(
	app, Backbone, _, $, Trip,
	t, TripsManager,
	mockFullTripResponseString,
	mockHotelOnlyTripResponseString,
	mockEmptyTripResponseString
) {

		describe('SideMenu Controller', function() {
			var tripModel, mockTripResponse, allLabels,
				hotelResponse = JSON.parse(mockHotelOnlyTripResponseString),
				fullResponse = JSON.parse(mockFullTripResponseString);

			beforeEach(function() {
				tripModel = new Trip();
				spyOn(tripModel, 'can');
			});

			it('should add flight-specific menu items when a trip has a flight', function() {
				mockTripResponse = fullResponse;

				tripModel.set(tripModel.parse(mockTripResponse));

				spyOn(TripsManager, 'getCurrentTrip').andCallFake(function() {
					return tripModel;
				});

				allLabels = getSideMenuItemLabels();

				expect(allLabels).toContain(t.AltFlights);
				expect(allLabels).toContain(t.SeatMaps);
			});

			it('should add typical menu items for a trip with at least one item', function() {
				mockTripResponse = hotelResponse;

				tripModel.set(tripModel.parse(mockTripResponse));

				spyOn(TripsManager, 'getCurrentTrip').andCallFake(function() {
					return tripModel;
				});

				allLabels = getSideMenuItemLabels();

				// expect(allLabels.length).toEqual(8);
				expect(allLabels).toContain(t.SwitchToTripFeed);
				expect(allLabels).toContain(t.AddItem);
				expect(allLabels).toContain(t.EditTrip);
				expect(allLabels).toContain(t.Share);
				expect(allLabels).toContain(t.Weather);
				expect(allLabels).toContain(t.Maps);
				expect(allLabels).toContain(t.PhoneNumbers);
			});

			it('should not add flight-specific menu items when trip lacks flight', function() {
				mockTripResponse = hotelResponse;

				tripModel.set(tripModel.parse(mockTripResponse));

				spyOn(TripsManager, 'getCurrentTrip').andCallFake(function() {
					return tripModel;
				});

				allLabels = getSideMenuItemLabels();

				expect(allLabels).not.toContain(t.AltFlights);
				expect(allLabels).not.toContain(t.SeatMaps);
			});

			it('should not add amex benefits when user does not have benefits', function() {
				mockTripResponse = hotelResponse;

				tripModel.set(tripModel.parse(mockTripResponse));

				spyOn(TripsManager, 'getCurrentTrip').andCallFake(function() {
					return tripModel;
				});
				spyOn(app.session, "getMemberships").andReturn(undefined);

				allLabels = getSideMenuItemLabels();

				expect(allLabels).not.toContain(t.Benefits);
			});

			it('should add amex benefits when user does have benefits', function() {
				mockTripResponse = hotelResponse;

				tripModel.set(tripModel.parse(mockTripResponse));

				spyOn(TripsManager, 'getCurrentTrip').andCallFake(function() {
					return tripModel;
				});
				spyOn(app.session, "getMemberships").andReturn([{"@name": "program_membership", "name": "AMEXBENEFITS"}]);

				allLabels = getSideMenuItemLabels();

				expect(allLabels).toContain(t.Benefits);
			});

			it('should add only the minimal menu items for an empty trip', function() {
				mockTripResponse = JSON.parse(mockEmptyTripResponseString);

				tripModel.set(tripModel.parse(mockTripResponse));

				spyOn(TripsManager, 'getCurrentTrip').andCallFake(function() {
					return tripModel;
				});

				allLabels = getSideMenuItemLabels();

				expect(allLabels.length).toEqual(2);
				expect(allLabels).toContain(t.AddItem);
				expect(allLabels).toContain(t.EditTrip);
			});

			it('should not have any menu items when no trip is selected', function() {

				spyOn(TripsManager, 'getCurrentTrip').andCallFake(function() {
					return undefined;
				});

				allLabels = getSideMenuItemLabels();

				expect(allLabels.length).toEqual(0);
			});

			describe('Following Trips', function() {
				beforeEach(function() {
					spyOn(tripModel, 'isFollowing').andReturn(true);
				});

				it('should not add "Add Item" when the trip is a following trip', function() {
					mockTripResponse = hotelResponse;

					tripModel.set(tripModel.parse(mockTripResponse));

					spyOn(TripsManager, 'getCurrentTrip').andCallFake(function() {
						return tripModel;
					});

					allLabels = getSideMenuItemLabels();

					expect(allLabels).not.toContain(t.AddItem);
				});

				it('should not add "Action View" when the trip is a following trip', function() {
					mockTripResponse = hotelResponse;

					tripModel.set(tripModel.parse(mockTripResponse));

					spyOn(TripsManager, 'getCurrentTrip').andCallFake(function() {
						return tripModel;
					});

					allLabels = getSideMenuItemLabels();

					expect(allLabels).not.toContain(t.SwitchToTripFeed);
				});

				it('should not add "Share" when the trip is a following trip', function() {
					mockTripResponse = hotelResponse;

					tripModel.set(tripModel.parse(mockTripResponse));

					spyOn(TripsManager, 'getCurrentTrip').andCallFake(function() {
						return tripModel;
					});

					allLabels = getSideMenuItemLabels();

					expect(allLabels).not.toContain(t.Share);
				});

				it('should not add "Edit Trip" when the trip is a following trip', function() {
					mockTripResponse = hotelResponse;

					tripModel.set(tripModel.parse(mockTripResponse));

					spyOn(TripsManager, 'getCurrentTrip').andCallFake(function() {
						return tripModel;
					});

					allLabels = getSideMenuItemLabels();

					expect(allLabels).not.toContain(t.EditTrip);
				});

				it('should not add "Alternate Flights" when the trip is a following trip', function() {
					mockTripResponse = fullResponse;

					tripModel.set(tripModel.parse(mockTripResponse));

					spyOn(TripsManager, 'getCurrentTrip').andCallFake(function() {
						return tripModel;
					});

					allLabels = getSideMenuItemLabels();

					expect(allLabels).not.toContain(t.AltFlights);
				});

				it('should not add "Amex Benefits" when the trip is a following trip', function() {
					mockTripResponse = hotelResponse;

					tripModel.set(tripModel.parse(mockTripResponse));

					spyOn(TripsManager, 'getCurrentTrip').andCallFake(function() {
						return tripModel;
					});
					spyOn(app.session, "getMemberships").andReturn([{"@name": "program_membership", "name": "AMEXBENEFITS"}]);

					allLabels = getSideMenuItemLabels();

					expect(allLabels).not.toContain(t.Benefits);
				});

				it('should not add "Tools" when the trip is a following trip', function() {
					mockTripResponse = fullResponse;

					tripModel.set(tripModel.parse(mockTripResponse));

					spyOn(TripsManager, 'getCurrentTrip').andCallFake(function() {
						return tripModel;
					});

					allLabels = getSideMenuItemLabels();

					expect(allLabels).not.toContain(t.Tools);
				});

				it('should not add "Weather" when the trip is a following trip', function() {
					mockTripResponse = fullResponse;

					tripModel.set(tripModel.parse(mockTripResponse));

					spyOn(TripsManager, 'getCurrentTrip').andCallFake(function() {
						return tripModel;
					});

					allLabels = getSideMenuItemLabels();

					expect(allLabels).not.toContain(t.Weather);
				});

				it('should not add "Maps" when the trip is a following trip', function() {
					mockTripResponse = fullResponse;

					tripModel.set(tripModel.parse(mockTripResponse));

					spyOn(TripsManager, 'getCurrentTrip').andCallFake(function() {
						return tripModel;
					});

					allLabels = getSideMenuItemLabels();

					expect(allLabels).not.toContain(t.Maps);
				});

				it('should not add "Phone Numbers" when the trip is a following trip', function() {
					mockTripResponse = fullResponse;

					tripModel.set(tripModel.parse(mockTripResponse));

					spyOn(TripsManager, 'getCurrentTrip').andCallFake(function() {
						return tripModel;
					});

					allLabels = getSideMenuItemLabels();

					expect(allLabels).not.toContain(t.PhoneNumbers);
				});

				it('should add unfollow for share followed trip', function() {
					mockTripResponse = fullResponse;
					tripModel.set(tripModel.parse(mockTripResponse));
					tripModel.can.andReturn(true);
					spyOn(TripsManager, 'getCurrentTrip').andCallFake(function() {
						return tripModel;
					});

					allLabels = getSideMenuItemLabels();

					expect(allLabels).toContain(t.UnfollowTrip);
				});
			});

			function getSideMenuItemLabels() {
				var IS_ONLINE = true;
				var menuItems = app.controllers.sidemenu.menuTripItemsSetup(IS_ONLINE);
				var allLabels = _.pluck(menuItems, 'label');

				return allLabels;
			}
		});
	});
