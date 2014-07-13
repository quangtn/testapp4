define(['backbone', 'models/session'],
function(Backbone, Session) {
// unit tests
describe('Session Model', function() {
	var session, validationResponse, formAttributes;
	var pending = function () {
		expect('pending').toEqual('completed');
	};

	beforeEach(function() {
		formAttributes = {};
		session = new Session();
	});

	it('should exist', function() {
		expect( Session ).toBeTruthy();
	});

	xdescribe('when logging in', function() {// creating a session

		var loginFixtures = {
			success: {
				status: 200,
				responseText: '{"hehe": true, "user": true}'
			},
			error: {
				status: 200,
				responseText: '{"error": "some error"}'
			}
		};

		it('should validate the existence of an email', function() {
			spyOn(session, 'validate').andCallThrough();
			// no email set
			validationResponse = session.validate( formAttributes );

			expect( session.validate ).toHaveBeenCalled();
			expect( validationResponse ).toContain('Username can not be blank');
		});

		it('should validate the validity of the email', function() {
			spyOn(session, 'validate').andCallThrough();
			formAttributes.email = 'invalid email';
			validationResponse = session.validate( formAttributes );

			expect( session.validate ).toHaveBeenCalled();
			expect( validationResponse ).toContain('Please enter a valid email address');
		});

		it('should validate the existence of a password', function() {
			spyOn(session, 'validate').andCallThrough();

			// no password set
			validationResponse = session.validate( formAttributes );

			expect( session.validate ).toHaveBeenCalled();
			expect( validationResponse ).toContain('Password can not be blank');
		});

		it('should fire a `error` event if the login was unsuccessful', function() {
			jasmine.Ajax.useMock();

			var callback = jasmine.createSpy();
			var errback = jasmine.createSpy();

			session.on('success', callback);
			session.on('error', errback);

			session.set({
				'email': 'hehe@haha.com',
				'password': 'haha'
			});

			session.createSession();
			var request = mostRecentAjaxRequest();

			request.response( loginFixtures.error );

			expect( callback ).not.toHaveBeenCalled();
			expect( errback ).toHaveBeenCalled();
		});

		it('should fire a `success` event if the login was successful', function() {
			jasmine.Ajax.useMock();

			var callback = jasmine.createSpy();
			var errback = jasmine.createSpy();

			session.on('success', callback);
			session.on('error', errback);

			session.set({
				'email': 'hehe@haha.com',
				'password': 'haha'
			});

			session.createSession();
			var request = mostRecentAjaxRequest();

			request.response(loginFixtures.success);

			expect( callback ).toHaveBeenCalled();
			expect( errback ).not.toHaveBeenCalled();
		});
	});

	xdescribe('existing session validation', function() {

		var loginFixtures = {
			success: {
				status: 200,
				responseText: '{"hehe": true, "user": true}'
			},
			error: {
				status: 403,
				responseText: '{"error": "some error"}'
			}
		};

		// already logged in
		it('should skip validation if the user is already set', function() {
			// why does this need to work this way?
		});

		it('should fire the appropriate event if session is still valid', function() {
			jasmine.Ajax.useMock();

			var callback = jasmine.createSpy();
			var errback = jasmine.createSpy();

			session.on('success', callback);
			session.on('error', errback);

			session.set({
				'email': 'hehe@haha.com',
				'password': 'haha'
			});

			session.checkActiveSession();
			var request = mostRecentAjaxRequest();

			request.response(loginFixtures.success);

			expect( callback ).toHaveBeenCalled();
			expect( errback ).not.toHaveBeenCalled();

		});

		it('should fire the appropriate error event if session is invalid', function() {
			jasmine.Ajax.useMock();

			var callback = jasmine.createSpy();
			var errback = jasmine.createSpy();

			session.on('success', callback);
			session.on('session:error', errback);

			session.set({
				'email': 'hehe@haha.com',
				'password': 'haha'
			});

			session.checkActiveSession();
			var request = mostRecentAjaxRequest();

			request.response(loginFixtures.error);

			expect( callback ).not.toHaveBeenCalled();
			expect( errback ).toHaveBeenCalled();
		});
	});

	describe("get methods", function() {

		describe("getMemberships", function() {

			it("should return user memberships if user has memberships", function() {
				session.user = {
					program_memberships: [{
					"@name": "program_membership",
					"name": "AMEXBENEFITS"
					}],
					get: jasmine.createSpy("get")
				};

				var memberships = session.getMemberships();

				expect(session.user.get).toHaveBeenCalledWith("program_memberships");
				// expect(memberships).toBeDefined();
				// expect(memberships).toBe(jasmine.any(Array));
				// expect(memberships.length).toBeTruthy();
			});

		});

	});
});

});








