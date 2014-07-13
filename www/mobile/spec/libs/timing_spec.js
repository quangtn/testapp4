define([
	'timing'
], function(
	Timing
) {
	describe('Timing', function() {

		it('should be defined', function() {
			expect(Timing).toBeDefined();
		});

	});

	describe('`time`', function() {

		afterEach(function() {
			Timing.pubsub = null;
			Timing.timers = {};
		});

		it('should be defined', function() {
			expect(Timing.time).toBeDefined();
		});

		it('should not allow invalid arguments', function() {
			expect(function() {
				Timing.time();
			}).toThrow(new Error('Invalid arguments for `time`'));
		});

		it('should add events to the timer queue and publish events', function() {
			Timing.pubsub = jasmine.createSpyObj('pubsub', ['publish']);
			Timing.timers = {};

			Timing.time('category', 'name');

			expect(Timing.pubsub.publish).toHaveBeenCalled();
		});

	});

	describe('`timeEnd`', function() {

		afterEach(function() {
			Timing.pubsub = null;
			Timing.timers = null;
			Timing._InitQueue = {};
		});

		it('should be defined', function() {
			expect(Timing.timeEnd).toBeDefined();
		});

		it('should not allow invalid arguments', function() {
			expect(function() {
				Timing.timeEnd();
			}).toThrow(new Error('Invalid arguments for `timeEnd`'));
		});

		it('should add events to the timer queue and publish events', function() {
			Timing.pubsub = jasmine.createSpyObj('pubsub', ['publish']);
			Timing.timers = {
				'category:name': 1234
			};

			Timing.timeEnd('category', 'name');

			expect(Timing.pubsub.publish).toHaveBeenCalled();
		});

	});
});
