define([
	'jquery', 'underscore', 'collections/collection', 'models/country',
	'proxies/country_list_proxy'
],
function($, _, Collection, Country, CountryListProxy) {

	var CountryList = Collection.extend({

		model: Country,

		initialize: function(models, options) {
			options = options || {};
			this.searchTerm = options.search_term;
			this.proxy = new CountryListProxy({}, {collection: this});
		}

	});

	return CountryList;

});
