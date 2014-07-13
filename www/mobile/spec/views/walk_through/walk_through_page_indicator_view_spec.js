require(['namespace', 'backbone', 'jquery', 'analytics',
	'views/walk_through/walk_through_page_indicator_view'],
	function(app, Backbone, $, Analytics, WalkThroughPageIndicatorView) {

		describe('WalkThrough Page Indicator View', function cbDescribe() {

			var	viewIndicator;

			beforeEach(function cbBeforeEach() {
				viewIndicator = new WalkThroughPageIndicatorView();
			});

			afterEach(function cbAfterEach() {
				viewIndicator = undefined;
			});

			it('accepts a page setting', function cbIt() {
				viewIndicator.setPageNumber(1);
				expect(viewIndicator.pageNumber).toEqual(1);
			});
		});
	});
