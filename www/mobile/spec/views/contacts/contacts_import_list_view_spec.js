define([
	'namespace',
	'jquery',
	'handlebars',
	'backbone',
	'analytics',
	'collections/contacts',
	'models/contact_collection',
	'models/contact',
	'views/contacts/contacts_import_list_view',
	'text!fixtures/mock_contact_import_response.json',
	'text!templates/contacts/contacts_import_list.tmpl'],
function(
	app,
	$,
	Handlebars,
	Backbone,
	Analytics,
	ContactsCollection,
	ContactCollection,
	Contact,
	ContactsImportListView,
	MockContactsResponse,
	Template){

	describe('Contacts Import List View', function() {
		var context, $html, $viewport, $appPage,
			MOCK_CURRENT_CONTACT_COUNT = 23,
			contactsResponse = JSON.parse(MockContactsResponse),
			contacts = new ContactsCollection(contactsResponse),
			view = new ContactsImportListView({
				collection: contacts,
				contactsCount: MOCK_CURRENT_CONTACT_COUNT
			}),
			template = Handlebars.compile(Template);

		beforeEach(function() {
			context = view.serialize();
			$html = $(template(context));
			$viewport = $('<div id=viewport>');
			$appPage = $('<div id="app-page">');
			$('body').append($html, $viewport, $appPage);
		});

		afterEach(function() {
			$html.remove();
			$viewport.remove();
			$appPage.remove();
			view.selectedCount = null;
		});


		it('should initialize', function() {
			expect(view.contactsCount).toBe(MOCK_CURRENT_CONTACT_COUNT);
			expect(view.presenter).toBeDefined();
		});

		describe('serialize', function() {
			var collection, _context;

			beforeEach(function() {
				collection = view.collection;
			});

			afterEach(function() {
				view.collection = collection;
				_context = null;
			});

			it('should handle empty collection', function() {
				view.collection = new Backbone.Collection();
				_context = view.serialize();
				expect(_context.isEmpty).toBeTruthy();
			});

			it('should serialize phone contacts', function() {
				_context = view.serialize();
				expect(_context.isEmpty).not.toBeTruthy();
			});
		});

		it('should handle afterrender', function() {
			view.afterrender();
			expect(view.autosuggestView).toBeDefined();
		});

		it('should setup toolbar', function() {
			spyOn(view, 'onSubmit');
			view._setupImportToolbarEvent();
			expect(view.$importToolbar).toBeDefined();
			expect($viewport.find(view.$importToolbar).length).toBe(1);

			view.$importToolbar.trigger('vclick');
			expect(view.onSubmit).toHaveBeenCalled();
		});

		it('should cleanup', function() {
			view._setupImportToolbarEvent();
			view.cleanup();
			expect($viewport.find(view.$importToolbar).length).toBe(0);
		});

		describe('contacts submit', function() {
			var fakeEvent = {preventDefault: $.noop},
				selectedContacts = {getCount: $.noop};

			beforeEach(function() {
				spyOn(view, '_getSelectedContacts').andReturn(selectedContacts);
				view.selectedCount = null;
				view.contactsCount = null;
			});

			it('should handle no contact selected', function() {
				spyOn(view, '_reportNoContactsToSave');
				selectedContacts.getCount = function() {return 0;};

				view.onSubmit(fakeEvent);
				expect(view._reportNoContactsToSave).toHaveBeenCalled();
			});

			it('should handle max upload', function() {
				spyOn(view, '_reportTooManyContactsToSave');
				selectedContacts.getCount = function() {return 26;};

				view.onSubmit(fakeEvent);
				expect(view._reportTooManyContactsToSave).toHaveBeenCalled();
			});

			it('should handle max contacts', function() {
				spyOn(view, '_reportTooManyContactsTotal');
				selectedContacts.getCount = function() {return 25;};
				view.contactsCount = 176;

				view.onSubmit(fakeEvent);
				expect(view._reportTooManyContactsTotal).toHaveBeenCalled();
			});

			it('should handle save to server', function() {
				spyOn(view, '_saveContactsToServer');
				selectedContacts.getCount = function() {return 25;};

				view.onSubmit(fakeEvent);
				expect(view._saveContactsToServer).toHaveBeenCalled();
			});
		});

		describe('grab selected contacts', function() {
			var selectedContacts;

			afterEach(function() {
				$('input:checked').remove();
				selectedContacts = null;
			});

			it('should handle contacts selected', function() {
				view.afterrender();
				$('input.tc-checkbox')[0].checked = true;

				selectedContacts = view._getSelectedContacts();
				expect(selectedContacts.get('contacts').length).toBe(1);
			});

			it('should handle no contacts selected', function() {
				selectedContacts = view._getSelectedContacts();
				expect(selectedContacts.get('contacts').length).toBe(0);
			});
		});

		it('should save contacts to server', function() {
			view.selectedContacts = new ContactCollection();
			spyOn(Analytics, 'trackEvent');
			spyOn($, 'ajax').andCallFake(function(options) {
				spyOn(view, 'trigger');
				view.selectedCount = 3;
				options.success(new Contact(), contacts);

				expect($('body').find(view.$importToolbar).length).toBe(0);
				expect(view.trigger).toHaveBeenCalled();
			});

			view._saveContactsToServer();
			expect(Analytics.trackEvent).toHaveBeenCalledWith('Contacts', 'ImportsSent', app);
		});

		describe('autosuggest contacts', function() {
			afterEach(function() {
				view.collection = contacts;
			});

			it('handles contacts', function() {
				view.afterrender();
				expect($('.contact').length).toBe(3);
			});

			it('handles no contacts', function() {
				view.collection = new ContactsCollection();
				view.afterrender();
				expect($('.contact').length).toBe(0);
			});
		});
	});
});