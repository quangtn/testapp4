define([
	'jquery', 'models/contact',
	'text!fixtures/mock_contact_detail_response.json'
],
	function($, Contact, MockContactResponseString) {

		describe('Contact Model', function() {
			var contact;


			beforeEach(function() {
				contact = new Contact({
					id: 2,
					email: 'jackie@chan.net'
				});
			});


			afterEach(function() {
				contact = null;
			});


			it('should initialize and extend contact parse', function() {
				expect(contact).toBeDefined();
				expect(contact.parse).toBeDefined();
				expect(contact._parseContact).toBeDefined();
			});


			it('can .fetch with a proper GET URL', function() {
				var mockContactResponse = JSON.parse(MockContactResponseString);

				spyOn($, 'ajax').andCallFake(function(options) {
					expect(options.dataType).toEqual('json');
					expect(options.type).toEqual('GET');
					expect(options.url).toMatch(/\/mapi\/contacts\/2.json/);

					options.success(mockContactResponse);
				});

				contact = new Contact({id: 2});
				contact.fetch();
			});


			it('can parse typical service response after .fetch and store', function() {
				var mockContactResponse = JSON.parse(MockContactResponseString);

				spyOn($, 'ajax').andCallFake(function(options) {
					options.success(mockContactResponse);
				});

				contact = new Contact({id: 2});
				contact.fetch({success: function() {
					expect(contact.get('id') === 2);
					expect(contact.get('first_name') === 'Anna');
					expect(contact.get('last_name') === 'Tabor');
					expect(contact.get('email') === 'Anna@blarg.asdf');
					expect(contact.get('is_user') === false);
				}});
			});
		});
	});