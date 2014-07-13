require(['backbone', 'collections/trips', 'models/trip'],
	function(Backbone, TripCollection, Trip) {
		describe('TripCollection', function() {
			it('should handle the truth', function() {
				expect(true).toBeTruthy();
			});

			it('should exist', function() {
				expect(TripCollection).toBeTruthy();
			});

			it('should instantiate', function() {
				var x = new TripCollection();
				expect(x instanceof TripCollection).toBeTruthy();
				expect(x instanceof Backbone.Collection).toBeTruthy();
				expect(x.model === Trip).toBeTruthy();
			});

			it('should have invalidateCache', function() {
				var trips = new TripCollection();

				expect(trips.invalidateCache).toBeTruthy();
			});


			it('should defer to the proxy to invalidateCache', function() {
				var trips = new TripCollection();
				spyOn(trips.proxy, 'invalidateCache');

				trips.invalidateCache();

				expect(trips.proxy.invalidateCache).toHaveBeenCalled();
			});
		});
	});

