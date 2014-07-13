define([
	'jquery', 'underscore', 'collections/collection', 'models/airline',
	'proxies/airline_list_proxy'
],
function(
	$, _, Collection, Airline, AirlineListProxy
) {

	var AirlineList = Collection.extend({

		model: Airline,

		initialize: function(models, options) {
			options = options || {};
			this.searchTerm = options.search_term;
			this.proxy = new AirlineListProxy({}, {collection: this});
		}

	});

	return AirlineList;

});
