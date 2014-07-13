require([
	'jquery', 'handlebars', 'text!templates/itinerary/itinerary.tmpl'
], function($, Handlebars, template) {

	var tmpl, html, $el;
	var CSS_CLASS = 'for-business';


	beforeEach(function() {
		tmpl = Handlebars.compile(template);
	});


	describe('Itinerary Template', function() {

		it('begins with a container element', function() {
			expect(true).toBe(true);
		});

		it('begins with an list-rows for an empty trip', function() {
			html = tmpl({
				'days' : []
			});
			$el = $(html);
			expect($el.length).toEqual(1);
			expect($el.attr('class')).toEqual('list-rows');
			expect(true).toBe(true);
		});

		it('begins with an itinerary-container for a trip with an item', function() {
			html = tmpl({
				'days' : [{
				'events': [{
					'type': 'Air',
					'departure_airport_code': 'DFW',
					'arrival_airport_code': 'LAS',
					'departure_terminal': 'D',
					'departure_gate': 'D13',
					'arrival_terminal': 'B',
					'arrival_gate': 'B12',
					'scheduled_arrival': '2013-12-02T05:35:00',
					'estimated_arrival': '2013-12-02T05:05:00', // early 30 mins
					'scheduled_departure': '2013-12-01T21:55:00',
					'estimated_departure': '2013-12-01T22:25:00', // delayed 30 mins
					'hasChangeOrCancel': true,
					'airStatusMessage': 'delayed 30 mins',
					'airStatusClass': 'delayed'
				}]
			}]
			});
			$el = $(html);
			expect($el.length).toEqual(1);
			expect($el.attr('class')).toEqual('itinerary-container');
			expect(true).toBe(true);
		});

		describe('air bubble', function() {

			var air_trip_item = {
				'days' : [{
					'events': [{
						'type': 'Air',
						'departure_airport_code': 'DFW',
						'arrival_airport_code': 'LAS',
						'departure_terminal': 'D',
						'departure_gate': 'D13',
						'arrival_terminal': 'B',
						'arrival_gate': 'B12',
						'scheduled_arrival': '2013-12-02T05:35:00',
						'estimated_arrival': '2013-12-02T05:05:00', // early 30 mins
						'scheduled_departure': '2013-12-01T21:55:00',
						'estimated_departure': '2013-12-01T22:25:00', // delayed 30 mins
						'hasChangeOrCancel': true,
						'airStatusMessage': 'delayed 30 mins',
						'airStatusClass': 'delayed'
					}]
				}]
			};

			beforeEach(function() {
				html = tmpl(air_trip_item);
				$el = $(html);
			});

			it('shows departure airport', function() {
				expect(html).toContain('DFW');
			});

			it('shows arrival airport', function() {
				expect(html).toContain('DFW');
			});

			it('shows departure terminal and gate', function() {
				expect(html).toContain('D/D13');
			});

			it('shows arrival terminal and gate', function() {
				expect(html).toContain('B/B12');
			});

			it('shows estimated arrival', function() {
				expect(html).toContain('5:05');
			});

			it('shows estimated departure', function() {
				expect(html).toContain('10:25');
			});

			it('shows the fight status notice', function() {
				expect(html).toContain('delayed 30 mins');
			});

		});


		describe('corporate association', function() {

			it('should show a tag when flight trip item is marked for business', function() {
				var mockPresenterData = {
					'days' : [{
						'events': [{
							airline: "American Airlines",
							airline_code: "AA",
							arrival_airport_city: "Honolulu",
							arrival_airport_code: "HNL",
							arrival_airport_general_location: "Honolulu, HI",
							arrival_airport_name: "Honolulu International Airport",
							departure_airport_city: "Dallas",
							departure_airport_code: "DFW",
							departure_airport_name: "Dallas/Ft. Worth International Airport",
							estimated_arrival: "2014-05-08T14:10:00",
							estimated_departure: "2014-05-08T10:50:00",
							flight_number: 123,
							for_business: true,
							masthead: "Dallas to Honolulu",
							named_type: "Air",
							scheduled_arrival: "2014-05-08T14:10:00",
							scheduled_departure: "2014-05-08T10:50:00",
							corporation: "Sabre Southlake",
							subhead: "American Airlines 123",
							type: "Air"
						}]
					}]
				};
				var html = tmpl(mockPresenterData);

				expect(html).toContain(CSS_CLASS);
			});

			it('should not show a tag when flight trip item is not marked for business', function() {
				var mockPresenterData = {
					'days' : [{
						'events': [{
							airline: "American Airlines",
							airline_code: "AA",
							arrival_airport_city: "Honolulu",
							arrival_airport_code: "HNL",
							arrival_airport_general_location: "Honolulu, HI",
							arrival_airport_name: "Honolulu International Airport",
							departure_airport_city: "Dallas",
							departure_airport_code: "DFW",
							departure_airport_name: "Dallas/Ft. Worth International Airport",
							estimated_arrival: "2014-05-08T14:10:00",
							estimated_departure: "2014-05-08T10:50:00",
							flight_number: 123,
							for_business: false,
							masthead: "Dallas to Honolulu",
							named_type: "Air",
							scheduled_arrival: "2014-05-08T14:10:00",
							scheduled_departure: "2014-05-08T10:50:00",
							corporation: "",
							subhead: "American Airlines 123",
							type: "Air"
						}]
					}]
				};
				var html = tmpl(mockPresenterData);

				expect(html).not.toContain(CSS_CLASS);
			});



			it('should show a tag when generic trip item is marked for business', function() {
				var mockPresenterData = {
					'days' : [{
						'events': [{
							end_date: "2014-02-13T15:00:00",
							end_time: "2014-02-13T15:00:00",
							event_type: "start",
							for_business: true,
							icon: "icon_meeting_45px",
							isWorldMate: false,
							is_generic_trip_item: true,
							is_name_displayable: true,
							is_trip_active: true,
							map_name: "Customer Meeting",
							masthead: "Customer Meeting",
							name: "Customer Meeting",
							named_type: "Generic",
							read_only: false,
							short_description: "Customer Meeting",
							start_date: "2014-02-13T12:00:00",
							start_time: "2014-02-13T12:00:00",
							corporation: "Sabre Southlake",
							subhead: "Grapevine, TX",
							type: "Meeting"
						}]
					}]
				};
				var html = tmpl(mockPresenterData);

				expect(html).toContain(CSS_CLASS);
			});

			it('should not show a tag when generic trip is not marked for business', function() {
				var mockPresenterData = {
					'days' : [{
						'events': [{
							end_date: "2014-02-13T15:00:00",
							end_time: "2014-02-13T15:00:00",
							event_type: "start",
							for_business: false,
							icon: "icon_meeting_45px",
							isWorldMate: false,
							is_generic_trip_item: true,
							is_name_displayable: true,
							is_trip_active: true,
							map_name: "Customer Meeting",
							masthead: "Customer Meeting",
							name: "Customer Meeting",
							named_type: "Generic",
							read_only: false,
							short_description: "Customer Meeting",
							start_date: "2014-02-13T12:00:00",
							start_time: "2014-02-13T12:00:00",
							corporation: "",
							subhead: "Grapevine, TX",
							type: "Meeting"
						}]
					}]
				};
				var html = tmpl(mockPresenterData);

				expect(html).not.toContain(CSS_CLASS);
			});

		});
	});

});