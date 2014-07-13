require([
	'views/trip_feed/carousel_header_view'
], function(CarouselHeaderView) {
	describe('Carousel Header View', function() {

		it('listens to the trip card view for updates', function() {
			var tripCardView = { on: function () {} };
			var mock = sinon.mock(tripCardView);

			mock.expects("on").once().withArgs('updateHeader');
			var carouselHeaderView = new CarouselHeaderView({ tripCardView: tripCardView });
			mock.verify();
		});

	});
});