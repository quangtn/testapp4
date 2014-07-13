define(['mediator', 'namespace', 'controllers/launch_controller', 'trips_manager'],
function(mediator, app, LaunchController, TripsManager) {

	describe('Launch Controller', function() {

		var launch;

		beforeEach(function() {
			launch = undefined;
			app.isWrapped = true;
			spyOn(TripsManager, 'getCurrentTrip').andReturn(undefined);
		});

		it("should exist", function() {
			expect(LaunchController).toBeDefined();
		});

		it("should be functional", function() {
			launch = new LaunchController();
			expect(launch).toBeDefined();
		});

		describe("initialization", function() {
			beforeEach(function() {
				spyOn(LaunchController.prototype, 'initialize').andCallThrough();
				spyOn(LaunchController.prototype, 'init').andCallThrough();
				spyOn(LaunchController.prototype, '_initDefault').andCallThrough();
				spyOn(LaunchController.prototype, '_initIos').andCallThrough();
				launch = new LaunchController();
			});

			it("should initialize", function() {
				expect(LaunchController.prototype.initialize).toHaveBeenCalled();
				expect(LaunchController.prototype.init).toHaveBeenCalled();
				expect(LaunchController.prototype.init()).toBe(true);
				expect(launch.initialized).toBe(true);
			});

			describe("default initialization", function() {

				beforeEach(function() {
					app.isIos = false;
					launch = new LaunchController();
				});

				it("should initialize resume/pause listeners", function() {
					expect(LaunchController.prototype._initDefault).toHaveBeenCalled();
					expect(LaunchController.prototype._initDefault()).toBe(true);
				});

				it("should not initialize active/resign listeners", function() {
					expect(LaunchController.prototype._initIos).not.toHaveBeenCalled();
					expect(LaunchController.prototype._initIos()).toBe(false);
				});
			});

			describe("initialization under iOS", function() {

				beforeEach(function() {
					app.isIos = true;
					launch = new LaunchController();
				});

				it("should initialize resume/pause listeners", function() {
					expect(LaunchController.prototype._initDefault).toHaveBeenCalled();
					expect(LaunchController.prototype._initDefault()).toBe(true);
				});

				it("should initialize extra active/resign listeners if iOS", function() {
					expect(LaunchController.prototype._initIos).toHaveBeenCalled();
					expect(LaunchController.prototype._initIos()).toBe(true);
				});
			});
		});

		describe("PhoneGap event listeners", function() {

			beforeEach(function() {
				spyOn(document, "addEventListener").andCallThrough();
			});

			describe("default listeners", function() {

				beforeEach(function() {
					app.isIos = false;
					launch = new LaunchController();
				});

				describe("resume", function() {
					it("should be listening on the document", function() {
						expect(document.addEventListener).toHaveBeenCalledWith("resume", jasmine.any(Function));
					});
				});

				describe("pause", function() {
					it("should be listening on the document", function() {
						expect(document.addEventListener).toHaveBeenCalledWith("pause", jasmine.any(Function));
					});
				});

				describe("active", function() {
					it("should not be listening on the document", function() {
						expect(document.addEventListener).not.toHaveBeenCalledWith("active", jasmine.any(Function));
					});
				});

				describe("resign", function() {
					it("should not be listening on the document", function() {
						expect(document.addEventListener).not.toHaveBeenCalledWith("resign", jasmine.any(Function));
					});
				});
			});

			describe("listeners under iOS", function() {

				beforeEach(function() {
					app.isIos = true;
					launch = new LaunchController();
				});

				describe("resume", function() {
					it("should be listening on the document", function() {
						expect(document.addEventListener).toHaveBeenCalledWith("resume", jasmine.any(Function));
					});
				});

				describe("pause", function() {
					it("should be listening on the document", function() {
						expect(document.addEventListener).toHaveBeenCalledWith("pause", jasmine.any(Function));
					});
				});

				describe("active", function() {
					it("should be listening on the document", function() {
						expect(document.addEventListener).toHaveBeenCalledWith("active", jasmine.any(Function));
					});
				});

				describe("resign", function() {
					it("should be listening on the document", function() {
						expect(document.addEventListener).toHaveBeenCalledWith("resign", jasmine.any(Function));
					});
				});
			});
		});

		describe("PhoneGap events", function() {

			var gapEvent;

			beforeEach(function() {
				gapEvent = undefined;
				gapEvent = document.createEvent("Event");
				spyOn(LaunchController.prototype, 'onResume').andCallThrough();
				spyOn(LaunchController.prototype, 'onPause').andCallThrough();
				spyOn(LaunchController.prototype, 'onActive').andCallThrough();
				spyOn(LaunchController.prototype, 'onResign').andCallThrough();
				spyOn(mediator, "publish");
			});

			describe("default events", function() {

				beforeEach(function() {
					app.isIos = false;
				});

				describe("resume handler", function() {

					beforeEach(function() {
						gapEvent.initEvent("resume", true, false);
						launch = new LaunchController();
						document.dispatchEvent(gapEvent);
					});

					it("should exist", function() {
						expect(LaunchController.prototype.onResume).toBeDefined();
					});

					it("should respond to PhoneGap resume event", function() {
						expect(LaunchController.prototype.onResume).toHaveBeenCalled();
					});

					it("should publish device:resume to mediator", function() {
						expect(launch.onResume()).toBe(true);
						expect(mediator.publish).toHaveBeenCalledWith("device:resume", undefined);
					});
				});

				describe("pause handler", function() {

					beforeEach(function() {
						gapEvent.initEvent("pause", true, false);
						launch = new LaunchController();
						document.dispatchEvent(gapEvent);
					});

					it("should exist", function() {
						expect(LaunchController.prototype.onPause).toBeDefined();
					});

					it("should respond to PhoneGap resume event", function() {
						expect(LaunchController.prototype.onPause).toHaveBeenCalled();
					});

				});

				describe("active handler", function() {

					beforeEach(function() {
						gapEvent.initEvent("active", true, false);
						launch = new LaunchController();
						document.dispatchEvent(gapEvent);
					});

					it("should exist", function() {
						expect(LaunchController.prototype.onActive).toBeDefined();
					});

					it("should not respond to PhoneGap active event", function() {
						expect(LaunchController.prototype.onActive).not.toHaveBeenCalled();
					});

					it("should not publish device:active to mediator", function() {
						expect(launch.onActive()).toBe(false);
						expect(mediator.publish).not.toHaveBeenCalledWith("device:active", undefined);
					});
				});

				describe("resign handler", function() {

					beforeEach(function() {
						gapEvent.initEvent("resign", true, false);
						launch = new LaunchController();
						document.dispatchEvent(gapEvent);
					});

					it("should exist", function() {
						expect(LaunchController.prototype.onResign).toBeDefined();
					});

					it("should not respond to PhoneGap resign event", function() {
						expect(LaunchController.prototype.onResign).not.toHaveBeenCalled();
					});

					it("should not publish device:resign to mediator", function() {
						expect(launch.onResign()).toBe(false);
						expect(mediator.publish).not.toHaveBeenCalledWith("device:resign", undefined);
					});
				});
			});

			describe("events under iOS", function() {

				beforeEach(function() {
					app.isIos = true;
				});

				describe("resume handler", function() {

					beforeEach(function() {
						gapEvent.initEvent("resume", true, false);
						launch = new LaunchController();
						document.dispatchEvent(gapEvent);
					});

					it("should exist", function() {
						expect(LaunchController.prototype.onResume).toBeDefined();
					});

					it("should respond to PhoneGap resume event", function() {
						expect(LaunchController.prototype.onResume).toHaveBeenCalled();
					});

					it("should publish device:resume to mediator", function() {
						expect(launch.onResume()).toBe(true);
						expect(mediator.publish).toHaveBeenCalledWith("device:resume", undefined);
					});
				});
				describe("pause handler", function() {

					beforeEach(function() {
						gapEvent.initEvent("pause", true, false);
						launch = new LaunchController();
						document.dispatchEvent(gapEvent);
					});

					it("should exist", function() {
						expect(LaunchController.prototype.onPause).toBeDefined();
					});

					it("should respond to PhoneGap pause event", function() {
						expect(LaunchController.prototype.onPause).toHaveBeenCalled();
					});

				});

				describe("active handler", function() {

					beforeEach(function() {
						gapEvent.initEvent("active", true, false);
						launch = new LaunchController();
						document.dispatchEvent(gapEvent);
					});

					it("should exist", function() {
						expect(LaunchController.prototype.onActive).toBeDefined();
					});

					it("should respond to PhoneGap active event", function() {
						expect(LaunchController.prototype.onActive).toHaveBeenCalled();
					});

				});

				describe("resign handler", function() {

					beforeEach(function() {
						gapEvent.initEvent("resign", true, false);
						launch = new LaunchController();
						document.dispatchEvent(gapEvent);
					});

					it("should exist", function() {
						expect(LaunchController.prototype.onResign).toBeDefined();
					});

					it("should respond to PhoneGap resign event", function() {
						expect(LaunchController.prototype.onResign).toHaveBeenCalled();
					});

				});
			});
		});
	});
});