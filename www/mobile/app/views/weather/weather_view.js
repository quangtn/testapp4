define(['namespace', 'jquery', 'underscore', 'backbone',
	'views/weather/weather_now_view', 'views/weather/weather_forecast_list_view',
	'layoutmanager'],
	function(app, $, _, Backbone, NowView, ForecastListView) {

		var WeatherView = Backbone.View.extend({

			className: 'weather-panel',

			template: 'weather/weather',

			storageKeyName: 'WEATHER_FAHRENHEIT_ON',

			initialize: function(params) {
				_.bindAll(this);

				this.weatherOptions = params.options;
				this.model.on('change', function() {
					if (this.model.get('isFahrenheit') === undefined) {
						this.model.set({isFahrenheit: this._unitsGet()}, {silent: true});
					}
					this.render();
				}, this);
			},

			render: function(layout) {
				var view = layout(this);
				var self = this;
				var rc;

				if (this.model.has('current_conditions')) {
					this.nowView = new NowView({
						model: this.model,
						options: this.weatherOptions
					});
					this.nowView.on('weather_units:change', function(isFahrenheit) {
						self._unitsSave(isFahrenheit);
						self.model.set({isFahrenheit: isFahrenheit});
					});
					view.insert('#weather-now', this.nowView);

					this.forecastView = new ForecastListView({
						model: this.model,
						options: this.weatherOptions
					});
					view.insert('#weather-forecast', this.forecastView);
				}

				rc = view.render().then(function() {
					if (self.nowView) {
						self.nowView.trigger('afterrender');
					}
				});

				return rc;
			},

			serialize: function() {
				return this.model.toJSON();
			},

			_unitsGet: function() {
				var isFahrenheit = true;
				var fahrenheitValue;

				if (!app.privateBrowsing) {
					fahrenheitValue = localStorage.getItem(this.storageKeyName);
					if (fahrenheitValue) {
						isFahrenheit = fahrenheitValue === 'true';
					} else {
						isFahrenheit = true;
					}
				}
				return isFahrenheit;
			},

			_unitsSave: function(isFahrenheit) {
				if (!app.privateBrowsing) {
					localStorage.setItem(this.storageKeyName, isFahrenheit);
				}
			}
		});

		return WeatherView;
	}
);