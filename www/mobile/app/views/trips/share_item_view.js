define([
	'jquery', 'underscore', 'mediator', 'backbone', 'strings'
], function($, _, mediator, Backbone, t) {
	var ShareItemView = Backbone.View.extend({
		template: 'trips/share_item'
	});

	return ShareItemView;
});