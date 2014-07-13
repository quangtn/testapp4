define([
	'jquery',
	'namespace',
	'mediator',
	'strings',
	'analytics',
	'models/contact',
	'controllers/contacts_controller',
	'workflows/contacts_workflow',
	'collections/contacts',
	'text!fixtures/mock_contacts_response.json'],
function(
	$,
	app,
	mediator,
	t,
	analytics,
	Contact,
	ContactsController,
	ContactsWorkflow,
	ContactsCollection,
	MockContactsResponse){

	describe('Contacts Workflow', function() {
		var controller = new ContactsController(),
			workflow = ContactsWorkflow,
			contactsResponse = JSON.parse(MockContactsResponse);

		spyOn(app, 'getLayout');

		beforeEach(function() {
			workflow.transition('uninitialized');
			workflow.handle('initialize', {controller: controller});
		});

		afterEach(function() {
			workflow.controller = null;
			workflow.contacts = null;
			workflow.contact = null;
		});

		it('should initialize', function() {
			expect(workflow).toBeDefined();
			expect(workflow.state).toBe('uninitialized');
		});

		it('should handle initialized state', function() {
			expect(workflow.controller).toEqual(controller);
			expect(workflow.contacts).toBeDefined();
		});

		describe('showContacts state', function() {
			beforeEach(function() {
				spyOn(workflow.controller, 'setView');
				spyOn($, 'ajax').andCallFake(function(options) {
					expect(options.success).toBeDefined();
					options.success(contactsResponse);
				});
			});

			afterEach(function() {
				workflow.view = null;
				workflow.contacts = null;
				workflow.contactId = null;
				workflow.importCount = null;
			});

			describe('initial event', function() {
				it('should show contact list', function() {
					spyOn(workflow, '_setHeader');

					workflow.transition('showContacts');
					expect(workflow.viewContactsList).toBeDefined();
					expect(workflow.controller._layout).toBeDefined();
					expect(workflow.controller.setView).toHaveBeenCalledWith(workflow.viewContactsList);
					expect(workflow._setHeader).toHaveBeenCalled();
				});

				it('should show contact list with success notification', function() {
					spyOn(workflow, '_setHeader');
					workflow.importCount = 2;
					workflow.transition('showContacts');

					expect(workflow.viewImportSuccess).toBeDefined();
					expect(workflow._setHeader).toHaveBeenCalled();

					expect(workflow.importCount).toBe(undefined);
				});
			});

			it('should transition into showContactDetails upon ContactsView contact:clicked', function() {
				var contactId = 5;
				workflow.transition('showContacts');

				spyOn(workflow, 'transition');
				workflow.viewContactsList.trigger('contact:clicked', {id: contactId});

				expect(workflow.contactId).toBe(contactId);
				expect(workflow.transition).toHaveBeenCalledWith('showContactDetails');
			});

			it('should handle view add manual contact trigger', function() {
				workflow.transition('showContacts');
				spyOn(workflow, 'transition');

				workflow.viewContactsList.trigger('contact:add');
				expect(workflow.transition).toHaveBeenCalledWith('showContactAdd');
			});

			it('should handle back', function() {
				spyOn(mediator, 'publish');
				workflow.transition('showContacts');
				workflow.handle('back');

				expect(workflow.state).toBe('uninitialized');
				expect(mediator.publish).toHaveBeenCalledWith('back:history');
			});
		});

		describe('showContactDetails state', function() {
			beforeEach(function() {
				spyOn($, 'ajax').andCallFake(function(options) {
					expect(options.success).toBeDefined();
					options.success();
				});

				workflow.contacts = new ContactsCollection(contactsResponse);
			});

			afterEach(function() {
				workflow.contactDetailView = null;
				workflow.contactId = null;
			});

			it('should initialize state', function() {
				workflow.contactId = 0;
				spyOn(workflow.controller, 'setView');
				spyOn(workflow, '_setHeader');
				spyOn(analytics, 'trackEvent');

				workflow.transition('showContactDetails');

				expect(workflow.contact).toBeDefined();
				expect(workflow.contactDetailView).toBeDefined();
				expect(workflow.controller.setView).toHaveBeenCalledWith(workflow.contactDetailView);
				expect(workflow._setHeader).toHaveBeenCalled();
				expect(analytics.trackEvent).toHaveBeenCalled();
			});

			it('should handle back in showContactDetails', function() {
				spyOn(workflow.controller, 'setView');
				workflow.transition('showContactDetails');

				spyOn(workflow, 'transition');
				workflow.handle('back');

				expect(workflow.transition).toHaveBeenCalledWith('showContacts');
			});
		});

		describe('showContactAdd state', function() {

			afterEach(function() {
				workflow.contactAddView = null;
			});

			it('should handle initialize state', function() {
				spyOn(workflow, '_setHeader').andCallThrough();
				spyOn(workflow.controller, 'setView').andCallThrough();
				spyOn(analytics, 'trackEvent');

				workflow.transition('showContactAdd');
				expect(workflow.contact).toBeDefined();
				expect(workflow.contactAddView).toBeDefined();
				expect(workflow.controller._layout).toEqual(app.getLayout('simple'));
				expect(workflow.controller.setView).toHaveBeenCalledWith(workflow.contactAddView);
				expect(workflow._setHeader).toHaveBeenCalled();
				expect(analytics.trackEvent).toHaveBeenCalledWith('Contacts', 'ContactAdd', app);
			});

			describe('save event', function() {

				it('should trigger save event', function() {
					workflow.transition('showContactAdd');
					spyOn(workflow.contact, 'save');

					workflow.contactAddView.trigger('contact:submit');
					expect(workflow.contact.save).toHaveBeenCalled();
				});

				it('should handle save', function() {
					workflow.transition('showContactAdd');
					spyOn(workflow.contact, 'save').andCallFake(function(params, callback) {
						spyOn(workflow, 'transition');

						expect(params).toBeTruthy();
						expect(callback.success).toBeDefined();

						callback.success();
						expect(workflow.transition).toHaveBeenCalledWith('showContacts');
					});

					workflow.handle('save', true);
				});
			});

			it('should handle back', function() {
				workflow.transition('showContactAdd');
				spyOn(workflow, 'transition');
				workflow.handle('back');
				expect(workflow.transition).toHaveBeenCalledWith('showContacts');
			});
		});

		describe('showContactEdit', function() {
			beforeEach(function() {
				workflow.contact = new Contact();
			});

			it('should handle initialize state', function() {
				spyOn(workflow, '_setHeader');
				spyOn(workflow.controller, 'setView');
				spyOn(analytics, 'trackEvent');

				workflow.transition('showContactEdit');
				expect(workflow.contactEditView).toBeDefined();
				expect(workflow.controller.setView).toHaveBeenCalledWith(workflow.contactEditView);
				expect(workflow._setHeader).toHaveBeenCalled();
				expect(analytics.trackEvent).toHaveBeenCalled();
			});

			it('should handle trigger save on view edit', function() {
				spyOn(workflow, 'handle');

				workflow.transition('showContactEdit');
				workflow.contactEditView.trigger('contact:submit', true);
				expect(workflow.handle).toHaveBeenCalledWith('save', true);
			});

			it('should handle save', function() {
				var params = {};
				spyOn(workflow.contact, 'save').andCallThrough();
				spyOn($, 'ajax').andCallFake(function(options) {
					spyOn(workflow, 'transition');
					expect(options.success).toBeDefined();

					options.success();
					expect(workflow.transition).toHaveBeenCalledWith('showContactDetails');
				});

				workflow.transition('showContactEdit');
				workflow.handle('save', params);

				expect(workflow.contact.save).toHaveBeenCalled();

			});

			it('should handle delete', function() {
				spyOn(workflow.contact, 'destroy').andCallThrough();
				spyOn($, 'ajax').andCallFake(function(options) {
					spyOn(workflow, 'transition');
					expect(options.success).toBeDefined();

					options.success();
					expect(workflow.transition).toHaveBeenCalledWith('showContacts');
				});

				workflow.transition('showContactEdit');
				workflow.handle('destroy');

				expect(workflow.contact.destroy).toHaveBeenCalled();
			});

			it('should handle back', function() {
				workflow.transition('showContactEdit');
				spyOn(workflow, 'transition');

				workflow.handle('back');
				expect(workflow.transition).toHaveBeenCalledWith('showContactDetails');
			});
		});

		describe('showContactImport', function() {
			it('should handle initialize state');
			it('should show phone contact list');
			it('should handle phone contact error');
			it('should handle save');
			it('should handle back');
		});

		describe('updateHeader', function() {
			beforeEach(function() {
				spyOn(workflow.controller, '_updateHeader').andCallThrough();
			});

			it('should handle showContacts state', function() {
				var addButton = [{
						name: 'add-contacts',
						action: 'contacts_workflow:add',
						iconURL: 'button-icon btn_icon_add_25px'
					}];

				workflow.state = 'showContacts';
				workflow._setHeader();
				expect(workflow.controller._updateHeader).toHaveBeenCalledWith(
					t.Contacts, 'contacts_workflow:back', {rightButtons: addButton}
				);
			});

			describe('showContactAdd state', function() {
				var isWrapped = app.isWrapped;

				beforeEach(function() {
					workflow.state = 'showContactAdd';
				});

				afterEach(function() {
					app.isWrapped = isWrapped;
				});

				it('should handle wrapped', function() {
					var importButton = [{
						name: 'import-contacts text-button',
						action: 'contacts_workflow:import',
						text: t.ImportContact
					}];
					app.isWrapped = true;

					workflow._setHeader();
					expect(workflow.controller._updateHeader).toHaveBeenCalledWith(
						t.AddContact, 'contacts_workflow:back', {rightButtons: importButton}
					);
				});
				it('should handle not wrapped', function() {
					app.isWrapped = false;

					workflow._setHeader();
					expect(workflow.controller._updateHeader).toHaveBeenCalledWith(
						t.AddContact, 'contacts_workflow:back', {rightButtons: undefined}
					);
				});
			});

			it('should handle showContactDetails state', function() {
				var editButton = [{
					name: 'contact-edit',
					iconURL: 'button-icon btn_icon_edit_25px',
					action: 'contacts_workflow:edit'
				}];

				workflow.state = 'showContactDetails';
				workflow._setHeader();
				expect(workflow.controller._updateHeader).toHaveBeenCalledWith(
					t.ContactDetails, 'contacts_workflow:back', {rightButtons: editButton}
				);
			});

			it('should handle showContactImport state', function() {
				workflow.state = 'showContactImport';
				workflow._setHeader();
				expect(workflow.controller._updateHeader).toHaveBeenCalledWith(
					t.ImportContacts, 'contacts_workflow:back', {rightButtons: undefined}
				);
			});

			it('should handle showContactEdit state', function() {
				workflow.state = 'showContactEdit';
				workflow._setHeader();
				expect(workflow.controller._updateHeader).toHaveBeenCalledWith(
					t.EditContact, 'contacts_workflow:back', {rightButtons: undefined}
				);
			});
		});
	});
});