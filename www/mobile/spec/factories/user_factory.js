define([
	'factory', 'models/user',
], function(
	Factory, User) {
	var UserFactory = {
		build: Factory.createFactoryMethod(User, {
			id: 1,
			first_name: 'frank',
			last_name: 'underwood',
			email: 'frank.underwood@us.gov',
			password: 'password',
			password_confirmation: 'password'
		})
	};

	return UserFactory;
});