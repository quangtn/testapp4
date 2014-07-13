define(['namespace', 'jquery', 'backbone', 'mediator', 'controllers/terms_controller', 'helpers'],
function(app, $, Backbone, mediator, TermsController, helpers) {

	describe("Terms Controller", function() {

		var controller;

		it("should exist", function() {
			expect(TermsController).toBeDefined();
		});

		it("should initialize", function () {
			controller = new TermsController();

			expect(controller).toBeDefined();
		});

		describe("initialization", function () {

			beforeEach(function () {
				spyOn(TermsController.prototype, "initialize").andCallThrough();
				spyOn(TermsController.prototype, "_initSubscriptions").andCallThrough();

				controller = new TermsController();
			});

			it("should call initialize", function () {
				expect(TermsController.prototype.initialize).toHaveBeenCalled();
			});

			it("should subscribe to events", function() {
				expect(TermsController.prototype._initSubscriptions).toHaveBeenCalled();
			});

			describe("subscriptions", function() {

				beforeEach(function() {
					spyOn(mediator, "subscribe");

					controller = new TermsController();
				});

				it("should register terms:show event", function() {
					expect(mediator.subscribe).toHaveBeenCalledWith("terms:show", jasmine.any(Function), jasmine.any(Object));
				});

				it("should register terms:prompt event", function() {
					expect(mediator.subscribe).toHaveBeenCalledWith("terms:prompt", jasmine.any(Function), jasmine.any(Object));
				});

				it("should register terms:accept event", function() {
					expect(mediator.subscribe).toHaveBeenCalledWith("terms:accept", jasmine.any(Function), jasmine.any(Object));
				});

				it("should register terms:deny event", function() {
					expect(mediator.subscribe).toHaveBeenCalledWith("terms:deny", jasmine.any(Function), jasmine.any(Object));
				});
			});
		});

		describe("methods", function() {

			var onShow, onPrompt, onAccept, onDeny;
			var googleAnalytics;

			beforeEach(function() {
				googleAnalytics = window._gaq;
				spyOn(mediator, "subscribe");
				spyOn(mediator, "publish").andCallThrough();
				spyOn(mediator, "_autoload");
				spyOn(googleAnalytics, "push").andCallThrough();

				controller = new TermsController();
				spyOn(controller, 'setView');
			});

			describe("onShow", function() {

				beforeEach(function() {
					onShow = controller.onShow;
				});

				it("should exist", function() {
					expect(onShow).toBeDefined();
				});

				it("should be tied to the terms:show event", function() {
					expect(mediator.subscribe).toHaveBeenCalledWith("terms:show", onShow, jasmine.any(Object));
				});

				xit("should respond to the terms:show event", function() {
					mediator.publish("terms:show");

					expect(onShow).toHaveBeenCalled();
				});

				xit("should create the terms view", function() {
					onShow();

					expect(controller.view).toBeUndefined();
				});

				xit("should render the terms view", function() {
					onShow();

					expect($.isInView(controller.view)).toBeTruthy();
				});

				it("should report event to Google Analytics for tracking", function() {
					var showEvent = ['_trackEvent', 'Terms', 'Start', 'tdot'];

					onShow();

					expect(googleAnalytics.push).toHaveBeenCalledWith(showEvent);
				});
			});

			describe("onPrompt", function() {

				beforeEach(function() {
					onPrompt = controller.onPrompt;
				});

				it("should exist", function() {
					expect(onPrompt).toBeDefined();
				});

				it("should be tied to the terms:prompt event", function() {
					expect(mediator.subscribe).toHaveBeenCalledWith("terms:prompt", onPrompt, jasmine.any(Object));
				});

				xit("should create an accept terms view", function() {
					expect();
				});

				xit("should render the accept terms view", function() {
					expect();
				});

				it("should report event to Google Analytics for tracking", function() {
					var promptEvent = ['_trackEvent', 'Terms', 'Prompt', 'tdot'];

					onPrompt();

					expect(googleAnalytics.push).toHaveBeenCalledWith(promptEvent);
				});
			});

			describe("onAccept", function() {

				beforeEach(function() {
					onAccept = controller.onAccept;
				});

				it("should exist", function() {
					expect(onAccept).toBeDefined();
				});

				it("should be tied to the terms:accept event", function() {
					expect(mediator.subscribe).toHaveBeenCalledWith("terms:accept", onAccept, jasmine.any(Object));
				});

				xit("should respond to terms:accept events", function() {
					mediator.publish("terms:accept");

					expect(onAccept).toHaveBeenCalled();
				});

				it("should update the user model to say they accepted the terms", function() {
					spyOn(controller.terms, 'accept');

					onAccept();

					expect(controller.terms.accept).toHaveBeenCalled();
				});

				xit("should sync the model change to rails over mapi", function() {
					expect();
				});

				xit("should handle abandonment and interruptions", function() {
					expect();
				});

				xit("should destroy the accept terms view", function() {
					expect();
				});

				xit("should throw the user back into the app", function() {
					expect();
				});

				it("should report event to Google Analytics for tracking", function() {
					var acceptEvent = ['_trackEvent', 'Terms', 'Accepted', 'tdot'];
					spyOn(controller.terms, 'accept');

					onAccept();

					expect(googleAnalytics.push).toHaveBeenCalledWith(acceptEvent);
				});
			});

			describe("onDeny", function() {

				beforeEach(function() {
					onDeny = controller.onDeny;
				});

				it("should exist", function() {
					expect(onDeny).toBeDefined();
				});

				it("should be tied to the terms:deny event", function() {
					expect(mediator.subscribe).toHaveBeenCalledWith("terms:deny", onDeny, jasmine.any(Object));
				});

				xit("should destroy the accept terms view", function() {
					onDeny();

					expect();
				});

				it("should log the user out", function() {
					onDeny();

					expect(mediator.publish).toHaveBeenCalledWith("session:logout");
				});

				xit("should render the login screen", function() {
					onDeny();

					expect(app.controllers.session.view).toBe(true);
				});

				it("should report event to Google Analytics for tracking", function() {
					var denyEvent = ['_trackEvent', 'Terms', 'Denied', 'tdot'];

					onDeny();

					expect(googleAnalytics.push).toHaveBeenCalledWith(denyEvent);
				});
			});
		});
	});
});