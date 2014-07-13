require([
	'backbone',
	'text!fixtures/mock_trip_response.json',
	'parsers/trip_parser',
	'presenters/trip_item/trip_item_air_presenter',
	'moment',
	'underscore'
], function(
	Backbone,
	mockTripResponseString,
	TripParser,
	AirTripItemPresenter,
	moment,
	_
) {

	describe('AirTripItemPresenter', function() {

		it('should handle the truth', function() {
			expect(true).toBeTruthy();
		});

		it('should exist', function() {
			expect(AirTripItemPresenter).toBeTruthy();
		});

		describe('air status', function() {

			var model, presenter;

			beforeEach(function() {
				var tripModel = new Backbone.Model();
				var mockTripResponse = JSON.parse(mockTripResponseString);
				_.extend(tripModel, TripParser);

				tripModel.parse(mockTripResponse);
				model = tripModel.tripItems.at(0);
				spyOn(model, 'isWorldMate');
			});

			describe('air status message', function() {

				it('returns empty string given invalid params', function() {
					spyOn(model, 'isDeparted').andReturn(true);
					spyOn(model, 'getScheduledArrival').andReturn(undefined);
					spyOn(model, 'getEstimatedArrival').andReturn(undefined);
					presenter = new AirTripItemPresenter({ model: model });
					expect(presenter.airStatusMessage).toBeFalsy();
					expect(presenter.airStatusClass).toEqual('on-time');
				});

				it('returns empty string given invalid params', function() {
					spyOn(model, 'isDeparted').andReturn(true);
					spyOn(model, 'getScheduledArrival').andReturn('1985-10-26T06:00:00');
					spyOn(model, 'getEstimatedArrival').andReturn(undefined);
					presenter = new AirTripItemPresenter({ model: model });
					expect(presenter.airStatusMessage).toBeFalsy();
					expect(presenter.airStatusClass).toEqual('on-time');
				});

				it('returns empty string when no difference in times', function() {
					spyOn(model, 'isDeparted').andReturn(true);
					spyOn(model, 'getScheduledArrival').andReturn('1985-10-26T06:00:00');
					spyOn(model, 'getEstimatedArrival').andReturn('1985-10-26T06:00:00');
					presenter = new AirTripItemPresenter({ model: model });
					expect(presenter.airStatusMessage).toBeFalsy();
					expect(presenter.airStatusClass).toEqual('on-time');
				});

				it('→ delayed 1 min', function() {
					spyOn(model, 'isDeparted').andReturn(true);
					spyOn(model, 'getScheduledArrival').andReturn('1985-10-26T06:00:00');
					spyOn(model, 'getEstimatedArrival').andReturn('1985-10-26T06:01:00');
					presenter = new AirTripItemPresenter({ model: model });
					expect(presenter.airStatusClass).toEqual('delayed');
					expect(presenter.airStatusMessage).toEqual('delayed 1 min');
				});

				it('→ early 1 min', function() {
					spyOn(model, 'isDeparted').andReturn(true);
					spyOn(model, 'getScheduledArrival').andReturn('1985-10-26T06:00:00');
					spyOn(model, 'getEstimatedArrival').andReturn('1985-10-26T05:59:00');
					presenter = new AirTripItemPresenter({ model: model });
					expect(presenter.airStatusClass).toEqual('early');
					expect(presenter.airStatusMessage).toEqual('early 1 min');
				});

				it('→ delayed 60 mins', function() {
					spyOn(model, 'isDeparted').andReturn(true);
					spyOn(model, 'getScheduledArrival').andReturn('1985-10-26T06:00:00');
					spyOn(model, 'getEstimatedArrival').andReturn('1985-10-26T07:00:00');
					presenter = new AirTripItemPresenter({ model: model });
					expect(presenter.airStatusClass).toEqual('delayed');
					expect(presenter.airStatusMessage).toEqual('delayed 1 hr');
				});

				it('→ early 60 mins', function() {
					spyOn(model, 'isDeparted').andReturn(true);
					spyOn(model, 'getScheduledArrival').andReturn('1985-10-26T06:00:00');
					spyOn(model, 'getEstimatedArrival').andReturn('1985-10-26T05:00:00');
					presenter = new AirTripItemPresenter({ model: model });
					expect(presenter.airStatusClass).toEqual('early');
					expect(presenter.airStatusMessage).toEqual('early 1 hr');
				});

				it('→ delayed 1 hr 30 mins', function() {
					spyOn(model, 'isDeparted').andReturn(true);
					spyOn(model, 'getScheduledArrival').andReturn('1985-10-26T06:00:00');
					spyOn(model, 'getEstimatedArrival').andReturn('1985-10-26T07:30:00');
					presenter = new AirTripItemPresenter({ model: model });
					expect(presenter.airStatusClass).toEqual('delayed');
					expect(presenter.airStatusMessage).toEqual('delayed 1 hr 30 mins');
				});

				it('→ early 1 hr 30 mins', function() {
					spyOn(model, 'isDeparted').andReturn(true);
					spyOn(model, 'getScheduledArrival').andReturn('1985-10-26T06:00:00');
					spyOn(model, 'getEstimatedArrival').andReturn('1985-10-26T04:30:00');
					presenter = new AirTripItemPresenter({ model: model });
					expect(presenter.airStatusClass).toEqual('early');
					expect(presenter.airStatusMessage).toEqual('early 1 hr 30 mins');
				});

				it('→ delayed 2 hrs 30 mins', function() {
					spyOn(model, 'isDeparted').andReturn(true);
					spyOn(model, 'getScheduledArrival').andReturn('1985-10-26T06:00:00');
					spyOn(model, 'getEstimatedArrival').andReturn('1985-10-26T08:30:00');
					presenter = new AirTripItemPresenter({ model: model });
					expect(presenter.airStatusClass).toEqual('delayed');
					expect(presenter.airStatusMessage).toEqual('delayed 2 hrs 30 mins');
				});

				it('→ early 2 hrs 30 mins', function() {
					spyOn(model, 'isDeparted').andReturn(true);
					spyOn(model, 'getScheduledArrival').andReturn('1985-10-26T06:00:00');
					spyOn(model, 'getEstimatedArrival').andReturn('1985-10-26T03:30:00');
					presenter = new AirTripItemPresenter({ model: model });
					expect(presenter.airStatusClass).toEqual('early');
					expect(presenter.airStatusMessage).toEqual('early 2 hrs 30 mins');
				});

			});

		});

	});

});
