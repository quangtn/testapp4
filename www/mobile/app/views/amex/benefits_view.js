define([
	'config', 'helpers/device', 'jquery', 'underscore', 'backbone',
	'mediator', 'analytics', 'strings', 'trips_manager', 'modules/external_url_viewer'
],
function(config, Device, $, _, Backbone, mediator, Analytics, t, TripsManager, ExternalURLViewer) {

	var BenefitsView = Backbone.View.extend({

		template: 'amex/benefits',

		className: 'amex-benefits',

		initialize: function(params) {
			_.bindAll(this, 'handleLinks');
			this.tripId = params.tripId || TripsManager.getCurrentTripId();
			// this.path = 'http://local.tripcase.com:3000/web2/trips/2/amex_benefits';
			this.path = this.getPath();
			this.setupListeners();
			this.externalURLViewer = new ExternalURLViewer();
		},

		getPath: function() {
			var path;
			path = config.apiURL + '/web2/trips/' + this.tripId + '/amex_benefits';
			if (Device.isWrapped()) {
				path = path + '#wrapped';
			}
			return path;
		},

		setupListeners: function() {
			if (Device.isWrapped()) {
				$(window).on('message', this.handleLinks);
			}
		},

		handleLinks: function(event) {
			if (event.preventDefault) {
				event.preventDefault();
			}

			if (event.stopPropagation) {
				event.stopPropagation();
			}

			this.externalURLViewer.open(event.originalEvent.data);

			return false;
		},

		serialize: function() {
			return { src: this.path };
		},

		cleanup: function() {
			$(window).off('message', this.handleLinks);
		}

	});

	return BenefitsView;

});
