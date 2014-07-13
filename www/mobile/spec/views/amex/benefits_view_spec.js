define([
	'views/amex/benefits_view', 'helpers/device', 'jquery'],
function(
	BenefitsView, Device, $){

	describe('Benefits View', function() {

		it('should initialize', function() {
			var benefitsView = new BenefitsView({ tripId: 1 });

			expect(benefitsView.template).toBeDefined();
		});

		describe('initialize', function() {
			it('should set the className', function() {
				var benefitsView = new BenefitsView({ tripId: 1 });

				expect(benefitsView.className).toBe('amex-benefits');
			});

			it('should set the template', function() {
				var benefitsView = new BenefitsView({ tripId: 1 });

				expect(benefitsView.template).toBeDefined();
			});

			it('should set the path', function() {
				var benefitsView = new BenefitsView({ tripId: 1 });

				expect(benefitsView.path).toContain('/web2/trips/1/amex_benefits');
			});

			it('should setupListeners', function() {
				spyOn(BenefitsView.prototype, 'setupListeners');
				var benefitsView = new BenefitsView({ tripId: 1 });
				expect(BenefitsView.prototype.setupListeners).toHaveBeenCalled();
			});
		});

		describe('path', function() {
			var benefitsView;

			beforeEach(function() {
				benefitsView = new BenefitsView({ tripId: 1 });
			});

			it('should use the tripId', function() {
				var path = benefitsView.getPath();

				expect(path).toContain('/web2/trips/1/amex_benefits');
			});

			it('should append #wrapped when the app is wrapped', function() {
				spyOn(Device, 'isWrapped').andReturn(true);
				var path = benefitsView.getPath();

				expect(path).toContain('#wrapped');
			});

			it('should not add #wrapped', function() {
				spyOn(Device, 'isWrapped').andReturn(false);
				var path = benefitsView.getPath();

				expect(path).not.toContain('#wrapped');
			});
		});

		describe('setupListeners', function() {
			var benefitsView;

			it('should listen to the "message" event when wrapped', function() {
				spyOn(Device, 'isWrapped').andReturn(true);
				spyOn(BenefitsView.prototype, 'handleLinks');
				benefitsView = new BenefitsView({ tripId: 1 });

				$(window).trigger('message');

				expect(BenefitsView.prototype.handleLinks).toHaveBeenCalled();
			});

			it('should not listen to the "message" event', function() {
				spyOn(Device, 'isWrapped').andReturn(false);
				spyOn(BenefitsView.prototype, 'handleLinks');
				benefitsView = new BenefitsView({ tripId: 1 });

				$(window).trigger('message');

				expect(BenefitsView.prototype.handleLinks).not.toHaveBeenCalled();
			});
		});

		describe('cleanup', function() {
			it('should be defined', function() {
				var benefitsView = new BenefitsView({ tripId: 1 });

				expect(benefitsView.cleanup).toBeDefined();
			});

			it('should remove event listeners', function() {
				spyOn(BenefitsView.prototype, 'handleLinks');
				var benefitsView = new BenefitsView({ tripId: 1 });

				benefitsView.cleanup();
				$(window).trigger('message');

				expect(BenefitsView.prototype.handleLinks).not.toHaveBeenCalled();
			});
		});

		describe('handleLinks', function() {
			it('call externalURLViewer.open with the url', function() {
				var benefitsView = new BenefitsView({ tripId: 1 });
				var fakeEvent = { originalEvent: { data: 'myURL' }};
				spyOn(benefitsView.externalURLViewer, 'open');

				benefitsView.handleLinks(fakeEvent);

				expect(benefitsView.externalURLViewer.open).toHaveBeenCalledWith('myURL');
			});
		});

	});
});