require([
    'model/trip_item', 'parsers/trip_item_parser', 'text!fixtures/mock_generic_item_response.json'
],
function(TripItem, TripItemParser, MockGenericItemResponse) {
    describe('Trip Item Parser', function() {
        var response, tripItem;

        beforeEach(function() {
            tripItem = new TripItem();
            response = JSON.parse(MockGenericItemResponse);
        });

        it("parses change event data for a specified key", function() {
            var changeEventData,
                hasEvent;

            changeEventData = [{
                '@name': 'event',
                'name': 'a_specified_key'
            }];

            hasEvent = TripItemParser._hasChangeEventsFor(changeEventData, 'a_specified_key');
            expect(hasEvent).toBe(true);
        });

        it("parses change event data for a missing key", function() {
            var changeEventData,
                hasEvent;

            changeEventData = [{
                '@name': 'event',
                'name': 'a_specified_key'
            }];

            hasEvent = TripItemParser._hasChangeEventsFor(changeEventData, 'a_missing_key');
            expect(hasEvent).toBe(false);
        });

        it('should parse trip item', function() {
            tripItem.parse(response);

            expect(tripItem.get('id')).toBe(2);
            expect(tripItem.get('type')).toBe('Generic');
            expect(tripItem.get('read_only')).toBeFalsy();
            expect(tripItem.get('for_business')).toBeTruthy();
            expect(tripItem.get('corporation')).toBe('TestCorpUS');
        });
    });
});