define([
	'jquery', 'backbone', 'underscore', 'models/contact_collection'
],
	function($, Backbone, _, ContactCollection) {

		describe('Contact Collection Model', function() {
			var contacts;


			beforeEach(function() {
				contacts = new ContactCollection();

				contacts.add(new Backbone.Model({
					email: 'booga@asdf.com',
					first_name: 'Lance',
					last_name: 'Banion'}));

				contacts.add(new Backbone.Model({
					email: 'cindy@sabre.com',
					first_name: 'Cindy',
					last_name: 'Hogue'}));
			});


			afterEach(function() {
				contacts = null;
			});


			it('can .save with a proper PUT request', function() {
				spyOn($, 'ajax').andCallFake(function(options) {
					expect(options.dataType).toEqual('json');
					expect(options.type).toEqual('POST');
					expect(options.url).toMatch(/\/mapi\/contacts.json/);

					var data = JSON.parse(options.data);
					expect(data.contacts).toBeDefined();
					expect(_.isArray(data.contacts)).toEqual(true);
					expect(data.contacts[0].email).toEqual('booga@asdf.com');
					expect(data.contacts[0].first_name).toEqual('Lance');
					expect(data.contacts[0].last_name).toEqual('Banion');

					options.success(options.data);
				});

				contacts.save();
			});

		});
	});