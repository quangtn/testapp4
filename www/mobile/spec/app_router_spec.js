define(['namespace', 'backbone', 'router', 'models/trip', 'collections/trips', 'trips_manager', 'mediator'],
function(app, Backbone, AppRouter, Trip, Trips, TripsManager, mediator) {

	describe('App Router', function() {

		it('exists', function() {
			expect(AppRouter).toBeTruthy();
		});

		it('instantiates', function() {
			var x = new AppRouter();
			expect(x instanceof AppRouter).toBeTruthy();
			expect(x instanceof Backbone.Router).toBeTruthy();
		});

		describe('entry point calculator', function() {
			it('should return trips:index message when there is no most relevant trip', function() {
				var router = new AppRouter();

				// don't return a mostRelevantTrip
				spyOn(router, 'getMostRelevantTrip')
				.andReturn(undefined);

				expect(router.calcUserEntryPoint().message).toEqual('trips:index');
			});

			it('should return trip_items:feed message when there is a relevant trip', function() {
				var router = new AppRouter();

				// set up a fake relevant trip to be returned by getMostRelevantTrip
				var fakeTrip = jasmine.createSpyObj('trip', [
					'bestViewTypeBasedOnStartTime',
					'getTripId',
					'setTripFeedView'
				]);
				fakeTrip.bestViewTypeBasedOnStartTime.andReturn('feed');
				fakeTrip.getTripId.andReturn(123);

				// return the fake trip
				spyOn(router, 'getMostRelevantTrip')
				.andReturn(fakeTrip);

				expect(router.calcUserEntryPoint().message).toEqual('trip_items:feed');
			});

			it('should return trips:index message when best trip view is "none"', function() {
				var router = new AppRouter();

				// set up a fake relevant trip to be returned by getMostRelevantTrip
				var fakeTrip = jasmine.createSpyObj('trip', [
					'bestViewTypeBasedOnStartTime',
					'getTripId',
					'setTripFeedView'
				]);
				fakeTrip.bestViewTypeBasedOnStartTime.andReturn('none');
				fakeTrip.getTripId.andReturn(123);

				// return the fake trip
				spyOn(router, 'getMostRelevantTrip')
				.andReturn(fakeTrip);

				expect(router.calcUserEntryPoint().message).toEqual('trips:index');
			});

		});

		it('should get the most relevant trip from the trips collection', function() {
			var router = new AppRouter();

			// spy on any existing functions, create them as spies if they don't exist
			if(!app.session) {
				app.session = jasmine.createSpyObj('session', [
					'get'
				]);
			} else {
				spyOn(app.session, 'get');
			}

			app.session.get.andReturn(123);

			var trips = new Trips();
			spyOn(TripsManager, 'getTrips').andReturn(trips);
			spyOn(trips, 'get');


			router.getMostRelevantTrip();

			expect(trips.get).toHaveBeenCalledWith(123);
		});


		it('shouldnt blow up if most relevant trip isnt in session', function() {
			var router = new AppRouter();

			// spy on any existing functions, create them as spies if they don't exist
			if(!app.session) {
				app.session = jasmine.createSpyObj('session', [
					'get'
				]);
			} else {
				spyOn(app.session, 'get');
			}

			app.session.get.andReturn(undefined);

			var trips = new Trips();
			spyOn(TripsManager, 'getTrips').andReturn(trips);
			spyOn(trips, 'get');

			router.getMostRelevantTrip();

			expect(trips.get).not.toHaveBeenCalled();
		});

		describe('login error handler', function() {

			var router;

			beforeEach(function() {
				router = new AppRouter();
				spyOn(mediator, '_autoload');
			});

			it('should exist', function() {
				expect(router.loginError).toBeTruthy();
			});

			it('should add messages to the flash', function() {
				spyOn(app.flash, 'addError');

				router.loginError('an error');

				expect(app.flash.addError).toHaveBeenCalled();
			});

			it('should be URI decoding messages', function() {
				var encodedErrorMessage = 'encoded%20error%20message';
				spyOn(app.flash, 'addErrorFromURI');

				router.loginError(encodedErrorMessage);

				expect(app.flash.addErrorFromURI).toHaveBeenCalledWith(encodedErrorMessage);
			});

			it('should call login handler', function() {
				spyOn(router, 'login');

				router.loginError('an error');

				expect(router.login).toHaveBeenCalled();
			});

		});

	});

});
