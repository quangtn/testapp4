define([
	'namespace',
	'jquery',
	'mediator',
	'collections/contacts',
	'views/contacts/contacts_view',
	'text!fixtures/mock_contacts_response.json'],
function(
	app,
	$,
	mediator,
	ContactsCollection,
	ContactsView,
	MockContactsResponse){

	describe('Contacts View', function() {
		var contactsResponse = JSON.parse(MockContactsResponse),
			contacts = new ContactsCollection(contactsResponse),
			view = new ContactsView({collection: contacts});

		it('should initialize', function() {
			expect(view.collection.length).toBeGreaterThan(0);
			expect(view.presenter).toBeDefined();
		});

		describe('serialize', function() {
			var context;

			beforeEach(function() {
				spyOn(view.presenter, 'getContacts').andCallThrough();
			});

			afterEach(function() {
				view.collection = contacts;
			});

			it('should handle collection', function() {
				context = view.serialize();

				expect(view.presenter.getContacts).toHaveBeenCalled();
				expect(context.isEmpty).toBeFalsy();
				expect(context.isWrapped).not.toBeDefined();
				expect(context.length).toBe(contacts.length);
			});

			it('should handle empty collection', function() {
				view.collection = new ContactsCollection();
				context = view.serialize();

				expect(view.presenter.getContacts).not.toHaveBeenCalled();
				expect(context.isEmpty).toBeTruthy();
				expect(context.isWrapped).toBeDefined();
			});
		});

		it('should trigger contact add manual', function() {
			var e = {
				preventDefault: jasmine.createSpy('preventDefault')
			};
			spyOn(view, 'trigger');

			view._showAddManual(e);
			expect(e.preventDefault).toHaveBeenCalled();
			expect(view.trigger).toHaveBeenCalledWith('contact:add');
		});

		it('should trigger contact detail', function() {
			var e = {
				preventDefault: jasmine.createSpy('preventDefault'),
				currentTarget: $('<div data-id=0>')[0]
			};
			spyOn(view, 'trigger');

			view._showContact(e);
			expect(e.preventDefault).toHaveBeenCalled();
			expect(view.trigger).toHaveBeenCalledWith('contact:clicked', {id: 0});
		});
	});
});