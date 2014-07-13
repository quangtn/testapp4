define(['mediator', 'backbone'], function(mediator, Backbone) {
	var ImportView = Backbone.View.extend({

		events: {
			'submit #import-trip-form': 'onSubmit'
		},

		template: 'trip_items/import/trip_import',

		initialize: function() {
			this.model.on('error', function(model, errors) {
				mediator.publish('error:trigger', 'form_validation', errors);
			}, this);
		},

		onSubmit: function(event) {
			event.preventDefault();

			var pnr = this.$el.find('#tripid').val().trim();
			var lastName = this.$el.find('#lastname').val();
			var modelResult = this.model.set({record_locator: pnr, last_name: lastName});
			if (modelResult !== false) {
				mediator.publish('imports:edit');
			}
		}

	});
	return ImportView;
});