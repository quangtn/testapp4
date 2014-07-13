require(['namespace', 'jquery', 'mediator', 'backbone',
		'workflows/edit_generic_workflow',
		'models/generic_trip_item',
		'models/trip',
		'workflows/add_generic_workflow',
		'trips_manager'
],
function(app, $, mediator, Backbone,
		editGenericWorkflow,
		GenericTripItemModel,
		TripModel,
		addGenericWorkflow,
		TripsManager
		) {
	var pending = function () {
		expect('pending').toEqual('completed');
	};

	var workflow = editGenericWorkflow;

	app.otherEventsMeta = {
		lodging: {is_transportation:false}
	};
	describe('Edit generic Workflow', function() {
		mediator.subscribe('header:updateHeader', $.noop);
		var workflow = editGenericWorkflow;
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
			var genericTripItem = new GenericTripItemModel();
      genericTripItem.trip =  new Backbone.Model({id:101});

			expect( workflow.state ).toEqual( 'uninitialized' );
			workflow.handle('initialize', {
				model: new GenericTripItemModel({},{type: 'alien_spacetrip', trip: new Backbone.Model({id:101})}),
				controller: {
					setView: jasmine.createSpy() ,
          _updateHeader: jasmine.createSpy()
        }
			});
			expect( workflow.state ).toEqual( 'showingForm' );
		});
	});

	describe('showingForm', function() {
		var editingView;
		beforeEach(function() {
			var genericTripItem = new GenericTripItemModel();
			genericTripItem.trip =  new Backbone.Model({id:101, trip: new Backbone.Model({id:101})});
			workflow.transition('uninitialized');
			expect( workflow.state ).toEqual( 'uninitialized' );
			workflow.handle('initialize', {
				model: new GenericTripItemModel({},{type: 'alien_spacetrip', trip:new Backbone.Model({id:101})}),
				controller: {
					setView: jasmine.createSpy() ,
          _updateHeader: jasmine.createSpy()
        }
			});
			expect( workflow.state ).toEqual( 'showingForm' );
		});

		describe('save event', function() {
			beforeEach(function() {
				workflow.generic.getTripId = jasmine.createSpy();
				workflow.transition('showingForm');
				expect(workflow.state).toEqual('showingForm');
			});

			afterEach(function() {
				mediator.unsubscribe('error:trigger');
			});

			it ('should handle form validation errors', function() {
				spyOn(mediator, 'publish');
				workflow.generic.validate = jasmine.createSpy().andCallFake(function() {
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
				workflow.generic.validate = jasmine.createSpy().andCallFake(function() {
					this.unset('error', {silent:true});
					return [];
				});
				workflow.generic.save = jasmine.createSpy().andCallFake(
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

			it('should handle the back event', function() {
				var fn = jasmine.createSpy();
				mediator.subscribe('back:history', fn);
			});

			it('should save imported item', function() {
				spyOn(workflow.generic, 'isImported').andReturn(true);
				spyOn(workflow.generic, 'set');
				spyOn(addGenericWorkflow, 'saveGenericTripItem');

				workflow.handle('save', {
					note: 'hotdogs are delicious',
					for_business: true
				});

				expect(workflow.generic.set).toHaveBeenCalledWith({
					note: 'hotdogs are delicious',
					for_business: true
				}, {silent:true});
			});
		});

		it('should handle the back event', function() {
			var fn = jasmine.createSpy();
			mediator.subscribe('back:history', fn);
		});
	});

});

