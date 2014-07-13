define(['namespace', 'jquery', 'backbone', 'mediator', 'controllers/amex_benefits_controller', 'trips_manager', 'helpers', 'strings'],
function(app, $, Backbone, mediator, AmexBenefitsController, TripsManager, helpers, t) {

	describe("Amex Controller", function() {

		var controller;

		it("should exist", function() {
			expect(AmexBenefitsController).toBeDefined();
		});

		it("should initialize", function () {
			controller = new AmexBenefitsController();

			expect(controller).toBeDefined();
		});

		describe("initialization", function () {

			beforeEach(function () {
				spyOn(AmexBenefitsController.prototype, "initialize").andCallThrough();
				spyOn(AmexBenefitsController.prototype, "_initSubscriptions").andCallThrough();

				controller = new AmexBenefitsController();
			});

			it("should call initialize", function () {
				expect(AmexBenefitsController.prototype.initialize).toHaveBeenCalled();
			});

			it("should subscribe to events", function() {
				expect(AmexBenefitsController.prototype._initSubscriptions).toHaveBeenCalled();
			});

			describe("subscriptions", function() {

				beforeEach(function() {
					spyOn(mediator, "subscribe");

					controller = new AmexBenefitsController();
				});

				it("should register amex_benefits:index event", function() {
					expect(mediator.subscribe).toHaveBeenCalledWith("amex_benefits:index", jasmine.any(Function), jasmine.any(Object));
				});

				it("should register amex_benefits:refresh event", function() {
					expect(mediator.subscribe).toHaveBeenCalledWith("amex_benefits:refresh", jasmine.any(Function), jasmine.any(Object));
				});
			});

		});

		describe("methods", function() {

			var onRefresh, onBenefits;

			beforeEach(function() {
				spyOn(mediator, "subscribe");
				spyOn(mediator, "publish").andCallThrough();
				spyOn(mediator, "_autoload");

				controller = new AmexBenefitsController();
				spyOn(controller, 'setView');
			});

			describe("onBenefits", function() {

				beforeEach(function() {
					onBenefits = controller.onBenefits;
				});

				it("should exist", function() {
					expect(onBenefits).toBeDefined();
				});

				it("should be tied to the amex_benefits:index event", function() {
					expect(mediator.subscribe).toHaveBeenCalledWith("amex_benefits:index", onBenefits, jasmine.any(Object));
				});

				describe("when user has benefits", function() {
					var tripId = 1;

					beforeEach(function() {
						spyOn(TripsManager, "getCurrentTripId").andReturn(tripId);
						spyOn(controller, "changeURL").andCallThrough();
					});

					it("should load AMEX Benefits view", function() {
						onBenefits();

						expect(controller.view).toBeDefined();
					});

					it("should change the URL to 'trips/:trip_id/amex'", function() {
						onBenefits();

						expect(controller.changeURL).toHaveBeenCalledWith("trips/" + tripId + "/amex");
					});

					it("should update the header to 'Benefits' with 'Back' and 'Refresh' buttons and refresh button should call 'amex_benefits:refresh'", function() {
						onBenefits();

						expect(mediator.publish).toHaveBeenCalledWith('header:updateHeader', {
							backAction: 'back:history',
							title: t.Benefits,
							rightButtons: [{
								name: 'benefits-refresh',
								iconURL: 'button-icon btn_icon_refresh_25px',
								action: 'amex_benefits:refresh'
							}]
						});
					});
				});

			});

			describe("onRefresh", function() {

				beforeEach(function() {
					onRefresh = controller.onRefresh;
				});

				it("should exist", function() {
					expect(onRefresh).toBeDefined();
				});

				it("should be tied to the amex_benefits:refresh event", function() {
					expect(mediator.subscribe).toHaveBeenCalledWith("amex_benefits:refresh", onRefresh, jasmine.any(Object));
				});

			});

		});

	});

});