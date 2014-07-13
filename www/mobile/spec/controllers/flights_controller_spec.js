define([
	'mediator', 'namespace', 'backbone', 'controllers/flights_controller',
	'models/trip', 'models/air_trip_item', 'collections/trips', 'workflows/add_flight_workflow',
	'workflows/edit_flight_workflow', 'trips_manager', 'models/flight_group', 'text!fixtures/mock_flight_group_response.json'
],
function(
	mediator, app, Backbone, Controller,
	TripModel, AirTripItemModel, Trips, AddFlightWorkflow,
	EditFlightWorkflow, TripsManager, FlightGroup, FlightGroupResponse) {

	describe('flight controller', function() {
		var controller,
			response = JSON.parse(FlightGroupResponse);

		beforeEach(function() {
			controller = new Controller();
		});

		it('should exist', function() {
			expect(controller).toBeTruthy();
		});

		describe('when initializing', function() {

			var controlla;

			beforeEach(function() {
				spyOn(mediator, 'subscribe').andReturn(true);
				controlla = new Controller();
			});

			it('should subscribe to some events', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('flights:add', jasmine.any(Function));
			});

			it('should subscribe to some events', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('flights:edit', jasmine.any(Function));
			});

			it('should subscribe to some events', function() {
				expect(mediator.subscribe).toHaveBeenCalledWith('flights:show', jasmine.any(Function));
			});
		});

		describe('the event callbacks', function() {

			it('should call show when flights:show fires', function() {
				mediator.unsubscribe('flights:show');
				spyOn(controller, 'show');
				controller._initSubscriptions();
				mediator.publish('flights:show', {
					flight: {test:'test'}
				});
				expect(controller.show).toHaveBeenCalledWith({flight:{test:'test'}});
			});
		});

		describe('when showing', function() {
			it('should fetch trip items', function() {
				controller = new Controller();
				var trip = new TripModel({id:1736});
				var model = new AirTripItemModel({id:18189});
				var trips = new Trips(trip);
				spyOn(TripsManager, 'getTripItems').andReturn(trips);
				model.trip = trip;
				controller.show({trip:{id:1736}});
				expect(TripsManager.getTripItems).toHaveBeenCalled();
			});
		});

		describe('set header', function() {
			var flightGroup, isFollowing, headerConfig;

			beforeEach(function() {
				spyOn(mediator, 'publish');
				spyOn(TripsManager, 'getCurrentTrip').andCallFake(function() {
					var fakeTrip = {
						isFollowing: function() {return isFollowing;}
					};

					return fakeTrip;
				});

				flightGroup = new FlightGroup();
				flightGroup.set(flightGroup.parse(response));
				headerConfig = {
					backAction: 'back:history',
					title: 'MIA <span class="general-icon icon_flight_detail_hdr_arrow"></span> ANU',
					subtitle: 'Miami to Antigua',
					rightButtons: [{
						name: 'flight-refresh',
						iconURL: 'button-icon btn_icon_refresh_25px',
						action: 'flightdetail:refresh'
					}]
				};
			});

			it('should add edit button for personal trip', function() {
				isFollowing = false;
				headerConfig.rightButtons.unshift({
					name: 'flight-edit',
					iconURL: 'button-icon btn_icon_edit_25px',
					action: 'flights:edit',
					param:{
						tripId: undefined,
						itemId: undefined
					}
				});

				controller._setHeader(flightGroup);
				expect(mediator.publish).toHaveBeenCalledWith('header:updateHeader', headerConfig);
			});

			it('should set header for following trip', function() {
				isFollowing = true;

				controller._setHeader(flightGroup);

				expect(mediator.publish).toHaveBeenCalledWith('header:updateHeader', headerConfig);
			});
		});

		describe('events for add workflow complete', function() {

			it('clears the complete event', function() {
				spyOn(AddFlightWorkflow, 'handle').andCallFake(function() {});
				spyOn(AddFlightWorkflow, 'off');
				controller = new Controller();
				controller.add({tripId: 3});
				expect(AddFlightWorkflow.off.mostRecentCall.args[0]).toEqual('complete');
			});

			it('adds the complete event', function() {
				spyOn(AddFlightWorkflow, 'handle').andCallFake(function() {});
				spyOn(AddFlightWorkflow, 'on');
				controller = new Controller();
				controller.add({tripId: 3});
				expect(AddFlightWorkflow.on.mostRecentCall.args[0]).toEqual('complete');
			});
		});

		describe('events for edit workflow complete', function() {

			it('clears the complete event', function() {
				spyOn(EditFlightWorkflow, 'handle').andCallFake(function() {});
				spyOn(EditFlightWorkflow, 'off');
				controller = new Controller();
				controller.edit({tripId: 3});
				expect(EditFlightWorkflow.off.mostRecentCall.args[0]).toEqual('complete');
			});

			it('adds the complete event', function() {
				spyOn(EditFlightWorkflow, 'handle').andCallFake(function() {});
				spyOn(EditFlightWorkflow, 'on');
				controller = new Controller();
				controller.edit({tripId: 3});
				expect(EditFlightWorkflow.on.mostRecentCall.args[0]).toEqual('complete');
			});
		});
	});
});
