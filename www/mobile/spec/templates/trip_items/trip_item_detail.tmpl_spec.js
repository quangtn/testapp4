require(['handlebars', 'text!templates/trip_items/trip_item_detail.tmpl'], function(Handlebars, template) {

    describe('worldmate attribution', function() {
        it('should show attribution div if trip was parsed by worldmate', function() {
            var tmpl = Handlebars.compile(template);
            var html = tmpl({
                'isWorldMate' : true,
                'start_location' : {
                    'label' : 'asdf',
                    'address_lines' : ''
                }
            });

            expect(html).toMatch(/<div id="worldmate" class="wm"><\/div>/);
        });
    });

});

