define([
	'jquery',
	'underscore',
	'backbone',
	'collections/contacts',
	'text!fixtures/mock_contacts_response.json',
	'text!templates/trips/share_autosuggest_result.tmpl',
	'views/ui/autosuggest_view'],
function(
	$,
	_,
	Backbone,
	Contacts,
	MockContactsResponse,
	ResultTemplate,
	AutosuggestView) {

	describe('Autosuggest View', function() {
		var view, config,
			response = JSON.parse(MockContactsResponse),
			contacts = new Contacts(response);

		config = {
			collections: {contacts: contacts},
			searchKeys: ['first_name'],
			input: '#some-input',
			anchor: '#some-anchor',
			resultTemplate: ResultTemplate,
			sortIterator: contacts.sortIterator,
			selectEvents: {
				'.suggested-contact' : function(e) {
					$.noop();
				}
			}
		};

		beforeEach(function() {
			$('html').append('<input id="some-input" type="text">', '<div id="app-page">', '<div class="suggested-contact">', '<div id="some-anchor">');
			view = new AutosuggestView(config);
			view.$el = $('<div>').addClass(view.className);
		});

		afterEach(function() {
			$('#some-input, #some-anchor, #app-page, .suggested-contact').remove();
			view = null;
		});

		it('should initialize', function() {
			expect(view).toBeDefined();
			expect(view.collections).toBeDefined();
			expect(view.searchKeys).toBeDefined();
			expect(view.input).toBeDefined();
			expect(view.anchor).toBeDefined();
			expect(view.resultTemplate).toBeDefined();
			expect(view.sortIterator).toBeDefined();
			expect(view.selectEvents).toBeDefined();
			expect(view.$container).toBeDefined();
		});

		describe('check fixed toolbar', function() {
			var stylesWithToolbar = 'has-fixed-toolbar';

			it('should handle fixed toolbar', function() {
				$('body').append('<div class="fixed-toolbar">');
				view.checkFixedToolbar();
				expect(view.$el.hasClass(stylesWithToolbar)).toBeTruthy();
				$('.fixed-toolbar').remove();
			});

			it('should handle no fixed toolbar', function() {
				view.checkFixedToolbar();
				expect(view.$el.hasClass(stylesWithToolbar)).not.toBeTruthy();
			});
		});

		it('should reset', function() {
			spyOn(view, '_bindInputEvent');
			spyOn(view, '_appendToView');
			spyOn(view, '_sortCollections');
			spyOn(view, '_showSuggestions');

			view.reset();
			expect(view.$input).toBeDefined();
			expect(view.$anchor).toBeDefined();

			expect(view._bindInputEvent).toHaveBeenCalled();
			expect(view._appendToView).toHaveBeenCalled();
			expect(view._sortCollections).toHaveBeenCalled();
			expect(view._showSuggestions).toHaveBeenCalled();
		});

		it('should reset on collection change event', function() {
			spyOn(view, '_bindInputEvent');
			view.collections.contacts.trigger('reset');
			expect(view._bindInputEvent).toHaveBeenCalled();
		});

		describe('sorting collections', function() {
			var unsortedResult, sortIterator;

			beforeEach(function() {
				unsortedResult = view.collections.contacts.toArray();
				sortIterator = view.sortIterator;
			});

			afterEach(function() {
				view.sortIterator = sortIterator;
			});

			it('should have sorting iterator', function() {
				view._sortCollections();
				expect(view.sortedCollections.contacts).not.toEqual(unsortedResult);
			});

			it('should not have sorting iterator', function() {
				view.sortIterator = null;
				view._sortCollections();
				expect(view.sortedCollections.contacts).toEqual(unsortedResult);
			});
		});

		it('should bind input event', function() {
			spyOn(view, '_showSuggestions');

			view._bindInputEvent();
			view.$input.keyup();
			expect(view._showSuggestions).toHaveBeenCalled();
		});

		it('should append to view', function() {
			spyOn(view.$el, 'hide').andCallThrough();
			spyOn(view.$el, 'remove');
			spyOn(view.$input, 'blur');

			view._appendToView();
			expect(view.$el.remove).toHaveBeenCalled();
			expect(view.$el.hide).toHaveBeenCalled();
			expect(view.$container.find(view.$el).length).toBeDefined();

			view.$el.trigger('vmousedown');
			expect(view.$input.blur).toHaveBeenCalled();
		});

		describe('showing suggestions', function() {
			var autoHideResult;

			beforeEach(function() {
				autoHideResult = this.autoHideResult;
			});

			afterEach(function() {
				this.autoHideResult = autoHideResult;
			});

			it('should handle query', function() {
				var query = 'tri';
				spyOn(view, '_filterCollections').andCallThrough();
				spyOn(view, '_renderSuggestionsTemplate').andReturn(true);
				spyOn(view.$el, 'html').andReturn(view.$el);
				spyOn(view.$el, 'scrollTop').andReturn(view.$el);
				spyOn(view.$el, 'show');
				spyOn(view, '_bindSuggestionSelectEvents');

				view._showSuggestions(query);
				expect(view._filterCollections).toHaveBeenCalledWith(query);
				expect(view._renderSuggestionsTemplate).toHaveBeenCalled();
				expect(view.suggestionsHtml).toBeDefined();
				expect(view.$el.html).toHaveBeenCalledWith(view.suggestionsHtml);
				expect(view.$el.scrollTop).toHaveBeenCalledWith(0);
				expect(view.$el.show).toHaveBeenCalled();
				expect(view._bindSuggestionSelectEvents).toHaveBeenCalled();
				expect(view.suggestions).toBeDefined();
			});

			it('should handle no query and auto hide result', function() {
				view.autoHideResult = true;
				spyOn(view.$el, 'hide');
				view._showSuggestions();
				expect(view.$el.hide).toHaveBeenCalled();
			});

			it('should handle no query and no auto hide result', function() {
				view._showSuggestions();
				expect(view.suggestions).toBe(view.sortedCollections);
			});
		});

		describe('filters collections', function() {
			var query, suggestions;

			afterEach(function() {
				suggestions = null;
			});

			it('should find results', function() {
				query = 'frank';

				suggestions = view._filterCollections(query);
				expect(suggestions.contacts.length).toBe(1);
			});

			it('should not find results', function() {
				query = 'hotdog';

				view._filterCollections(query);
				expect(suggestions).toBeNull();
			});
		});

		describe('rendering suggestion template', function() {
			var html, isPopup;

			beforeEach(function() {
				isPopup = view.isPopup;
			});

			afterEach(function() {
				view.isPopup = isPopup;
				view.suggestions = null;
				html = null;
			});

			it('should handle context', function() {
				view.suggestions = {tripcaseContacts: view.sortedCollections.contacts};

				html = view._renderSuggestionsTemplate();
				expect($(html).find('.autosuggest-suggestion').length).toBe(11);
			});

			it('should handle no context', function() {
				html = view._renderSuggestionsTemplate();
				expect($(html).find('.autosuggest-suggestion').length).toBe(0);
			});

			it('should handle popup', function() {
				view.isPopup = true;
				spyOn(view.$el, 'addClass');

				view._renderSuggestionsTemplate();
				expect(view.$el.addClass).toHaveBeenCalledWith('autosuggest-popup');
			});

			it('should handle not popup', function() {
				view.isPopup = false;
				spyOn(view.$el, 'removeClass');

				view._renderSuggestionsTemplate();
				expect(view.$el.removeClass).toHaveBeenCalledWith('autosuggest-popup');
			});
		});

		it('should bind suggestions select events', function() {
			var el = '.suggested-contact',
				$el = $(el);
			spyOn($, 'noop');
			spyOn(view.$el, 'hide');
			spyOn(_, 'each').andCallFake(function(callback) {
				callback(view.selectEvents[el], el);
			});

			view._bindSuggestionSelectEvents();

			$el.click();
			expect($.noop).toHaveBeenCalled();
			expect(view.$el.hide).not.toHaveBeenCalled();
		});
	});
});