define([
	'namespace',
	'factories/user_factory',
	'../../../libs/timing/performance_now_polyfill'
], function(
	app,
	UserFactory
) {

	// setup user
	app.session.user = UserFactory.build();
	app.session.resetUser = function() {
		this.user = UserFactory.build();
	};

});
