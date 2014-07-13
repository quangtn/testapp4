define(['namespace', 'jquery', 'underscore', 'backbone', 'mediator',
	'presenters/phone_numbers_presenter', 'layoutmanager'],
	function(app, $, _, Backbone, mediator, PhoneNumbersPresenter) {

		var PhoneNumbersView = {

			//==== TripItems View
			IndexView : Backbone.View.extend({

				className: 'trip-component trip-item-detail phone-numbers-index',
				template: 'phone_numbers/index',

				events : {
					'click .list-item.actionable' : 'viewMoreNumbers',
					'click .action-call' : 'call'
				},

				initialize: function(){
					this.presenter = new PhoneNumbersPresenter();
				},

				serialize: function(){
					var trip_items = this.model.tripItems.filter(function(trip_item){
						return trip_item.phoneNumbers.length;	// filters down to trip_items with numbers only
					});

					return this.presenter.getTripItems(trip_items);
				},

				render: function(layout){
					var view = layout(this);
					return view.render();
				},

				// == event handlers
				viewMoreNumbers: function(event){
					var trip_item_id = $(event.currentTarget).data('id');
					mediator.publish('phone_numbers:showPhoneNumbers', this.model.tripItems.get(trip_item_id));
				},

				call: function(event){
					event.stopPropagation(); // preventing viewMoreNumbers to be called
				}

			}),


			//==== PhoneNumbers View
			PhoneNumberListView: Backbone.View.extend({
				className: 'trip-component trip-item-detail',
				template: 'phone_numbers/phone_number_list',

				initialize: function(){
					this.presenter =  new PhoneNumbersPresenter();
				},

				serialize: function(){
					return this.presenter.getPhoneNumbers(this.model);
				},

				render: function(layout){
					var view = layout(this);
					return view.render();
				}

			})
		};

		return PhoneNumbersView;
	}
);
