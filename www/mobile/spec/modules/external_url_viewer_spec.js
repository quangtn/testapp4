require(['modules/external_url_viewer'],
function(ExternalURLViewer) {

describe('External URL Viewer', function() {
	var externalURLViewer;

	beforeEach(function() {
		externalURLViewer = new ExternalURLViewer();
	});

	afterEach(function() {
		externalURLViewer = null;
	});

	it('should exist', function() {
		expect(ExternalURLViewer).toBeTruthy();
	});

	it('should have a close function', function() {
		expect(externalURLViewer.close).toBeTruthy();
	});

	describe(':close()', function() {
		it('should close the child browser', function() {
			externalURLViewer.isChildBrowserAvailable = true;
			spyOn(externalURLViewer, '_closeChildBrowser');

			externalURLViewer.close();

			expect(externalURLViewer._closeChildBrowser).toHaveBeenCalled();
		});

		it('should close the web view', function() {
			externalURLViewer.isChildBrowserAvailable = false;
			spyOn(externalURLViewer, '_closeWebView');

			externalURLViewer.close();

			expect(externalURLViewer._closeWebView).toHaveBeenCalled();
		});
	});

	describe(':_closeChildBrowser', function() {
		var originalChildBrowser;

		beforeEach(function() {
			originalChildBrowser = externalURLViewer.childBrowser;
		});

		afterEach(function(){
			externalURLViewer = originalChildBrowser;
		});

		it('should call the close function on the childbrowser plugin', function() {
			externalURLViewer.childBrowser = {
				close: jasmine.createSpy()
			};

			externalURLViewer._closeChildBrowser();

			expect(externalURLViewer.childBrowser.close).toHaveBeenCalled();
		});
	});

	describe(':closeWebView', function() {
		it('should call the hide method on the view', function() {
			spyOn(externalURLViewer.view, 'hide');

			externalURLViewer._closeWebView();

			expect(externalURLViewer.view.hide).toHaveBeenCalled();
		});
	});
});

});
