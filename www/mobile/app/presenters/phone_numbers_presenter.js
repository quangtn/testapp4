define(['underscore', 'helpers', 'presenters/presenter',
	'strings'],
	function(_, helpers, Presenter, t) {

		var PhoneNumbersPresenter = Presenter.extend({

			initialize: function() {

			},

			//== Public
			getTripItems: function(trip_items) {
				var self = this;

				trip_items = _.map( trip_items, function(item){ return self._getTripItem(item); } );
				return { trip_items: trip_items };
			},

			getPhoneNumbers: function(trip_item){

				return {
					title: this._getItemTitle(trip_item),
					phone_numbers: this._getPhoneNumbers(trip_item)
				};
			},


			//== Private
			_getTripItem: function(item) {
				var self = this;

				return {
					item_title: self._getItemTitle(item),			// (string) Trip Item Title
					caption: self._getCaption(item),				// (string) Trip Item Caption
					icon: self._getIcon(item),						// (string) Trip Item Type
					phone: self._getPhoneNumbers(item)[0],			// (object) Trip Item First Phone Number
					id: item.id									// (int) Trip Item model ID
				};
			},

			_getItemTitle: function(item){
				// TODO@TRI: consistent trip item type naming?
				var item_title;

				switch ( item.get('named_type').toLowerCase() ) {
					case 'air':
						item_title = item.get('airline_code') + ' ';
						item_title += item.get('flight_number') + ' ' + t.From + ' ';
						item_title += item.startLocation.get('airport_code');
						break;

					case 'vehicle':
					case 'hotel':
					case 'generic':
						item_title = item.get('name');
						break;

					default:
						item_title = 'item_title - unknown item - type: ' + item.get('named_type');
				}

				return item_title;
			},

			_getCaption: function(item){
				// TODO@TRI: consistent trip item type naming?
				var caption;

				switch( item.get('named_type').toLowerCase() ){

					case 'air':
					case 'rail':
					case 'cruise':
					case 'ferry':
						caption = t.Departs + ' ' + helpers.dateHelpers.itinTimeAmPm(item.get('scheduled_departure')) + ' ' + t.On +' ';
						caption += this._getDate(item);
						break;

					case 'hotel':
						caption = t.PhoneCheckInHotel + ' ' + this._getDate(item);
						break;

					case 'vehicle':
						caption = t.PickUpAt + ' ' + helpers.dateHelpers.itinTimeAmPm(item.get('start_time')) + ' ' + t.On + ' ';
						caption += this._getDate(item);
						break;

					case 'generic':
						caption = t.StartsAt + ' ' + helpers.dateHelpers.itinTimeAmPm(item.get('start_time')) + ' ' + t.On + ' ';
						caption += this._getDate(item);
						break;

					default:
						caption = 'caption - unknown item - type: ' + item.get('named_type');
				}

				return caption;
			},

			_getIcon: function(item){
				var icon = item.get('type').toLowerCase();

				switch ( icon ) {
					case 'air':
						icon = 'icon_airplane_45px';
						break;

					case 'activity':
					case 'attraction':
						icon = 'icon_activity_45px';
						break;

					case 'cruise':
						icon = 'icon_cruise_45px';
						break;

					case 'ferry':
						icon = 'icon_ferry_45px';
						break;

					case 'food_drink':
						icon = 'icon_food_45px';
						break;

					case 'ground_transportation':
						icon = 'icon_ground_transportation_45px';
						break;

					case 'hotel':
						icon = 'icon_hotel_45px';
						break;

					case 'meeting':
						icon = 'icon_meeting_45px';
						break;

					case 'rail':
						icon = 'icon_rail_45px';
						break;

					case 'vehicle':
						icon = 'icon_car_45px';
						break;

					default:
						icon = 'icon_some_other_45px';
				}

				return icon;
			},

			_getDate: function(item){
				return helpers.dateHelpers.dateMonth(item.get('start_date'));
			},

			_getPhoneNumbers: function(item){
				return item.phoneNumbers.toJSON();
			}


		});

		return PhoneNumbersPresenter;
	});
