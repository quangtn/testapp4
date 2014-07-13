define([
	'collections/trips',
	'collections/following_trips',
	'text!fixtures/mock_following_trips_response.json'],
function(
	Trips,
	FollowingTrips,
	MockFollowingTripsResponse) {

	describe('Following Trips', function() {
		var collection,
			response = JSON.parse(MockFollowingTripsResponse);

		it('should initialize', function() {
			spyOn(Trips.prototype, 'initialize');

			collection = new FollowingTrips();

			expect(Trips.prototype.initialize).toHaveBeenCalled();
			expect(collection.proxy).toBeDefined();
			expect(collection.isFollowing).toBeTruthy();
		});

		it('should should parse', function() {
			var trips = collection.parse(response);
			expect(trips).toBeDefined();
		});
	});
});