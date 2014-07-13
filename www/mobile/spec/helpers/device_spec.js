define(['helpers/device'],
function(Device) {

	describe('Device', function() {

		it('should exist', function() {
			expect(Device).toBeTruthy();
		});

		describe('when PhoneGap wrapped', function() {

			beforeEach(function () {
				window.cordova = true;
				window.device = {};
				window.device.platform = 'iPhone';
				window.device.uuid = '1234';
				window.device.version = '6.1';
			});

			afterEach(function () {
				delete window.cordova;
				delete window.device;
			});

			it('should return true for isWrapped()', function() {
				expect(Device.isWrapped()).toEqual(true);
			});

			it('should return false for isWebApp()', function() {
				expect(Device.isWebApp()).toEqual(false);
			});

			it('should return device platform', function() {
				expect(Device.getDevicePlatform()).toEqual('iPhone');
			});

			it('should return device hardware id', function() {
				expect(Device.getDeviceHardwareId()).toEqual('1234');
			});

			it('should return device version', function() {
				expect(Device.getOperatingSystemVersion()).toEqual('6.1');
			});

			it('should return device type', function() {
				var platforms = {
					Android: {
						deviceType: '3'
					},
					iPhone: {
						deviceType: '1'
					}
				};
				expect(Device.getDeviceType(platforms)).toEqual('1');
			});


			it('should return locale from userLange`', function() {
				window.navigator = {};
				window.navigator.userLanguage = 'en-US';
				expect(Device.getLocale()).toEqual('en-US');
				delete window.navigator;
			});

			it('should return locale from language if no userLanguage', function() {
				window.navigator = {};
				window.navigator.userLanguage = null;
				window.navigator.language = 'es-US';
				expect(Device.getLocale()).toEqual('es-US');
				delete window.navigator;
			});

			it('should return screen size', function() {
				window.screen = {};
				window.screen.availWidth = '55';
				window.screen.availHeight = '65';
				expect(Device.getScreenSize()).toEqual('55x65');
				delete window.screen;
			});

		});

		describe('when in regular ole mobile web browser', function() {

			it('isWrapped() should be false', function() {
				expect(Device.isWrapped()).toEqual(false);
			});

			it('should return true for isWebApp()', function() {
				window.navigator = {};
				window.navigator.standalone = 'blah';
				expect(Device.isWebApp()).toEqual(true);
				delete window.navigator;
			});

			it('should return null for getDevicePlatform()', function() {
				expect(Device.getDevicePlatform()).toEqual(null);
			});

			it('should return null for getDeviceHardwareId()', function() {
				expect(Device.getDeviceHardwareId()).toEqual(null);
			});

			it('should return null for getOperatingSystemVersion()', function() {
				expect(Device.getOperatingSystemVersion()).toEqual(null);
			});

			it('should return null for getDeviceType()', function() {
				expect(Device.getDeviceType()).toEqual(null);
			});

			it('should return screen size', function() {
				window.screen = {};
				window.screen.availWidth = '58';
				window.screen.availHeight = '68';
				expect(Device.getScreenSize()).toEqual('58x68');
				delete window.screen;
			});

		});

		it('should return null when global screen size does not exist', function() {
			window.screen = null;
			expect(Device.getScreenSize()).toEqual(null);
			delete window.screen;
		});

		it('should return null when global navigator does not exist', function() {
			window.navigator = null;
			expect(Device.getLocale()).toEqual(null);
			delete window.navigator;
		});

	});

});
