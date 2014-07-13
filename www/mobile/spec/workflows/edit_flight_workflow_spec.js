require([
	'mediator',
	'jquery',
	'underscore',
	'backbone',
	'workflows/edit_flight_workflow',
	'models/flight_group',
	'collections/air_reservations_list',
	'models/air_trip_item',
	'namespace',
	'collections/trips',
	'controllers/flights_controller',
	'trips_manager'
], function(
	mediator,
	$,
	_,
	Backbone,
	editFlightWorkflow,
	FlightGroupModel,
	AirReservationList,
	AirTripItemModel,
	app,
	TripCollection,
	FlightsController,
	TripsManager
) {

describe('Edit Flight Workflow', function() {
	mediator.subscribe('header:updateHeader', $.noop);
	var pending = function () {
		expect('pending').toEqual('completed');
	};
	var workflow = editFlightWorkflow;
	var airTripItemModel = new AirTripItemModel();
	var trip = new Backbone.Model();

	beforeEach(function() {
		var controller = new FlightsController(),
			flightGroup = new FlightGroupModel();
		flightGroup.reservations.add({id: 101});
		controller._layout = app.getLayout('simple');


		airTripItemModel.id = '101';
		trip.id = '101';
		trip.tripItems = new Backbone.Collection([airTripItemModel]);
		spyOn(TripsManager, 'getTrips').andReturn(new TripCollection([trip]));
		spyOn(TripsManager, 'getCurrentTripId').andReturn('101');
		spyOn(TripsManager, 'getCurrentTrip').andReturn(trip);


		workflow.transition('uninitialized');
		workflow.handle('initialize', {
			model: flightGroup,
			controller: controller
		});
	});

	it('should exist', function() {
		expect( workflow ).toBeTruthy();
	});

	it('should start in an uninitialized state', function() {
		workflow.transition('uninitialized');
		expect(workflow.state).toEqual('uninitialized');
	});

	it('should not transition to showingForm when initialized without a model', function() {
		workflow.transition('uninitialized');

		expect( workflow.state ).toEqual( 'uninitialized' );
		var initialize = function() {
			workflow.handle('initialize');
		};

		expect( initialize ).toThrow();

		expect( workflow.state ).toEqual( 'uninitialized' );
	});

	it('should transition to selectingFlight when initialized with a flight group model containing multiple reservations', function() {
		var model = new FlightGroupModel();
		model.reservations = new AirReservationList([new AirTripItemModel(), new AirTripItemModel()]);
		var controller = {
			setNavigationView: jasmine.createSpy(),
			setView: jasmine.createSpy(),
			_updateHeader: jasmine.createSpy()
		};

		workflow.transition('uninitialized');
		workflow.handle('initialize', {
			model: model,
			controller: controller
		});

		expect( workflow.state ).toEqual( 'selectingFlight' );
	});

	it('should transition to showingForm when initialized with a flight group model containing a single reservations', function() {
		var model = new FlightGroupModel();
		model.reservations = new AirReservationList([airTripItemModel]);
		workflow.transition('uninitialized');
		expect( workflow.state ).toEqual( 'uninitialized' );
		var controller = {
			setNavigationView: jasmine.createSpy(),
			setView: jasmine.createSpy(),
			_updateHeader: jasmine.createSpy()
		};

		workflow.handle('initialize', {
			model: model,
			controller: controller
		});

		expect( workflow.state ).toEqual( 'showingForm' );
	});

	it('should transition to showingForm ht group model containing a single reservations', function() {
		var model = new FlightGroupModel();
		model.reservations = new AirReservationList([airTripItemModel]);
		workflow.transition('uninitialized');
		expect( workflow.state ).toEqual( 'uninitialized' );
		var controller = {
			setNavigationView: jasmine.createSpy(),
			setView: jasmine.createSpy(),
			_updateHeader: jasmine.createSpy()
		};

		workflow.handle('initialize', {
			model: model,
			controller: controller
		});

		expect( workflow.state ).toEqual( 'showingForm' );
	});

	it('should transition to selectingAirline from showingForm', function() {
		expect( workflow.state ).toEqual( 'showingForm' );

		workflow.handle( 'selectAirline' );

		expect( workflow.state ).toEqual( 'selectingAirline' );
	});

	it('should transition back to showingForm when saving', function() {
		workflow.transition('selectingAirline');
		workflow.handle( 'back' );

		expect( workflow.state ).toEqual( 'showingForm' );
	});

	it('should transition back to showingForm as a back action', function() {
		expect( workflow.state ).toEqual( 'showingForm' );
		workflow.handle( 'selectAirline' );
		expect( workflow.state ).toEqual( 'selectingAirline' );

		workflow.handle( 'back');
		expect( workflow.state ).toEqual( 'showingForm' );
	});

	it('on back from showingForm, should transition to selectingFlight if flightgroup has multiple reservations', function() {
		var model = new FlightGroupModel();
		model.reservations = new AirReservationList([new AirTripItemModel(), new AirTripItemModel()]);
		workflow.transition('uninitialized');
		expect( workflow.state ).toEqual( 'uninitialized' );
		var controller = {
			setNavigationView: jasmine.createSpy(),
			setView: jasmine.createSpy(),
			_updateHeader: jasmine.createSpy()
		};

		workflow.handle('initialize', {
			model: model,
			controller: controller
		});

		expect( workflow.state ).toEqual( 'selectingFlight' );
		workflow.handle('selectFlight', '101');
		expect( workflow.state ).toEqual( 'showingForm' );
		workflow.handle('back');
		expect( workflow.state ).toEqual( 'selectingFlight' );
	});

	it('on back from showingForm, should transition to uninitialized if flightgroup has a single reservations', function() {
		workflow.transition('uninitialized');
		var model = new FlightGroupModel();
		model.reservations = new AirReservationList([new AirTripItemModel({id:'101'})]);
		expect( workflow.state ).toEqual( 'uninitialized' );
		var controller = {
			setNavigationView: jasmine.createSpy(),
			setView: jasmine.createSpy(),
			_updateHeader: jasmine.createSpy()
		};

		workflow.handle('initialize', {
			model: model,
			controller: controller
		});

		expect( workflow.state ).toEqual( 'showingForm' );
		workflow.handle('back');
		expect( workflow.state ).toEqual( 'uninitialized' );
	});

	it('_hasFlightChangedFromOriginal should return false if all values are the same', function() {
		var airTripItemAttributes = {
			airline: 'American Airlines',
			airline_code: 'AA',
			flight_number: '123',
			scheduled_departure: '2013-06-09T10:50:00'
		};
		var flightPathAttributes = {
			airlineName: 'American Airlines',
			airlineCode: 'AA',
			flightNumber: '123',
			departureDate: '2013-06-09T10:50:00'
		};

		workflow.airTripItem = new Backbone.Model(airTripItemAttributes);
		workflow.flightPath = new Backbone.Model(flightPathAttributes);

		expect(workflow._hasFlightChangedFromOriginal()).toBeFalsy();
	});

	it('_hasFlightChangedFromOriginal should return true if airline is different', function() {
		var airTripItemAttributes = {
			airline: 'Virgin America',
			airline_code: 'VX',
			flight_number: '123',
			scheduled_departure: '2013-06-09T10:50:00'
		};
		var flightPathAttributes = {
			airlineName: 'American Airlines',
			airlineCode: 'AA',
			flightNumber: '123',
			departureDate: '2013-06-09T10:50:00'
		};

		workflow.airTripItem = new Backbone.Model(airTripItemAttributes);
		workflow.flightPath = new Backbone.Model(flightPathAttributes);

		expect(workflow._hasFlightChangedFromOriginal()).toBeTruthy();
	});

	it('_hasFlightChangedFromOriginal should return true if flight number has changed', function() {
				var airTripItemAttributes = {
			airline: 'American Airlines',
			airline_code: 'AA',
			flight_number: '321',
			scheduled_departure: '2013-06-09T10:50:00'
		};
		var flightPathAttributes = {
			airlineName: 'American Airlines',
			airlineCode: 'AA',
			flightNumber: '123',
			departureDate: '2013-06-09T10:50:00'
		};

		workflow.airTripItem = new Backbone.Model(airTripItemAttributes);
		workflow.flightPath = new Backbone.Model(flightPathAttributes);

		expect(workflow._hasFlightChangedFromOriginal()).toBeTruthy();
	});

	it('_hasFlightChangedFromOriginal should return true if departure date has changed', function() {
				var airTripItemAttributes = {
			airline: 'American Airlines',
			airline_code: 'AA',
			flight_number: '123',
			scheduled_departure: '2013-07-09T10:50:00'
		};
		var flightPathAttributes = {
			airlineName: 'American Airlines',
			airlineCode: 'AA',
			flightNumber: '123',
			departureDate: '2013-06-09T10:50:00'
		};

		workflow.airTripItem = new Backbone.Model(airTripItemAttributes);
		workflow.flightPath = new Backbone.Model(flightPathAttributes);

		expect(workflow._hasFlightChangedFromOriginal()).toBeTruthy();
	});

	describe('showingForm state', function() {
		beforeEach(function() {
			workflow.transition('showingForm');
		});

		describe('onEnter', function() {
			it('should initialize state', function() {
				var params = {
					airline: 'american',
					airline_code: 'aa',
					flight_number: 12,
					for_business: true
				};

				spyOn(workflow.flightPath, 'clear');
				spyOn(workflow.flightPath, 'set');
				spyOn(workflow.controller, '_updateHeader');
				spyOn(workflow.controller, 'setView');
				workflow.airTripItem.set(params);

				workflow.transition('showingForm');

				expect(workflow.flightPath.clear).toHaveBeenCalled();
				expect(workflow.flightPath.set).toHaveBeenCalledWith({
					airlineName : params.airline,
					airlineCode : params.airline_code,
					flightNumber : params.flight_number,
					departureDate : undefined,
					confirmationNumber : undefined,
					for_business : params.for_business,
					corporation : undefined,
					note : undefined
				}, {
					silent : true
				});
				expect(workflow.controller._updateHeader).toHaveBeenCalledWith('Edit Flight', 'edit_flight_workflow:back');
				expect(workflow.controller.setView).toHaveBeenCalledWith(workflow.editFlightView);
			});
		});

		describe('save', function() {
			beforeEach(function() {
				spyOn(workflow.flightPath, 'set');
			});

			it('should set flight data', function() {
				var params = {
					airlineName: 'american',
					airlineCode: 'aa',
					flightNumber: 123
				};

				workflow.handle('save', params);

				expect(workflow.flightPath.set).toHaveBeenCalledWith({
					airlineName: params.airlineName,
					airlineCode: params.airlineCode,
					flightNumber: params.flightNumber,
					departureDate: undefined,
					confirmationNumber: undefined,
					note: undefined,
					for_business: false
				});
			});

			it('should save imported flight data', function() {
				spyOn(workflow.airTripItem, 'isImported').andReturn(true);

				workflow.handle('save', {
					note: 'meh'
				});

				expect(workflow.flightPath.set).toHaveBeenCalledWith({
					note: 'meh',
					for_business: false
				}, {silent: true});
			});

			describe('sync data with server', function() {
				it('should submit data');
				it('should handle different origin destination airport');
				it('should handle model error');
				it('should report analytics for imported item');
			});

			it('should handle invalid data');
		});
	});
});
});
