define([
	'handlebars', 'backbone', 'mediator', 'views/session/login_view', 'models/session', 'namespace', 'config', 'strings', 'helpers'
], function(
	Handlebars, Backbone, mediator, LoginView, SessionModel, app, config, t, helpers
) {
	var pending = function() {
		expect('pending').toEqual('completed');
	};

	var loginView;

	beforeEach(function() {
		loginView = new LoginView({
			model: new SessionModel({
				fake: 'data'
			})
		});
	});

	describe('login view', function() {

		it('should handle the truth', function() {
			expect(true).toBeTruthy();
		});

		it('should exist', function() {
			expect(loginView).toBeTruthy();
		});

		describe("serialize", function() {
			it('should return email if it exists in the session model', function() {
				spyOn(loginView.model, 'toJSON')
				.andReturn({
					email: 'hehe@hehe.com'
				});

				spyOn(loginView.model, 'getUserEmail')
				.andReturn('');

				var contextSentToTemplate = loginView.serialize();

				expect(loginView.model.toJSON).toHaveBeenCalled();
				expect(contextSentToTemplate.email).toBeDefined();
				expect(contextSentToTemplate.email).toEqual('hehe@hehe.com');
			});

			it("should return email if it exists in sessionModel.user and no session model email exists", function() {
				spyOn(loginView.model, 'toJSON')
				.andReturn({});

				spyOn(loginView.model, 'getUserEmail')
				.andReturn('wat@example.com');

				var contextSentToTemplate = loginView.serialize();

				expect(loginView.model.toJSON).toHaveBeenCalled();
				expect(contextSentToTemplate.email).toBeDefined();
				expect(contextSentToTemplate.email).toEqual('wat@example.com');
			});

			it("should return blank email if it does not exist in session model or sessionModel.user ", function() {
				spyOn(loginView.model, 'toJSON')
				.andReturn({});

				spyOn(loginView.model, 'getUserEmail')
				.andReturn('');

				var contextSentToTemplate = loginView.serialize();

				expect(loginView.model.toJSON).toHaveBeenCalled();
				expect(contextSentToTemplate.email).toBeDefined();
				expect(contextSentToTemplate.email).toEqual('');
			});

			it("should return email from sessionModel.user if sessionModel doesnt have email", function() {
				// session model with no email (user didnt type anything in, first time rendering)
				spyOn(loginView.model, 'toJSON')
				.andReturn({});

				// user may have just logged out
				spyOn(loginView.model, 'getUserEmail')
				.andReturn('email@from.user');

				var contextSentToTemplate = loginView.serialize();

				expect(loginView.model.toJSON).toHaveBeenCalled();
				expect(contextSentToTemplate.email).toBeDefined();
				expect(contextSentToTemplate.email).toEqual('email@from.user');
			});

			it("should return email from sessionModel over sessionModel.user email", function() {
				// user entered something and error occured or something, so we
				// want to show the same email they just typed in
				spyOn(loginView.model, 'toJSON')
				.andReturn({
					email: 'justtypedinemail@example.com'
				});

				// user may have just logged out
				spyOn(loginView.model, 'getUserEmail')
				.andReturn('email@from.user');

				var contextSentToTemplate = loginView.serialize();

				expect(loginView.model.toJSON).toHaveBeenCalled();
				expect(contextSentToTemplate.email).toBeDefined();
				expect(contextSentToTemplate.email).toEqual('justtypedinemail@example.com');
			});
		});

		describe('pop up errors', function() {

			it('should exist', function() {
				expect(loginView.popErrors).toBeTruthy();
			});

			xit('should be called when afterrender is triggered', function() {
				spyOn(loginView, 'popErrors');

				loginView.trigger('afterrender');

				expect(loginView.popErrors).toHaveBeenCalled();
			});

		});

		describe('facebook login handler', function() {
			var originalIsWrapped;
			var originalAuthURL;
			var originalOfflineState;
			beforeEach(function() {
				originalOfflineState = app.isOnline;
				originalIsWrapped = app.isWrapped;
				originalAuthURL = config.facebookAuthURL;
				app.isOnline = true;
			});

			afterEach(function() {
				app.isOnline = originalOfflineState;
				app.isWrapped = originalIsWrapped;
				config.facebookAuthURL = originalAuthURL;
			});

			it('should exist', function() {
				expect(loginView._facebookLogin).toBeTruthy();
			});

			it('should preventDefault on the click event when wrapped', function() {
				var fakeEvent = {
					preventDefault: jasmine.createSpy()
				};
				app.isWrapped = true;
				loginView.externalURLViewer = {
					on: jasmine.createSpy(),
					off: jasmine.createSpy(),
					open: jasmine.createSpy()
				};

				loginView._facebookLogin(fakeEvent);

				expect(fakeEvent.preventDefault).toHaveBeenCalled();
			});

			it('should not preventDefault on the click event when not wrapped', function() {
				var fakeEvent = {
					preventDefault: jasmine.createSpy()
				};
				spyOn(helpers, 'changeLocation');

				app.isWrapped = false;
				loginView._facebookLogin(fakeEvent);

				expect(helpers.changeLocation).toHaveBeenCalledWith(config.facebookAuthURL);
				expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
			});

			it('should set up the location change handler', function() {
				var fakeEvent = {
					preventDefault: jasmine.createSpy()
				};
				app.isWrapped = true;
				loginView.externalURLViewer = {
					on: jasmine.createSpy(),
					off: jasmine.createSpy(),
					open: jasmine.createSpy()
				};

				loginView._facebookLogin(fakeEvent);

				expect(loginView.externalURLViewer.on)
					.toHaveBeenCalledWith('locationChange', loginView._onChildBrowserLocationChange);
			});

			it('should remove existing event handlers', function() {
				var fakeEvent = {
					preventDefault: jasmine.createSpy()
				};
				app.isWrapped = true;
				loginView.externalURLViewer = {
					on: jasmine.createSpy(),
					off: jasmine.createSpy(),
					open: jasmine.createSpy()
				};

				loginView._facebookLogin(fakeEvent);

				expect(loginView.externalURLViewer.off).toHaveBeenCalled();
			});

			it('should launch the viewer with the auth URL', function() {
				app.isWrapped = true;
				config.facebookAuthURL = 'wat';
				var fakeEvent = {
					preventDefault: jasmine.createSpy()
				};
				loginView.externalURLViewer = {
					on: jasmine.createSpy(),
					off: jasmine.createSpy(),
					open: jasmine.createSpy()
				};

				loginView._facebookLogin(fakeEvent);

				expect(loginView.externalURLViewer.open)
				.toHaveBeenCalledWith('wat?referrer=wrapped');
			});

			it('should publish the offline message if the app is offline', function() {
				app.isOnline = false;
				spyOn(mediator, 'publish');


				loginView._facebookLogin();

				expect(mediator.publish)
				.toHaveBeenCalledWith('error:trigger', 'service', [ { message : t.ErrorOffline }]);
			});

		});

		describe('child browser location change handler', function() {

			var succUrl = 'https://www.tripcase.com/tdot/#login/success';
			var failUrl = 'https://www.tripcase.com/tdot/#login/failure/This%20is%20an%20error%20message.';

			it('should exist', function() {
				expect(loginView._onChildBrowserLocationChange).toBeTruthy();
			});

			describe('when successful', function() {

				it('should close child browser', function() {
					spyOn(loginView, 'closeChildBrowser');

					loginView._onChildBrowserLocationChange(succUrl);

					expect(loginView.closeChildBrowser).toHaveBeenCalled();
				});

				it('should navigate home', function() {
					spyOn(app.controllers.session, 'navigateHome');
					spyOn(loginView, 'closeChildBrowser');

					loginView._onChildBrowserLocationChange(succUrl);

					expect(app.controllers.session.navigateHome).toHaveBeenCalled();
				});

			});

			describe('when failed', function() {

				beforeEach(function() {
					spyOn(loginView, 'popErrors');
					spyOn(loginView, 'closeChildBrowser');
				});

				it('should close child browser', function() {
					loginView._onChildBrowserLocationChange(failUrl);

					expect(loginView.closeChildBrowser).toHaveBeenCalled();
				});

				it('should call addErrorMessageToFlashFromHash', function() {
					spyOn(loginView, 'addErrorMessageToFlashFromHash');

					loginView._onChildBrowserLocationChange(failUrl);

					expect(loginView.addErrorMessageToFlashFromHash)
					.toHaveBeenCalledWith(
						'#login/failure/This is an error message.'
					);
				});

				it('should push decoded error to the flash', function() {
					spyOn(app.flash, 'addErrorFromURI');

					loginView.addErrorMessageToFlashFromHash(
						'#login/failure/This%20is%20an%20error%20message.'
					);

					expect(app.flash.addErrorFromURI)
					.toHaveBeenCalledWith(
						'This%20is%20an%20error%20message.'
					);
				});

				it('should pop errors', function() {
					loginView._onChildBrowserLocationChange(failUrl);

					expect(loginView.popErrors).toHaveBeenCalled();
				});

			});

			describe('close child browser', function() {

				beforeEach(function() {
					app.isWrapped = true;
					loginView.externalURLViewer = {
						close: jasmine.createSpy(),
						off: jasmine.createSpy()
					};
				});

				it('should call close() on externalURLViewer', function() {
					loginView.closeChildBrowser();

					expect(loginView.externalURLViewer.close).toHaveBeenCalled();
				});

				it('should call off() on externalURLViewer', function() {
					loginView.closeChildBrowser();

					expect(loginView.externalURLViewer.off).toHaveBeenCalledWith(
						'locationChange', loginView._onChildBrowserLocationChange
					);
				});

			});

			describe('URL parser', function() {

				var url;

				beforeEach(function() {
					spyOn(loginView, 'popErrors');
					url = window.document.createElement('a');
				});

				describe('loginFailed()', function() {

					it('should be true if login failed', function() {
						url.href = 'https://www.tripcase.com/tdot/#login/failure';
						expect(loginView._loginFailed(url)).toBeTruthy();
					});

					it('should be false if login succeeded', function() {
						url.href = 'https://www.tripcase.com/tdot/#login/success';
						expect(loginView._loginFailed(url)).toBeFalsy();
					});

				});

				describe('loginSucceeded()', function() {

					it('should be true if login successful', function() {
						url.href = 'https://www.tripcase.com/tdot/#login/success';
						expect(loginView._loginSucceeded(url)).toBeTruthy();
					});

					it('should be false if login failed', function() {
						url.href = 'https://www.tripcase.com/tdot/#login/failure';
						expect(loginView._loginSucceeded(url)).toBeFalsy();
					});

				});

				describe('invalidLoginFlowURL()', function() {

					it('should be true if tdot', function() {
						url.href = 'https://www.tripcase.com/tdot/';
						expect(loginView._invalidLoginFlowURL(url)).toBeTruthy();
					});

					it('should be true if touch2', function() {
						url.href = 'https://www.tripcase.com/touch2/mobile/';
						expect(loginView._invalidLoginFlowURL(url)).toBeTruthy();
					});

					it('should be true if web2', function() {
						url.href = 'https://www.tripcase.com/touch2/mobile/';
						expect(loginView._invalidLoginFlowURL(url)).toBeTruthy();
					});

					it('should be false if not tripcase.com', function() {
						url.href = 'https://www.trolling.com/tdot/';
						expect(loginView._invalidLoginFlowURL(url)).toBeFalsy();
					});

					it('should be false if tripcase.com and in auth flow', function() {
						url.href = 'https://www.tripcase.com/auth/facebook';
						expect(loginView._invalidLoginFlowURL(url)).toBeFalsy();
					});

				});

			});

		});

	});
});

