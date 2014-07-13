define([
	'namespace',
	'handlebars',
	'analytics',
	'mediator',
	'views/delete_confirm_popup_factory',
	'models/contact',
	'views/contacts/edit_contact_view',
	'text!templates/contacts/edit_contact.tmpl'],
function(
	app,
	Handlebars,
	Analytics,
	mediator,
	DeletePopup,
	Contact,
	EditContactView,
	EditContactTemplate) {

	describe('Contact Edit View', function() {
		var contact, view, e, template, html,
			contactInfo = {
				first_name: 'Chris',
				last_name: 'Rock',
				email: 'noimtherock@gmail.com',
				is_always_sharing: true
			};

		beforeEach(function() {
			contact = new Contact(contactInfo);
			view = new EditContactView({model: contact});
			e = { preventDefault: function(){} };
			template = Handlebars.compile(EditContactTemplate);
			html = template(view.serialize());
			view.$el.append(html).appendTo(document.getElementsByTagName('body'));
		});

		afterEach(function() {
			view.$el.remove();
			contact = view = e = null;
		});

		it('should initialize', function() {
			expect(view).toBeDefined();
		});

		describe('import overlay', function() {
			var isWrapped = app.isWrapped,
				templateParams = {
					templateFilename: 'overlay_contacts_phone_import',
					storageKeyName: 'contacts_phone_import',
					analyticsEvent: 'ContactsPhoneImport'
				};

			afterEach(function() {
				app.isWrapped = isWrapped;
			});

			it('should handle wrapped', function() {
				spyOn(mediator, 'publish');
				app.isWrapped = true;

				view.showImportOverlay();
				expect(mediator.publish).toHaveBeenCalledWith('overlay:trigger', templateParams);
			});

			it('should handle not wrapped', function() {
				spyOn(mediator, 'publish');
				app.isWrapped = false;

				view.showImportOverlay();
				expect(mediator.publish).not.toHaveBeenCalled();
			});
		});

		describe('always share toggle analytics', function() {
			beforeEach(function() {
				spyOn(Analytics, 'trackEvent');
			});

			it('should handle always share on', function() {
				view.onAlwaysShare();
				expect(Analytics.trackEvent).toHaveBeenCalledWith('Contacts', 'AlwaysShareOn', app);
			});

			it('should handle always share off', function() {
				view.$el.find('#always-share')[0].checked = false;
				view.onAlwaysShare();
				expect(Analytics.trackEvent).toHaveBeenCalledWith('Contacts', 'AlwaysShareOff', app);
			});
		});

		it('should handle save', function() {
			spyOn(e, 'preventDefault');
			spyOn(view, 'trigger');

			view.onSave(e);
			expect(e.preventDefault).toHaveBeenCalled();
			expect(view.trigger).toHaveBeenCalledWith('contact:submit', {
				first_name: contactInfo.first_name,
				last_name: contactInfo.last_name,
				email: contactInfo.email,
				is_always_sharing: contactInfo.is_always_sharing
			});
		});

		it('should handle delete', function() {
			spyOn(e, 'preventDefault');
			spyOn(view, 'trigger');
			spyOn(DeletePopup, 'createPopup').andCallThrough();

			view.onDelete(e);
			expect(view.popup).toBeDefined();
			expect(DeletePopup.createPopup).toHaveBeenCalledWith(view.model);

			spyOn(view.popup, 'on').andCallThrough();
			view.popup.trigger('complete');

			expect(e.preventDefault).toHaveBeenCalled();
			expect(view.trigger).toHaveBeenCalledWith('contact:delete');
		});

		it('should handle help', function() {
			spyOn(mediator, 'publish');
			view.onHelp(e);
			expect(mediator.publish).toHaveBeenCalledWith('info_page:show_for_always_share', undefined);
		});

		it('should serialize', function() {
			var serialized = view.serialize();

			expect(serialized.first_name).toBe(contactInfo.first_name);
			expect(serialized.last_name).toBe(contactInfo.last_name);
			expect(serialized.email).toBe(contactInfo.email);
		});
	});
});