define([
	'parsers/contact_parser',
	'text!fixtures/mock_contacts_response.json'],
function(
	ContactParser,
	MockContactsResponse){

	describe('Contact Parser', function() {
		var response = JSON.parse(MockContactsResponse),
			parser = ContactParser;
		parser.clear = jasmine.createSpy();

		it('should exist', function() {
			expect(parser).toBeDefined();
		});
		it('should parse contact', function() {
			var contactResponse = response[0],
				parsedContact = parser._parseContact(contactResponse);

			expect(parsedContact).toBe(contactResponse);
		});
		it('should parse', function() {
			var parsedContact,
				contactResponse = response[0];
			spyOn(parser, '_parseContact').andCallThrough();

			parsedContact = parser.parse(contactResponse);
			expect(parser.clear).toHaveBeenCalled();
			expect(parser._parseContact).toHaveBeenCalledWith(contactResponse);
			expect(parsedContact).toBe(contactResponse);
		});

		describe('Contact Full Name', function() {
			var contact, contactName = {
				first_name: 'Jackie',
				last_name: 'Chan'
			};

			it('returns first & last name', function() {
				expect(parser._generateFullName(contactName)).toBe(contactName.first_name + ' ' + contactName.last_name);
			});
			it('returns first name', function() {
				contact = {first_name: contactName.first_name};
				expect(parser._generateFullName(contact)).toBe(contactName.first_name);
			});
			it('returns last name', function() {
				contact = {last_name: contactName.last_name};
				expect(parser._generateFullName(contact)).toBe(contactName.last_name);
			});
			it('returns nothing', function() {
				expect(parser._generateFullName({})).toBeUndefined();
			});
		});
	});
});