define(['namespace', 'jquery', 'underscore', 'backbone', 'mediator', 'controllers/controller',
	'views/phone_numbers/phone_numbers_view', 'trips_manager', 'strings',
	'layoutmanager'],
	function(app, $, _, Backbone, mediator, Controller, PhoneNumbersView, TripsManager, t) {

		var PhoneNumberController = Controller.extend({
			initialize: function() {
				this._layout = app.getLayout('simple');
				mediator.subscribe('phone_numbers:showIndex', this.onShowIndex, this);
				mediator.subscribe('phone_numbers:showPhoneNumbers', this.onShowPhoneNumbers, this);
			},

			// Shows a list of trips items with phone numbers
			onShowIndex: function() {
				this.setPhoneNumberIndexView();
				this.changeURL('trips/' + TripsManager.getCurrentTripId() + '/trip_items/phone_numbers');
				this._updateHeader(t.PhoneNumbers, 'back:history');
			},

			// Showing a list of phone number for a trip item
			onShowPhoneNumbers: function(params) {
				var self = this;
				if ((!(params instanceof Backbone.Model))&&params.itemId) {
					TripsManager.getTripItems(params.tripId, function(tripItems) {
						self.changeURL('trips/' + params.tripId + '/trip_items/phone_numbers/' + params.itemId);
						self.tripItemModel = tripItems.get(params.itemId);
						self.setPhoneNumberDetailView();
					});
				} else {
					this.tripItemModel = params;
					var suffix = this.tripItemModel.get('id') ||
						this.tripItemModel.index || this.tripItemModel.get(
							'airline_code');
					this.changeURL('trips/' + TripsManager.getCurrentTripId() +
						'/trip_items/phone_numbers/' + suffix);

					this.setPhoneNumberDetailView();
				}
				this._updateHeader(t.PhoneNumbers, 'back:history');
			},

			setPhoneNumberDetailView: function() {
				if (!this.phoneNumberDetailView) {
					this.phoneNumberDetailView = new PhoneNumbersView.PhoneNumberListView({ model:this.tripItemModel });
				} else {
					this.phoneNumberDetailView.model = this.tripItemModel;
				}

				this.setView(this.phoneNumberDetailView);
			},

			setPhoneNumberIndexView: function() {
				if (!this.phoneNumberIndexView) {
					this.phoneNumberIndexView = new PhoneNumbersView.IndexView({
						model: TripsManager.getCurrentTrip() });
				} else {
					this.phoneNumberIndexView.model = TripsManager.getCurrentTrip();
				}

				this.setView(this.phoneNumberIndexView);
			}

		});

		return PhoneNumberController;
	}
);
