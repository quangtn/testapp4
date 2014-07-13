require(['namespace', 'backbone', 'jquery', 'analytics',
	'views/walk_through/walk_through_toolbar_view'],
	function(app, Backbone, $, Analytics, WalkThroughToolbarView) {

		describe('WalkThrough Toolbar View', function cbDescribe() {

			var	viewToolbar;
			var mockControlEvent = {
				preventDefault: function() {}
			};

			beforeEach(function cbBeforeEach() {
				viewToolbar = new WalkThroughToolbarView();
			});

			afterEach(function cbAfterEach() {
				viewToolbar = undefined;
			});

			it('accepts a page setting', function cbIt() {
				viewToolbar.setPageNumber(1);
				expect(viewToolbar.pageNumber).toEqual(1);
			});

			it('SignIn button sends Google Analytic on page3', function cbIt() {
				spyOn(Analytics, 'trackEvent').andCallFake(function cbFake(category, event, app) {
					expect(category).toEqual('WalkThrough');
					expect(event).toEqual('Login_Page3');
					expect(app).toBeDefined();

					return true;
				});

				viewToolbar.setPageNumber(3);
				viewToolbar.onSignIn(mockControlEvent);
			});

			it('SignUp button sends Google Analytic on page2', function cbIt() {
				spyOn(Analytics, 'trackEvent').andCallFake(function cbFake(category, event, app) {
					expect(category).toEqual('WalkThrough');
					expect(event).toEqual('SignUp_Page2');
					expect(app).toBeDefined();

					return true;
				});

				viewToolbar.setPageNumber(2);
				viewToolbar.onSignUp(mockControlEvent);
			});

		});
	});
