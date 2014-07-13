define([
	'namespace', 'jquery', 'underscore', 'backbone', 'analytics', 'mediator',
	'controllers/controller', 'modules/external_url_viewer'
	],
	function(app, $, _, Backbone, Analytics, mediator, Controller, ExternalURLViewer) {

		var MessagesController = Controller.extend({
			initialize: function(params) {
				_.bindAll(this);
				this._initSubscriptions();
				this.externalURLViewer = new ExternalURLViewer();
				this.externalURLViewer.on('hide', function() {
					mediator.publish('messages:hide');
				});
			},

			_initSubscriptions: function() {
				mediator.subscribe('messages:seat_maps', this.onSeatMap, this);
				mediator.subscribe('messages:flight_schedules', this.onFlightSchedules, this);
				mediator.subscribe('messages:itin_sharing', this.onShareItinerary, this);
				mediator.subscribe('messages:alternate_flights', this.onAlternateFlights, this);
				mediator.subscribe('messages:weather', this.onWeather, this);
				mediator.subscribe('messages:amex_benefits', this.onBenefits, this);
				mediator.subscribe('messages:external_url', this.externalURL, this);
				mediator.subscribe('messages:external_url_in_browser', this.externalURLInBrowser, this);
				// TODO: Check that weather subscription name matches what server
					// returns in trip_message_view.js
			},

			onWeather: function() {
				mediator.publish('weather:show');
			},

			onShareItinerary: function() {
				mediator.publish('trips:share');
			},

			onSeatMap: function() {
				mediator.publish('seatmaps:list');
			},

			onBenefits: function() {
				mediator.publish('amex_benefits:index');
			},

			onFlightSchedules: function(params) {
				this.onAlternateFlights(params);
			},

			onAlternateFlights: function(params) {
				mediator.publish('altflights:show');
			},

			externalURL: function(params) {
				this.externalURLViewer.open(params.url);
			},

			externalURLInBrowser: function(params) {
				this.externalURLViewer.openInBrowser(params.url);
			}

		});

		return MessagesController;
});
