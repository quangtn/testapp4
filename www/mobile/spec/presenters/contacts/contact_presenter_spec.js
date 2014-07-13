define([
	'underscore',
	'models/contact',
	'presenters/contact_presenter',
	'text!fixtures/mock_contacts_response.json'],
function(
	_,
	Contact,
	ContactPresenter,
	MockContactsResponse) {

	describe('Contact Presenter', function() {
		var contactsResponse = JSON.parse(MockContactsResponse);

		describe('contact template context', function() {
			function getContactContext(id) {
				var contactInfo =  _.find(contactsResponse, function(contact) {
						return contact.id === id;
					}),
					contact = new Contact(contactInfo),
					context = new ContactPresenter(contact);

				return context.getContact();
			}

			it('should handle: first name, last name, & email', function() {
				var context = getContactContext(0);

				expect(context.id).toBe(0);
				expect(context.first_name).toBe('tri');
				expect(context.last_name).toBe('noensie');
				expect(context.fullName).toBe('Tri Noensie');
				expect(context.email).toBe('tri@noensie.com');
			});
			it('should handle: first name & email', function() {
				var context = getContactContext(1);

				expect(context.id).toBe(1);
				expect(context.first_name).toBe('tyler');
				expect(context.fullName).toBe('Tyler');
				expect(context.email).toBe('tyler@perry.org');
			});
			it('should handle: last name & email', function() {
				var context = getContactContext(2);

				expect(context.id).toBe(2);
				expect(context.last_name).toBe('jobs');
				expect(context.fullName).toBe('Jobs');
				expect(context.email).toBe('steve@apple.com');
			});
			it('should handle: email', function() {
				var context = getContactContext(3);

				expect(context.id).toBe(3);
				expect(context.fullName).toBe('');
				expect(context.email).toBe('gates@microsoft.com');
			});
		});
	});
});