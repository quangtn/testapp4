define([
	'collections/contacts',
	'proxies/contacts_proxy'],
function(
	ContactsCollection,
	ContactsProxy){

	describe('Contacts Proxy', function() {
		var proxy, contacts = new ContactsCollection();

		beforeEach(function() {
			proxy = new ContactsProxy({}, {collection: contacts});
		});

		it('should initialize', function() {
			expect(proxy).toBeDefined();
		});
		it('should setup sync', function() {
			proxy.syncConfig();
			expect(proxy.url).toBe('/mapi/contacts.json');
		});
	});
});