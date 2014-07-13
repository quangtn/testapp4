define([
	'underscore',
	'presenters/contacts_presenter',
	'collections/contacts',
	'text!fixtures/mock_contacts_response.json'],
function(
	_,
	ContactsPresenter,
	ContactsCollection,
	MockContactsResponse){

	describe('Contacts Presenter', function() {
		var contactsResponse = JSON.parse(MockContactsResponse),
			contacts = new ContactsCollection(contactsResponse),
			presenter = new ContactsPresenter(contacts);

		it('should initialize', function() {
			expect(presenter.contacts.length).toBeGreaterThan(0);
		});

		describe('template context', function(){
			var contactsContext = presenter.getContacts();

			function getContactContext(id) {
				var contact = _.find(contactsContext, function(contact) {
					return contact.id === id;
				});

				return contact;
			}

			it('should handle: first name, last name, & email', function() {
				var context = getContactContext(0);

				expect(context.id).toBe(0);
				expect(context.mainLabel).toBe('Tri Noensie');
				expect(context.subLabel).toBe('tri@noensie.com');
			});
			it('should handle: first name & email', function() {
				var context = getContactContext(1);

				expect(context.id).toBe(1);
				expect(context.mainLabel).toBe('Tyler');
				expect(context.subLabel).toBe('tyler@perry.org');
			});
			it('should handle: last name & email', function() {
				var context = getContactContext(2);

				expect(context.id).toBe(2);
				expect(context.mainLabel).toBe('Jobs');
				expect(context.subLabel).toBe('steve@apple.com');
			});
			it('should handle: email', function() {
				var context = getContactContext(3);

				expect(context.id).toBe(3);
				expect(context.mainLabel).toBe('gates@microsoft.com');
				expect(context.subLabel).not.toBeDefined();
			});
		});
	});
});