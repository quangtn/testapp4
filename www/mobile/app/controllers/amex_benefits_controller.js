define([
	'namespace', 'jquery', 'underscore', 'backbone', 'mediator', 'controllers/controller', 'views/amex/benefits_view',
	'trips_manager', 'analytics', 'strings', 'layoutmanager'],
	function (app, $, _, Backbone, mediator, Controller, BenefitsView,
	TripsManager, Analytics, t) {
		var AmexBenefitsController = Controller.extend({

			initialize: function () {
				_.bindAll(this);
				this._initSubscriptions();
			},

			_initSubscriptions: function() {
				mediator.subscribe('amex_benefits:index', this.onBenefits, this);
				mediator.subscribe('amex_benefits:refresh', this.onRefresh, this);
			},

			onRefresh: function() {
				var self = this;
				this._layout.render(function(el) {
					$('#app-page').html(el);
				}).then(function() {
					self.view.trigger('afterrender');
				});
				Analytics.trackEvent('Amex','BenefitsRefresh', app);
			},

			onBenefits: function(params) {
				var tripId = TripsManager.getCurrentTripId() || params.tripId;
				this._layout = app.getLayout('simple');
				this.view = new BenefitsView({tripId: tripId});
				this.setView(this.view);
				this.changeURL('trips/' + tripId + '/amex');
				mediator.publish('header:updateHeader', {
					backAction: 'back:history',
					title: t.Benefits,
					rightButtons: [{
						name: 'benefits-refresh',
						iconURL: 'button-icon btn_icon_refresh_25px',
						action: 'amex_benefits:refresh'
					}]
				});
				Analytics.trackEvent('Amex','Benefits', app);
			}
		});
		return AmexBenefitsController;
	});

