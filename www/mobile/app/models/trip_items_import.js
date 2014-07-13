define(['jquery', 'underscore', 'backbone', 'namespace', 'strings',
	'models/model', 'proxies/trip_items_import_proxy', 'trips_manager'],
	function($, _, Backbone, app, t, Model, TripItemsImportProxy, TripsManager) {
		var ImportModel = Model.extend({
			initialize: function(attrs, options) {
				this.proxy = new TripItemsImportProxy({}, {model: this});
			},

			clearErrors: function() {
				this.unset('error', {silent: true});
			},

			sanitizePNR: function(pnr) {
				if (pnr.search(/\s+/g)) {
					pnr = pnr.replace(/\s+/g, '');
					this.set({record_locator: pnr}, {silent: true});
				}
				return pnr;
			},

			parse: function(response) {
				var attrs = {};

				var newTrip = this.trip.parse(response);
				if (newTrip.error === undefined) {
					this.trip = this.trip.set(newTrip);
				} else {
					attrs = _.extend(this.toJSON(), newTrip);
				}

				return attrs;
			},

			validate: function(attrs) {
				var error = [];
				var spacesOnly = /^[ ]*$/;
				var recordLocatorFormat = /^([A-Za-z]{6})(@![a-z])?$/;
				var tripIdFormat = /^([0-9]{12})$/;
				if (attrs.record_locator !== undefined) {
					var pnr = this.sanitizePNR(attrs.record_locator);
					if (attrs.record_locator.length <= 0) {
						error.push({
							fieldName: 'tripid',
							message: t.ErrorPNRBlank
						});
					} else if (!recordLocatorFormat.test(pnr) && !tripIdFormat.test(pnr)) {
						error.push({
							fieldName: 'tripid',
							message: t.ErrorPNRFormat
						});
					} else if (spacesOnly.test(pnr)) {
						error.push({
							fieldName: 'tripid',
							message: t.ErrorPNRInvalid
						});
					}
				}

				if (attrs.last_name !== undefined) {
					if (attrs.last_name.length <= 0) {
						error.push({
							fieldName: 'lastname',
							message: t.ErrorLastNameBlank
						});
					} else if (spacesOnly.test(attrs.last_name)) {
						error.push({
							fieldName: 'lastname',
							message: t.ErrorLastNameInvalid
						});
					}
				}

				if (attrs.tripId !== undefined) {
					this.trip = TripsManager.getTrips().get(attrs.tripId);
				}

				return _.any(error) ? error : null;
			}

	});

	return ImportModel;
});