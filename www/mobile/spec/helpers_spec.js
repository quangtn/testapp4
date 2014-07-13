require(['jquery', 'helpers', 'moment'],
function($, helpers, moment) {

	describe('helpers', function() {

		describe('year()', function() {
			it('happy path', function() {
				var typicalServiceDate = '2011-12-09T03:00:00';
				var expectedResult = 'Fri Dec 9';
				var formattedDate = helpers.dateHelpers.year(typicalServiceDate);

				expect(formattedDate).toBe(expectedResult);
			});

			it('handles empty string', function() {
				var date = '';
				var expectedResult = '';
				var formattedDate = helpers.dateHelpers.year(date);

				expect(formattedDate).toBe(expectedResult);
			});

			it('handles no parameter', function() {
				var expectedResult = '';
				var formattedDate = helpers.dateHelpers.year();

				expect(formattedDate).toEqual(expectedResult);
			});
		});


		describe('mediumDate()', function() {
			it('handles undefined parameter', function() {
				var formattedDate = helpers.dateHelpers.mediumDate();
				var expectedResult = '';

				expect(formattedDate).toBe(expectedResult);
			});

			it('handles empty string', function() {
				var emptyDate = '';
				var expectedResult = '';
				var formattedDate = helpers.dateHelpers.mediumDate(emptyDate);

				expect(formattedDate).toBe(expectedResult);
			});

			it('formats typical single day and month correctly', function() {
				var typicalServiceDate = '2012-02-05T16:00:00';
				var expectedResult = 'Sun Feb 5';
				var formattedDate = helpers.dateHelpers.mediumDate(typicalServiceDate);

				expect(formattedDate).toBe(expectedResult);
			});

			it('formats typical double day and month', function() {
				var typicalServiceDate = '2012-11-24T16:00:00';
				var expectedResult = 'Sat Nov 24';
				var formattedDate = helpers.dateHelpers.mediumDate(typicalServiceDate);

				expect(formattedDate).toBe(expectedResult);
			});
		});


		describe('longDate()', function() {
			it('should exist', function() {
				expect(helpers.dateHelpers.longDate).toBeDefined();

			});

			it('should return my expected date format', function() {
				var expected = 'Sun, February 5, 2012';
				var expected2 = 'Mon, February 6, 2012';

				var dateTime = '2012-02-05T16:00:00';
				var dateTime2 = '2012-02-06T16:00:00';

				var result = helpers.dateHelpers.longDate(dateTime);
				var result2 = helpers.dateHelpers.longDate(dateTime2);

				expect(result).toEqual(expected);
				expect(result2).toEqual(expected2);

			});

			it('should handle an empty string as a parameter', function() {
				var emptyDate = '';
				var expectedResult = '';
				var formattedDate = helpers.dateHelpers.longDate(emptyDate);
			});

		});

		describe('combineDateAndTime()', function() {
			it('should exist', function() {
				expect(helpers.dateHelpers.combineDateAndTime).toBeDefined();
			});

			it('should return the time added to the date', function() {
				var date = moment('2013-01-01T05:00');
				var time = moment('2000-01-01T06:15');

				var combined = helpers.dateHelpers.combineDateAndTime(date, time);
				expect(combined.format('YYYY-MM-DDTHH:mm')).toBe('2013-01-01T06:15');
			});
		});

		describe('formattedCombineDateAndTime()', function() {
			it('should exist', function() {
				expect(helpers.dateHelpers.formattedCombineDateAndTime).toBeDefined();
			});

			it('should return the time added to the date', function() {
				var date = moment('2013-01-01T05:00');
				var time = moment('2000-01-01T06:15');

				var formattedCombined = helpers.dateHelpers.formattedCombineDateAndTime(date, time, 'MMM, DD hh:mm');
				expect(formattedCombined).toBe('Jan, 01 06:15');
			});
		});



		describe('timeFromDateTime()', function() {
			it('handles undefined parameter', function() {
				var formattedDate = helpers.dateHelpers.timeFromDateTime();
				var expectedResult = '';

				expect(formattedDate).toBe(expectedResult);
			});

			it('handles empty string', function() {
				var emptyDate = '';
				var expectedResult = '';
				var formattedDate = helpers.dateHelpers.timeFromDateTime(emptyDate);

				expect(formattedDate).toBe(expectedResult);
			});

			it('formats typical single day and month correctly', function() {
				var typicalServiceDate = '2012-08-30T12:00:00';
				var expectedResult = '12:00pm';
				var formattedDate = helpers.dateHelpers.timeFromDateTime(typicalServiceDate);

				expect(formattedDate).toBe(expectedResult);
			});

			it('formats typical double day and month', function() {
				var typicalServiceDate = '2012-08-30T12:00:00';
				var expectedResult = '12:00pm';
				var formattedDate = helpers.dateHelpers.timeFromDateTime(typicalServiceDate);

				expect(formattedDate).toBe(expectedResult);
			});

			describe('during daylight saving time', function() {
				beforeEach(function() {
					// "Mon Mar 10 2014 14:14:30 GMT-0500 (CDT)"
					this.clock = sinon.useFakeTimers(1394478870748);
				});

				afterEach(function() {
					this.clock.restore();
				});

				it('adjusts for dst times correctly in central timezone', function() {
					var timeFromBeforeDST = '2014-03-09T06:45:00';
					var formattedDate = helpers.dateHelpers.timeFromDateTime(timeFromBeforeDST);

					expect(formattedDate).toBe('6:45am');
				});
			});
		});


		describe('hoursMinutesFromMinutes()', function() {
			it('formats to single hour single minute', function() {
				var count = 66;
				var expectedResult = '1h 6m';
				var formattedDate = helpers.dateHelpers.hoursMinutesFromMinutes(count);

				expect(formattedDate).toBe(expectedResult);
			});

			it('formats to double hours double minutes', function() {
				var count = 1064;
				var expectedResult = '17h 44m';
				var formattedDate = helpers.dateHelpers.hoursMinutesFromMinutes(count);

				expect(formattedDate).toBe(expectedResult);
			});
		});

		describe('hoursMinutesFromMinutesHumanize', function() {

			it('formats one minute', function() {
				expect(helpers.dateHelpers.hoursMinutesFromMinutesHumanize(1))
				.toEqual('1 min');
			});

			it('formats only minutes', function() {
				expect(helpers.dateHelpers.hoursMinutesFromMinutesHumanize(30))
				.toEqual('30 mins');
			});

			it('formats one hour', function() {
				expect(helpers.dateHelpers.hoursMinutesFromMinutesHumanize(60))
				.toEqual('1 hr');
			});

			it('formats one hour and one minute', function() {
				expect(helpers.dateHelpers.hoursMinutesFromMinutesHumanize(61))
				.toEqual('1 hr 1 min');
			});

			it('formats one hour and minutes', function() {
				expect(helpers.dateHelpers.hoursMinutesFromMinutesHumanize(90))
				.toEqual('1 hr 30 mins');
			});

			it('formats only hours', function() {
				expect(helpers.dateHelpers.hoursMinutesFromMinutesHumanize(120))
				.toEqual('2 hrs');
			});

			it('formats hours and minutes', function() {
				expect(helpers.dateHelpers.hoursMinutesFromMinutesHumanize(150))
				.toEqual('2 hrs 30 mins');
			});

		});

		describe('delayed_by()', function() {
			it('concludes "delayed" flight time', function() {
				var typicalStartDate = '2012-12-30T08:02:00';
				var typicalEndDate = '2012-12-30T11:45:00';
				var expectedResult = '(delayed 223m)';
				var formattedDate = helpers.dateHelpers.delayed_by(typicalStartDate, typicalEndDate);

				expect(formattedDate).toBe(expectedResult);
			});

			it('concludes "early" flight time', function() {
				var typicalStartDate = '2012-08-12T12:00:00';
				var typicalEndDate = '2012-08-12T11:40:00';
				var expectedResult = '(early 20m)';
				var formattedDate = helpers.dateHelpers.delayed_by(typicalStartDate, typicalEndDate);

				expect(formattedDate).toBe(expectedResult);
			});
		});

		describe('isNudgable( index, listLength )', function() {
			it('should show the nudge after the third item if the list is longer than 12', function() {
				var index = 3;
				var listLength = 13;

				expect(helpers.isNudgable(index, listLength)).toBeTruthy();
			});

			it('should NOT show the nudge after the third item if the list is shorter than 12', function() {
				var index = 3;
				var listLength = 5;

				expect(helpers.isNudgable(index, listLength)).toBeFalsy();
			});

			it('should NOT show the nudge after the third item if the list is = 12', function() {
				var index = 3;
				var listLength = 12;

				expect(helpers.isNudgable(index, listLength)).toBeFalsy();
			});

			it('should show the nudge at 25', function() {
				var index = 25;
				var listLength = 100;

				expect(helpers.isNudgable(index, listLength)).toBeTruthy();
			});

			it('should NOT show the nudge at 25 if the end of the list is 10 away', function() {
				var index = 25;
				var listLength = 35;

				expect(helpers.isNudgable(index, listLength)).toBeFalsy();
			});

			it('should NOT show the nudge at 25 if the end of the list is less than 10 away', function() {
				var index = 25;
				var listLength = 30;

				expect(helpers.isNudgable(index, listLength)).toBeFalsy();
			});

			it('should show the nudge at 25 if the end of the list is more than 10 away', function() {
				var index = 25;
				var listLength = 39;

				expect(helpers.isNudgable(index, listLength)).toBeTruthy();
			});


			it('should show the nudge at 50', function() {
				var index = 50;
				var listLength = 100;

				expect(helpers.isNudgable(index, listLength)).toBeTruthy();
			});

			it('should NOT show the nudge at 50 if the end of the list is 10 away', function() {
				var index = 50;
				var listLength = 60;

				expect(helpers.isNudgable(index, listLength)).toBeFalsy();
			});

			it('should NOT show the nudge at 50 if the end of the list is less than 10 away', function() {
				var index = 50;
				var listLength = 55;

				expect(helpers.isNudgable(index, listLength)).toBeFalsy();
			});

			it('should show the nudge at 50 if the end of the list is more than 10 away', function() {
				var index = 50;
				var listLength = 70;

				expect(helpers.isNudgable(index, listLength)).toBeTruthy();
			});



			it('should show the nudge at 75', function() {
				var index = 75;
				var listLength = 100;

				expect(helpers.isNudgable(index, listLength)).toBeTruthy();
			});

			it('should NOT show the nudge at 75 if the end of the list is 10 away', function() {
				var index = 75;
				var listLength = 85;

				expect(helpers.isNudgable(index, listLength)).toBeFalsy();
			});

			it('should NOT show the nudge at 75 if the end of the list is less than 10 away', function() {
				var index = 75;
				var listLength = 80;

				expect(helpers.isNudgable(index, listLength)).toBeFalsy();
			});

			it('should show the nudge at 75 if the end of the list is more than 10 away', function() {
				var index = 75;
				var listLength = 99;

				expect(helpers.isNudgable(index, listLength)).toBeTruthy();
			});

		});

		describe('tripStart()', function() {
			var now = new Date();
			now.setMonth(6);
			now.setDate(16);

			var past = new Date(now).setFullYear(1999),
				present = new Date(now),
				future = new Date(now).setFullYear(present.getFullYear() + 5),
				tripStart = helpers.dateHelpers.tripStart;

			it('should be defined', function() {
				expect(tripStart).toBeTruthy();
			});

			it('should display as "MMM D" without the year', function() {
				expect(tripStart(now)).toEqual("Jul 16");
			});

			it('should display as "MMM D, YYYY" with the year', function() {
				expect(tripStart(past)).toEqual("Jul 16, 1999");
			});

			it('should display the year if trip started before the current year', function() {
				expect(tripStart(past)).toMatch(/[0-9]{4}$/);
			});

			it('should not display the year if trip started or starts in the current year', function() {
				expect(tripStart(present)).not.toMatch(/[0-9]{4}$/);
			});

			it('should display the year if the trip does not start until after the current year', function() {
				expect(tripStart(future)).toMatch(/[0-9]{4}$/);
			});
		});

		describe('$.isInView()', function() {

			var mockApp, mockView;

			it("should exist", function() {
				expect($.fn.isInView).toBeDefined();
			});

			beforeEach(function() {
				mockView = document.createElement("div");
				mockApp = document.createElement("div");
				mockApp.id = "isInView";
				mockApp.innerHTML = "<div id='app-page'></div>";
				document.body.appendChild(mockApp);
			});

			afterEach(function() {
				document.body.removeChild(mockApp);
			});

			it("should return false when called on a view not in the document", function() {
				mockView.className = 'test1';

				expect($(mockView).isInView()).toBe(false);
			});

			it("should return false when passed a view not in the document", function() {
				mockView.className = 'test2';

				expect($.fn.isInView(mockView)).toBe(false);
			});

			it("should return true when called on a view that is in the document", function() {
				mockView.className = 'test3';
				document.getElementById("app-page").appendChild(mockView);

				expect($(mockView).isInView()).toBe(true);

				document.getElementById("app-page").removeChild(mockView);
			});

			it("should return true when passed a view that is in the document", function() {
				mockView.className = 'test4';
				document.getElementById("app-page").appendChild(mockView);

				expect($.fn.isInView(mockView)).toBe(true);

				document.getElementById("app-page").removeChild(mockView);
			});

		});

	});

	describe('flight helpers', function() {

		describe('next day arrival text', function() {
		});

	});

});
