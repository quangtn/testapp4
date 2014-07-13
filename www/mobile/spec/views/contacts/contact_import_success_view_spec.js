define(['handlebars', 'models/contact', 'views/contacts/contacts_import_success_view',
	'text!templates/contacts/contact_import_success.tmpl'],
	function(Handlebars, Contact, ContactsImportSuccessView, template) {

		describe('Contact Import Success View', function() {

			it('should serialize create input', function() {
				var oneImported = 1;
				var viewImportSuccess = new ContactsImportSuccessView(oneImported);
				var dataContext = viewImportSuccess.serialize();

				expect(dataContext.importCount).toEqual(1);
			});


			it('should display proper text for a single (1) result', function() {
				var oneImported = 1;
				var viewImportSuccess = new ContactsImportSuccessView(oneImported);
				var compiledTemplate = Handlebars.compile(template);
				var html = compiledTemplate(viewImportSuccess.serialize());

				expect(html).toMatch(/Success! 1 contact ready for your trip updates/);
			});


			it('should display proper text multiple (3) results', function() {
				var threeImported = 3;
				var viewImportSuccess = new ContactsImportSuccessView(threeImported);
				var compiledTemplate = Handlebars.compile(template);
				var html = compiledTemplate(viewImportSuccess.serialize());

				expect(html).toMatch(/3 contacts ready for your trip updates./);
			});

		});
	});
