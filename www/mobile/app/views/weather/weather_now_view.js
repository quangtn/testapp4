define(['namespace', 'jquery', 'underscore', 'backbone', 'analytics', 'layoutmanager'],
	function(app, $, _, Backbone, Analytics) {

		var WeatherNowView = Backbone.View.extend({

			className: 'now-pane',

			template: 'weather/weather_now',

			events: {
				'click #weather-units': 'onUnitsToggle'
			},

			initialize: function(params) {
				this.weatherOptions = params.options;
				_.bindAll(this);
				this.on('afterrender', this.afterrender, this);

				this.model.on('change', function() {
					this.render();
				}, this);
			},

			afterrender: function() {
				var $unitsToggle = $('#weather-units');

				$unitsToggle.prop('checked', this.model.get('isFahrenheit'));
			},

			onUnitsToggle: function() {
				var isChecked = $('#weather-units').prop('checked');

				if (isChecked === true) {
					Analytics.trackEvent('Weather', 'ToFahrenheit', app);
				} else {
					Analytics.trackEvent('Weather', 'ToCelsius', app);
				}

				this.trigger('weather_units:change', isChecked);
			},

			render: function(manage) {
				return manage(this).render();
			},

			serialize: function() {
				var dataContext = this.model.toJSON();

				_.extend(dataContext, this._viewHelper());

				return dataContext;
			},

			_viewHelper: function() {
				var helper = {};

				if (this.model.get('current_conditions')) {
					helper.weatherCurrentIconUrl = this._getWeatherCurrentIconUrl();
					helper.generalLocation = this._getGeneralLocation();
				}

				return helper;
			},

			_getWeatherCurrentIconUrl: function() {
				var prefix, url;
				var isCurrentTimeWithinSunRise = this._currentTimeWithinSunRise();
				var isCurrentTimewithinSunSet = this._currentTimeWithinSunSet();

				if (isCurrentTimeWithinSunRise && isCurrentTimewithinSunSet) {
					// daytime shows standard sunny icon
					prefix = '';
				} else {
					// nighttime shows moon version of icon
					prefix = 'nt_';
				}
				url = prefix + this.model.get('current_conditions').icon_style + '_c';

				return url;
			},

			_currentTimeWithinSunRise: function() {
				var rc = false;
				var curMinutes = this._totalMinutes(this.model.get('current_conditions').hour,
																						this.model.get('current_conditions').min);
				var sunRiseMinutes = this._totalMinutes(this.model.get('sun_rise').hour,
																								this.model.get('sun_rise').min);

				if (curMinutes >= sunRiseMinutes) {
					rc  = true;
				}
				return rc;
			},

			_currentTimeWithinSunSet: function() {
				var rc = false;
				var curMinutes = this._totalMinutes(this.model.get('current_conditions').hour,
																						this.model.get('current_conditions').min);
				var sunSetMinutes = this._totalMinutes(this.model.get('sun_set').hour,
																								this.model.get('sun_set').min);

				if (curMinutes <= sunSetMinutes) {
					rc = true;
				}
				return rc;
			},

			_totalMinutes: function(hours, minutes) {
				var totalMinutes = (hours * 60) + minutes;

				return totalMinutes;
			},

			_getGeneralLocation: function() {
				var locale;

				if (this.weatherOptions && this.weatherOptions.generalLocation) {
					locale = this.weatherOptions.generalLocation;
				} else {
					locale = this.model.get('location');
				}

				return locale;
			}

		});

		return WeatherNowView;
	}
);