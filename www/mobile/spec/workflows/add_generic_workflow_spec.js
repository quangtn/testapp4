require([
	'namespace', 'jquery', 'mediator', 'backbone',
	'workflows/add_generic_workflow',
	'models/generic_trip_item',
	'models/trip',
	'models/location',
	'helpers',
	'parsers/trip_parser',
	'workflows/search_for_location_workflow',
	'trips_manager'
], function(
	app, $, mediator, Backbone,
	addGenericWorkflow,
	GenericTripItemModel,
	TripModel, LocationModel,
	helpers,
	TripParser,
	searchForLocationWorkflow,
	TripsManager
) {

	var pending = function () {
		expect('pending').toEqual('completed');
	};

	var workflow = addGenericWorkflow;




	app.otherEventsMeta = {
		lodging: {is_transportation:false}
	};
	describe('Add Generic Workflow', function() {
		beforeEach(function() {
			spyOn(mediator, 'publish');
			spyOn(TripsManager, 'getCurrentTrip').andReturn({
				getDestinationCountry: $.noop
			});
			mediator.subscribe('header:updateHeader', $.noop);
		});
		var workflow = addGenericWorkflow;
		it('should exist', function() {
			expect( workflow ).toBeTruthy();
		});

		it('should start in an uninitialized state', function() {
			expect( workflow.state ).toEqual( 'uninitialized' );
		});

		it('should not transition to showingForm when initialized without a model', function() {
			expect( workflow.state ).toEqual( 'uninitialized' );
			var initialize = function() {
				workflow.handle('initialize');
			};
			expect( initialize ).toThrow();
			expect( workflow.state ).toEqual( 'uninitialized' );
		});

		it('should transition to showingForm when initialized with a model', function() {
			expect( workflow.state ).toEqual( 'uninitialized' );
			workflow.handle('initialize', {
				trip: new Backbone.Model(),
				controller: {
					model: new GenericTripItemModel({},{type:'alien_spacecraft'}),
					setView: jasmine.createSpy(),
          _updateHeader: jasmine.createSpy()
				}
			});
			expect( workflow.state ).toEqual( 'showingForm' );
		});
	});

	describe('showingForm', function() {
		beforeEach(function() {
			workflow.transition('uninitialized');
			expect( workflow.state ).toEqual( 'uninitialized' );
			workflow.handle('initialize', {
				controller: {
					model: new GenericTripItemModel({},{type:'alien_spacecraft'}),
					setView: jasmine.createSpy(),
					_updateHeader: jasmine.createSpy()
				}
			});
			expect( workflow.state ).toEqual( 'showingForm' );
			expect( workflow.tripItem);
		});

		it('should set view on enter', function() {
			workflow.handle('_onEnter');
			expect(workflow.controller.setView).toHaveBeenCalledWith(workflow.addView);
		});

		it('should handle the selectLocation event', function() {
			workflow.handle('onClickLocationPicker', 'startLocation', workflow.newTripItem);
			expect(workflow.locationModel instanceof LocationModel).toBeTruthy();
			expect(workflow.state).toEqual('addingManualLocation');
		});
		describe('save event', function() {
			beforeEach(function() {
				workflow.newTripItem.getTripId = jasmine.createSpy();
				workflow.transition('showingForm');
				spyOn(workflow, 'setUserData');
				expect(workflow.state).toEqual('showingForm');
				spyOn(mediator, 'publish');
			});

			it ('should handle form validation errors', function() {
				workflow.newTripItem.validate = jasmine.createSpy().andCallFake(function() {
					this.set({error:'error'}, {silent:true});
					return [];
				});
				workflow.handle('save', {
					values: {
						name:'',
						start_date: '',
						start_time: '',
						end_date: '',
						end_time: ''
					}
				});

				expect(mediator.publish).toHaveBeenCalledWith('error:trigger', 'form_validation', 'error');
			});

			it ('should handle a happy model', function() {
				workflow.newTripItem.validate = jasmine.createSpy().andCallFake(function() {
					this.unset('error', {silent:true});
					return [];
				});
				workflow.newTripItem.save = jasmine.createSpy().andCallFake(
					function(attrs, options) {
						options.success.call(workflow);
				});
				workflow.handle('save', {
					values: {
						name:'',
						start_date: '',
						start_time: '',
						end_date: '',
						end_time: ''
					}
				});
				expect(workflow.state).toEqual('uninitialized');
			});
		});

		describe('addingManualLocation', function() {
			beforeEach(function() {
				workflow.transition('uninitialized');
				expect( workflow.state ).toEqual( 'uninitialized' );

				workflow.handle('initialize', {
					controller: {
						model: new GenericTripItemModel({},{type:'alien_spacecraft'}),
						setView: jasmine.createSpy(),
						_updateHeader: jasmine.createSpy()
					}
				});

				spyOn(workflow, 'cacheLocationPickerInputFromCurrentLocation');
				expect( workflow.state ).toEqual( 'showingForm' );
				workflow.addView.trigger('clickLocationPicker');
				expect( workflow.state ).toEqual( 'addingManualLocation' );
			});

			it('should handle the _onEnter event', function() {
				workflow.handle('_onEnter');
				expect(searchForLocationWorkflow.state).toEqual('showingForm');
			});
			it('should handle the cancel event', function() {
				searchForLocationWorkflow.fireEvent('cancel');
				expect(workflow.state).toEqual('showingForm');
			});
			it('should handle the complete event', function() {
				var locationModel = new LocationModel({
					address_lines: '123',
					general_location: '456',
					street: 'blah',
					city: 'blah',
					state: 'blah',
					postal: 'blah',
					country: 'country'
				});
				locationModel.collection = {
					location: new Backbone.Model({name:'hello'})
				};
				workflow.locationModel = new LocationModel();
				searchForLocationWorkflow.fireEvent('complete', {location:
					locationModel});
				expect(workflow.locationModel.attributes.address_lines).toEqual('123');
				expect(workflow.locationModel.attributes.general_location).toEqual('456');
				expect(workflow.locationModel.attributes.name).toEqual('hello');
				expect(workflow.state).toEqual('showingForm');
			});
		});

		describe('complete', function() {
			beforeEach(function() {
				workflow.transition('uninitialized');
				expect( workflow.state ).toEqual( 'uninitialized' );
				spyOn(workflow, 'fireEvent');
				workflow.transition('complete');
			});
			it('should handle the _onEnter event', function() {
				expect( workflow.state ).toEqual( 'uninitialized' );
				expect(workflow.fireEvent).toHaveBeenCalled();
			});
		});

		it('sets user data', function() {
			var model = new GenericTripItemModel(),
				data = {
					name: 'jon',
					start_date: Date(),
					start_time: Date(),
					end_date: Date(),
					end_time: Date(),
					for_business: true
				};

			spyOn(model.phoneNumbers, 'reset');

			workflow.setUserData(model, data);

			expect(model.phoneNumbers.reset).toHaveBeenCalled();
			expect(model.get('for_business')).toBeTruthy();
		});
	});
});

