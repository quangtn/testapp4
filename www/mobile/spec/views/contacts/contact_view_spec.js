define([
	'mediator',
	'models/contact',
	'views/contacts/contact_view'],
function(
	mediator,
	Contact,
	ContactView){

	describe('Contact View', function() {
		var contact, contactView,
			mockContact = {
				first_name: 'Parker',
				last_name: 'Posey',
				email: 'parker.posey@gmail.com'
			};

		beforeEach(function() {
			contact = new Contact(mockContact);
			contactView = new ContactView({ model: contact });
		});

		it('should initialize', function() {
			expect(contactView.tagName).toBe('ul');
			expect(contactView.className).toBe('contact list-rows');
			expect(contactView.template).toBeDefined();
			expect(contactView.model).toBe(contact);
		});

		it('should handle info', function() {
			var e = { preventDefault: function(){} };
			spyOn(mediator, 'publish');
			contactView.onHelp(e);
			expect(mediator.publish).toHaveBeenCalledWith('info_page:show_for_always_share', 'contacts_workflow:back_info_details');
		});

		it('should serialize model', function() {
			var serializedContact = contactView.serialize();
			expect(serializedContact.first_name).toBe('Parker');
			expect(serializedContact.last_name).toBe('Posey');
			expect(serializedContact.email).toBe('parker.posey@gmail.com');
		});
	});
});