define(['namespace', 'jquery', 'underscore', 'backbone'],
	function(app, $, _, Backbone) {

		var WeatherForecastListView = Backbone.View.extend({

			className: 'forecast-pane',
			template: 'weather/weather_forecast_list',

			initialize: function(params) {
				this.weatherOptions = params.options;

				this.model.on('change', function() {
					this.render();
				}, this);
			},

			render: function(manage) {
				return manage(this).render();
			},

			serialize: function() {
				var dataContext = this.model.get('forecasts');
				var i;

				if (dataContext) {
					for (i = 0; i < dataContext.length; i++) {
						dataContext[i].isFahrenheit = this.model.get('isFahrenheit');
					}
				}
				return dataContext;
			}
		});

		return WeatherForecastListView;
	}
);