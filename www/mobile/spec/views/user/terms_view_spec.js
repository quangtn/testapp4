define(['namespace', 'jquery', 'backbone', 'mediator', 'views/user/terms_view', 'strings'],
function(app, $, Backbone, mediator, TermsView, t) {

	var termsView = new TermsView();


	describe("Terms & Conditions View", function() {
		beforeEach(function() {
			spyOn(mediator, "publish");
		});

		it("should exist", function() {
			expect(TermsView).toBeDefined();
		});

		it("should instantiate", function() {
			expect(termsView).toBeDefined();
		});

		describe("interface", function() {

			describe("navbar", function() {

				it("should exist", function() {
					expect(termsView.$el.find("#termsNav")).toBeTruthy();
				});
			});

			describe("accept terms buttons", function() {

				termsView = new TermsView({prompt: true});

				it("should exist", function() {
					expect(termsView.$el.find(".button-group.standard-form-panel.display-box")).toBeTruthy();
				});

				it("should have an accept button", function() {
					expect(termsView.$el.find("#accept-terms")).toBeTruthy();
				});

				it("should have a deny button", function() {
					expect(termsView.$el.find("#deny-terms")).toBeTruthy();
				});

			});
		});

		describe("methods", function() {

			describe("initialize", function() {

				it("should exist", function() {
					expect(termsView.initialize).toBeDefined();
				});

			});

			describe("onAccept", function() {

				var originalOfflineState;

				beforeEach(function() {
					originalOfflineState = app.isOnline;
					app.isOnline = true;
				});

				afterEach(function() {
					app.isOnline = originalOfflineState;
				});

				it("should exist", function() {
					expect(termsView.onAccept).toBeDefined();
				});

				it("should publish 'terms:accept' to the mediator", function() {
					termsView.onAccept();

					expect(mediator.publish).toHaveBeenCalledWith("terms:accept");
				});

				it("should publish the offline message if the app is offline", function() {
					app.isOnline = false;

					termsView.onAccept();

					expect(mediator.publish)
					.toHaveBeenCalledWith('error:trigger', 'service', [ { message : t.ErrorOffline }]);
				});

			});

			describe("onDeny", function() {

				var originalOfflineState;

				beforeEach(function() {
					originalOfflineState = app.isOnline;
					app.isOnline = true;
				});

				afterEach(function() {
					app.isOnline = originalOfflineState;
				});

				it("should exist", function() {
					expect(termsView.onDeny).toBeDefined();
				});

				it("should publish 'terms:deny' to the mediator", function() {
					termsView.onDeny();

					expect(mediator.publish).toHaveBeenCalledWith("terms:deny");
				});

				it("should publish the offline message if the app is offline", function() {
					app.isOnline = false;

					termsView.onDeny();

					expect(mediator.publish)
					.toHaveBeenCalledWith('error:trigger', 'service', [ { message : t.ErrorOffline }]);
				});

			});

			describe("onNav", function() {

				it("should exist", function() {
					expect(termsView.onNav).toBeDefined();
				});

			});

			describe("showPage", function() {

				it("should exist", function() {
					expect(termsView.showPage).toBeDefined();
				});

			});

			describe("checkURL", function() {

				it("should exist", function() {
					expect(termsView.checkURL).toBeDefined();
				});

			});

			describe("serialize", function() {

				it("should exist", function() {
					expect(termsView.serialize).toBeDefined();
				});

			});

		});
	});
});