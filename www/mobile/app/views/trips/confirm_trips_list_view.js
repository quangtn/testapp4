define(['jquery', 'underscore', 'backbone', 'mediator',
	'layoutmanager'],
	function($, _, Backbone, mediator) {

		var ConfirmTripItemView = Backbone.View.extend({
			className: 'trip-group confirm-trip',
			template: 'trips/confirm_trip',
			tagName: 'li',

			initialize: function() {
				this.model.on('change', function() {
					this.render();
				}, this);
			},

			cleanup: function() {
				this.off();
			},

			serialize: function() {
				var dataContext = this.model.toJSON();
				return dataContext;
			}


		});


		var ConfirmTripListView = Backbone.View.extend({
			events: {
				'submit #confirm-trips-form': 'onSubmit'
			},

			template: 'trips/confirm_delete_trips_list',

			triggerMessage: 'confirm_list_of_trips:submit',

			initialize: function() {
				this.collection.on("change", function() {
					this.render();
				}, this);
			},

			render: function(layout) {
				var view = layout(this);

				this.collection.each(function(model) {
					view.insert(".list-panel", new ConfirmTripItemView({
						model: model
					}));
				});

				return view.render();
			},

			onSubmit: function(event) {
				event.preventDefault();
				mediator.publish(this.triggerMessage);
			}
		});

		return ConfirmTripListView;
	}
);
