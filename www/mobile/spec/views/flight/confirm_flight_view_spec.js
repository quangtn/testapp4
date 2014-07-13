define([
	'handlebars', 'backbone', 'mediator', 'views/flights/add/confirm_flight_view'
], function(
	Handlebars, Backbone, mediator, ConfirmFlightView
) {
	var pending = function() {
		expect('pending').toEqual('completed');
	};

	var confirmFlightView;

	beforeEach(function() {
		confirmFlightView = new ConfirmFlightView({
			model: new Backbone.Model({
				fake: 'data'
			})
		});
	});


	describe('confirm flight view', function() {
		it('should handle the truth', function() {
			expect(true).toBeTruthy();
		});

		it('should exist', function() {
			expect(confirmFlightView).toBeTruthy();
		});

		it('should provide the proper data to the template from the model', function() {
			spyOn(confirmFlightView.model, 'toJSON');
			confirmFlightView.serialize();

			expect(confirmFlightView.model.toJSON).toHaveBeenCalled();
		});

		it('should trigger the save event when save handler is called', function() {
			spyOn(mediator, 'publish');
			spyOn(confirmFlightView, 'trigger');
			confirmFlightView.save();

			expect(confirmFlightView.trigger).toHaveBeenCalledWith('save');
		});

	});
});

