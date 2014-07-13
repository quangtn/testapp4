define([
	'namespace', 'jquery', 'underscore', 'backbone', 'mediator', 'controllers/controller',
	'collections/trips', 'views/trips/confirm_trips_list_view',
	'layoutmanager'],
	function(app, $, _, Backbone, mediator, Controller,
		SummaryCollection, ConfirmTripsView) {

		// TODO: this should be a state of a "combine trip workflow" FSM
		// or should go in the TripsController
		var ConfirmListOfTripsController = Controller.extend({

			initialize: function() {
				this.collection = new SummaryCollection();
				this.view = new ConfirmTripsView({collection: this.collection});

				mediator.subscribe('confirm_list_of_trips:show', this.onShow, this);
			},

			onShow: function(tripsList) {
				this.collection.reset(tripsList);

				this._layout = app.getLayout('simple');
				this._layout.setViews({'.content': this.view});
				this._layout.render(function(el) {
					$('#app-page').html(el);
				});
			}

		});

		return ConfirmListOfTripsController;
});
