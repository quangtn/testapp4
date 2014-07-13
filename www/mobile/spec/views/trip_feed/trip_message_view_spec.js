define([
	'namespace', 'jquery', 'backbone', 'mediator',
	'strings', 'views/trip_feed/trip_message_view', 'collections/message_list'
], function(
	app, $, Backbone, mediator,
	t, MessagesView, Messages
) {

	describe('Trip Messages View', function() {

		var view, messages, amexMessage;

		beforeEach(function() {
			messages = new Messages([], {trip: {id: 1}});
			view = new MessagesView({collection: messages});
		});

		it('should exist', function() {
			expect(MessagesView).toBeTruthy();
			expect(view).toBeDefined();
		});

		it('should initialize', function() {
			spyOn(view, 'initSubscriptions');

			view.initialize();

			expect(view.initSubscriptions).toHaveBeenCalled();
			expect(view.collection).toBe(messages);
		});

		describe('setting collection', function() {
			beforeEach(function() {
				spyOn(view, 'initSubscriptions');
			});

			it('should set collection if it\'s a new collection', function() {
				var newCollection = {};

				view.setCollection(newCollection);

				expect(view.collection).toBe(newCollection);
				expect(view.initSubscriptions).toHaveBeenCalled();
			});

			it('should not set collection if it is the same collection', function() {
					view.setCollection(messages);
					expect(view.initSubscriptions).not.toHaveBeenCalled();
			});
		});

		it('should initialize subscriptions', function() {
			spyOn(view, 'render');

			view.collection.trigger('reset');

			expect(view.render).toHaveBeenCalled();
		});

		it('should serialize', function() {
			var context = view.serialize();

			expect(context.isFetchingMessages).toBeFalsy();
			expect(context.messages).toBeDefined();
		});

		describe('Messages', function() {

			it('should open the amex benefits tool', function() {
				var amexMessage, amex = {
					'event_action': 'GoToTool',
					'tool_name': 'amex_benefits'
				};
				messages.add(amex);
				amexMessage = messages.at(messages.length-1);

				spyOn(view.collection, 'at').andReturn(amexMessage);
				spyOn(app, 'isOnline').andReturn(true);
				spyOn(mediator, 'publish');

				view.onClicked({currentTarget: true, preventDefault: jasmine.createSpy('preventDefault')});

				expect(mediator.publish).toHaveBeenCalledWith('messages:amex_benefits');
			});
		});
	});
});
