define(['jquery', 'underscore', 'backbone', 'layoutmanager'],
	function($, _, Backbone) {
		var main = Backbone.View.extend({
			template: "trip_items/car/car_detail",

			initialize: function() {
				this.model.on("change", function() {
					this.render();
				}, this);
			},

			serialize: function() {
				return this.model.toJSON();
			}
		});

		return { Main: main };
	}
);