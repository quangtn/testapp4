define(['namespace', 'jquery', 'underscore', 'backbone', 'mediator', 'controllers/controller',
	'views/weather/weather_view', 'models/weather', 'trips_manager',
	'workflows/pick_location_workflow', 'strings', 'analytics',
	'layoutmanager'],
	function(app, $, _, Backbone, mediator, Controller,
		WeatherView, WeatherModel, TripsManager,
		selectLocationWorkflow, t, Analytics) {

		var WeatherController = Controller.extend({
			initialize: function() {
				_.bindAll(this);

				mediator.subscribe('weather:show', this.onShow, this);
				mediator.subscribe('weather:pick_location', this.onShowLocationPicker, this);
			},

			onShow: function(params) {
				this._layout = app.getLayout('simple_with_loading');
				this.changeURL('weather');

				this.tripWeatherData = this._getTripData(params);
				this.model = new WeatherModel(this.tripWeatherData);
				this.fetchAndRender();
			},

			_getTripData: function(params) {
				var curTrip, tripItem, tripItemId;
				var location, airportCode, lat, lng;
				var weatherParams = {};

				curTrip = TripsManager.getCurrentTrip();
				tripItemId = this._getTripItemId(params);
				tripItem = curTrip.tripItems.get(tripItemId);
				location = tripItem.getMapLocation();

				airportCode = location.get('airport_code');
				weatherParams.generalLocation = this._getGeneralLocation(location, tripItem, curTrip);
				if (airportCode !== undefined) {
					weatherParams.airport_code = airportCode;
				} else {
					lat = location.get('lat');
					lng = location.get('lng');
					if ((lat !== undefined) && (lng !== undefined)) {
						weatherParams.lat = location.get('lat');
						weatherParams.lng = location.get('lng');
					}
				}

				return weatherParams;
			},

			_getGeneralLocation: function(location, tripItem, trip) {
				var generalLocation;
				var locationGeneral, itemGeneral, tripAirGeneral, airportCode, tripAirMatcher;

				if (location) {
					locationGeneral = location.get('general_location');
				}
				if (tripItem) {
					itemGeneral = tripItem.get('arrival_airport_general_location');
				}
				if (trip) {
					airportCode = location.get('airport_code');
					tripAirMatcher = trip.tripItems.find(function(tripItem) {
						var rc = false;
						var itemAirportCode = tripItem.get('arrival_airport_code');
						if (airportCode === itemAirportCode) {
							rc = true;
						}
						return rc;
					});
					if (tripAirMatcher) {
						tripAirGeneral = tripAirMatcher.get('arrival_airport_general_location');
					}
				}

				generalLocation = tripAirGeneral || locationGeneral || itemGeneral || '';
				return generalLocation;
			},

			_getTripItemId: function(params) {
				var itemId;

				if (params === undefined) {
					itemId = this._getCurrentTripRelevantItemId();
				} else {
					itemId = params.tripItemId;
				}

				return itemId;
			},

			_getCurrentTripRelevantItemId: function() {
				var curTrip = TripsManager.getCurrentTrip();
				var itemIndex = 0, itemId;

				if (curTrip.isActive()) {
					itemIndex = curTrip.get('most_relevant_item');
				}
				itemId = curTrip.tripItems.at(itemIndex).id;

				return itemId;
			},

			fetchAndRender: function() {
				this._setHeader();
				if (this.hasValidParams()) {
					this.view = null;
					this.setView(this.view = new WeatherView({
						model: this.model,
						options: this.tripWeatherData
					}));
					$('.content').empty();
					this.model.fetch();
				}
			},

			hasValidParams: function() {
				var rc = false;

				if (this.model.has('airport_code')) {
					rc = true;
				} else if (this.model.has('lat') && this.model.has('lng')) {
					rc = true;
				}

				return rc;
			},

			_setHeader: function() {
				this._updateHeader(t.Weather, 'back:history', {
					rightButtons: [{
						name: 'weather-location text-button',
						action: 'weather:pick_location',
						text: t.Locations
					}]
				});
			},

			simpleReRender: function() {
				this.view.render();
				this._setHeader();
			},

			onSelectLocationComplete: function(params) {
				var airportCode, lat, lng;
				var curTrip;

				curTrip = TripsManager.getCurrentTrip();

				this.model.clear({silent: true});
				this._layout = app.getLayout('simple_with_loading');

				airportCode = params.location.get('airport_code');
				this.tripWeatherData.generalLocation = this._getGeneralLocation(params.location, null, curTrip);
				if (airportCode === undefined) {
					lat = params.location.get('lat');
					lng = params.location.get('lng');
					if ((lat !== undefined) && (lng !== undefined)) {
						this.model.set({
							lat: params.location.get('lat'),
							lng: params.location.get('lng')
						});
					}
				} else {
					this.tripWeatherData.airport_code = airportCode;
					this.model.set({airport_code: airportCode});
				}
				this.fetchAndRender();
				//machina requires explicit handler function to remove event
				//removing event to avoid zombie handlers - fixes zombie handler issue
				selectLocationWorkflow.off('complete', this.onSelectLocationComplete);
				selectLocationWorkflow.off('cancel', this.onSelectLocationCancel);
			},

			onSelectLocationCancel: function() {
				this._layout=app.getLayout('simple_with_loading');
				//setting view with new view -- layout manager has quirks with stale view --
				//fixes issue with slow rendering.  TODO: research why
				this.setView(this.view = new WeatherView({model: this.model}));
				this.simpleReRender();
				//machina requires explicit handler function to remove event
				//removing event to avoid zombie handlers - fixes zombie handler issue
				selectLocationWorkflow.off('complete', this.onSelectLocationComplete);
				selectLocationWorkflow.off('cancel', this.onSelectLocationCancel);
			},

			onShowLocationPicker: function() {
				this._layout = app.getLayout('simple');
				selectLocationWorkflow.handle('initialize', {
					controller: this,
					listHeaderText: t.WeatherNearTripItem,
					showOnlyItems: true
				});

				//machina requires explicit handler function to remove event
				//removing event to avoid zombie handlers - fixes zombie handler issue
				selectLocationWorkflow.off('complete', this.onSelectLocationComplete);
				selectLocationWorkflow.off('cancel', this.onSelectLocationCancel);
				selectLocationWorkflow.on('complete', this.onSelectLocationComplete);
				selectLocationWorkflow.on('cancel', this.onSelectLocationCancel);

				Analytics.trackEvent('Weather', 'LocationPicker', app, TripsManager.getCurrentTripId());
			}

		});

		return WeatherController;
	}
);