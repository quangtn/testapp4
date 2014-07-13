define([
	'underscore', 'mediator', 'namespace', 'views/imports/trip_items_import_view',
	'models/trip_items_import',	'controllers/controller', 'strings'
], function(_, mediator, app, ImportView, ImportModel, Controller, t) {

	var ImportsController = Controller.extend({
		initialize: function() {
			_.bindAll(this);
			this._layout = app.getLayout('simple');
			this.model = null;
			this._initSubscriptions();
		},

		_initSubscriptions: function() {
			mediator.subscribe('imports:add', this.add, this);
			mediator.subscribe('imports:edit', this.edit, this);
		},

		add: function(params) {
			this.model = new ImportModel({tripId: params.tripId});
			this.setView(new ImportView({model: this.model}));

			this.changeURL('trips/' + params.tripId + '/trip_items/import');

			this._updateHeader(t.ImportBooking, 'back:history');
		},

		edit: function() {
			var self = this;

			this.model.clearErrors();
			this.model.save(this.model, {
				cache_mode: this.model.proxy.CACHE_MODE_DEFER,
				success: function(model, response) {
					mediator.publish('trips:select', self.model.trip);
				}
			});
		}
	});

	return ImportsController;
});
