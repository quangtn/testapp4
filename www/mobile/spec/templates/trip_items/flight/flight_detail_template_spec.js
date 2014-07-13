require([
    'jquery', 'handlebars', 'text!templates/trip_items/flight/flight_detail.tmpl'
],

function($, Handlebars, template) {

    describe("baggage claim", function() {
        it("has an alert for baggage claim change", function() {
            var tmpl, html, $el;

            tmpl = Handlebars.compile(template);
            html = tmpl({
                'air_reservations' : [{
                    'baggage_claim_change' : true,
                    'baggage_claim' : 'the baggage claim'
                }]
            });
            $el = $(html);

            expect($el.find(".alert:contains('the baggage claim')").length).toEqual(1);
        });

        it("has no alert for baggage claim if there's no change", function() {
            var tmpl, html, $el;

            tmpl = Handlebars.compile(template);
            html = tmpl({
                'air_reservations' : [{
                    'baggage_claim_change' : false,
                    'baggage_claim' : 'the baggage claim'
                }]
            });
            $el = $(html);

            expect($el.find(".alert:contains('the baggage claim')").length).toEqual(0);
        });
    });

});

