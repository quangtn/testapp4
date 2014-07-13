define([
	'namespace', 'jquery', 'underscore', 'backbone', './car_detail_views',
	'layoutmanager'
], function(app, $, _, Backbone, Views) {
		return (function() {
			var CarDetail = app.module();
			CarDetail.Model = new Backbone.Model(); // pass in
			CarDetail.Views.Main = new Views.Main({
				model : CarDetail.Model
			});

			return CarDetail;
		});
	}
);
