define([
	'collections/contacts',
	'text!fixtures/mock_contacts_response.json'],
function(
	ContactsCollection,
	MockContactsResponse){

	describe('Contacts Collection', function() {
		var response = JSON.parse(MockContactsResponse),
			contacts = new ContactsCollection(response);


		it('should initialize', function() {
			expect(contacts).toBeDefined();
			expect(contacts.proxy).toBeDefined();
		});

		describe('contacts sorting: first name > last name > email', function() {
			var sortedContacts = contacts.getSortedContacts();

			function getSortedContactIndex(id) {
				var contact = contacts.where({id: id})[0],
					index = sortedContacts.indexOf(contact);

				return index;
			}

			it('should sort first name before last name', function() {
				// contact 1: tri noensie
				// contact 2: chris volt
				// contact 1 has lower last name, but contact 2 has lower first name
				var indexTri = getSortedContactIndex(0),
					indexChris = getSortedContactIndex(32);

				expect(indexTri).toBeGreaterThan(indexChris);
			});
			it('should sort first name before email', function() {
				// contact 1: tyler tyler@perry.org
				// contact 2: frank zumba@ymca.org
				// contact 1 has lower email, but contact 2 has lower first name
				// both contacts has no last name
				var indexTyler = getSortedContactIndex(1),
					indexFrank = getSortedContactIndex(2323);

					expect(indexTyler).toBeGreaterThan(indexFrank);
			});
			it('should sort last name before email', function() {
				// contact 1: jobs steve@apple.com
				// contact 2: anyang tm@sabre.com
				// contact 1 has lower email, but contact 2 has lower last name
				// both contacts have no first name
				var indexJobs = getSortedContactIndex(2),
					indexAnyang = getSortedContactIndex(83);

					expect(indexJobs).toBeGreaterThan(indexAnyang);
			});
			it('should sort contact with same first and last names based on email', function() {
				// contact 1: chris volt cvolt@google.com
				// contact 2: chris volt chrisvolt@twitter.com
				// both contacts has the same first & last name, but contact 1 has lower email
				var indexCVG = getSortedContactIndex(32),
					indexCVT = getSortedContactIndex(2323);

				expect(indexCVG).toBeLessThan(indexCVT);
			});
			it('should sort contact with same first names based on last name or email', function() {
				// contact 1: chris volt
				// contact 2: chris tomlin
				// both contacts has same first names, but contact 1 has lower last name
				var indexT, indexX,
					indexVolt = getSortedContactIndex(32),
					indexTomlin = getSortedContactIndex(534);

				expect(indexTomlin).toBeLessThan(indexVolt);


				// contact 1: tyler tyler@perry.org
				// contact 2: tyler xyz@abc.com
				// both contacts has same first names, but contact 1 has lower email
				// both contacts has no last names
				indexT = getSortedContactIndex(1);
				indexX = getSortedContactIndex(1212);

				expect(indexT).toBeLessThan(indexX);
			});
			it('should sort contact with same last names based on email', function() {
				// contact 1: jobs steve@apple.com
				// contact 2: jobs ymca@ymca.com
				// both contacts has same last names, but contact 1 has lower email
				// both contacts has no first names
				var indexSteve = getSortedContactIndex(2),
					indexYmca = getSortedContactIndex(99);

				expect(indexSteve).toBeLessThan(indexYmca);
			});
		});
	});
});