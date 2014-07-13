define([
	'models/contact',
	'proxies/contact_proxy'],
function(
	Contact,
	ContactProxy) {

	describe('Contact Proxy', function() {
		var contact, proxy, contactId = 5;

		beforeEach(function() {
			contact = new Contact({id: contactId});
			proxy = new ContactProxy({}, {model: contact});
		});

		it('should initialize', function() {
			expect(proxy).toBeDefined();
		});
		it('should setup proxy config', function() {
			proxy.syncConfig();
			expect(proxy.url).toBe('/mapi/contacts/' + contactId + '.json');
		});
	});
});