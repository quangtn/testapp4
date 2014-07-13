define(['underscore', 'backbone', 'strings'],
	function(_, Backbone, t) {

		var WeatherParser = {

			parse: function(response) {
				this.clear({silent: true});

				return this.parseWeather(response);
			},

			/* Weather Parsing */

			parseWeather: function(data) {
				var weather = {};
				weather.location = this.parseWeatherLocation(data);
				this.parseWeatherSunRiseSet(weather, data);
				this.parseWeatherCurrentConditions(weather, data);
				this.parseWeatherCurrentForecast(weather, data);
				this.parseWeatherForecasts(weather, data);

				return weather;
			},

			parseWeatherLocation: function(data) {
				var state = data.location.state || null;
				var city = data.location.city || null;
				var country = data.location.country || null;

				return _.isEmpty(state) ? city + ', ' + country : city + ', ' + state;
			},

			parseWeatherSunRiseSet: function(weather, data) {
				var sunrise_data = data.location.astronomy.sunrise.date;
				var sunset_data = data.location.astronomy.sunset.date;
				var sun_rise = {};
				var sun_set = {};

				sun_rise.hour = parseInt(sunrise_data.hour, 10);
				sun_rise.min = parseInt(sunrise_data.min, 10);
				sun_rise.ampm = sunrise_data.ampm;

				sun_set.hour = parseInt(sunset_data.hour, 10);
				sun_set.min = parseInt(sunset_data.min, 10);
				sun_set.ampm = sunset_data.ampm;

				weather.sun_rise = sun_rise;
				weather.sun_set = sun_set;
			},

			parseWeatherCurrentConditions: function(weather, data) {
				var current_conditions_data = data.location.current_conditions;
				var current_conditions = {};

				current_conditions.celsius = current_conditions_data.temperature.celsius + '&deg;C';
				current_conditions.fahrenheit = current_conditions_data.temperature.fahrenheit + '&deg;F';
				current_conditions.icon = 'touch/img/weather/' + current_conditions_data.icon + '.gif';
				current_conditions.icon_style = current_conditions_data.icon;
				current_conditions.wind_direction = current_conditions_data.wind.direction;
				current_conditions.wind_kph = Math.floor(current_conditions_data.wind.kph) + ' kph';
				current_conditions.wind_mph = Math.floor(current_conditions_data.wind.mph) + ' mph';
				current_conditions.visibility_km = current_conditions_data.visibility.km + ' km';
				current_conditions.visibility_sm = current_conditions_data.visibility.sm + ' miles';
				current_conditions.humidity = current_conditions_data.humidity;
				current_conditions.condition = current_conditions_data.conditions_full;
				current_conditions.hour = parseInt(current_conditions_data.date.hour, 10);
				current_conditions.min = parseInt(current_conditions_data.date.min, 10);
				current_conditions.ampm = current_conditions_data.date.ampm;
				weather.current_conditions = current_conditions;
				weather.updated_at = current_conditions_data.date.pretty_short;
			},

			parseWeatherCurrentForecast: function(weather, data) {
				var current_forecast = {};
				var simple_forecast_data = data.location.simpleforecast;
				var forecast_data = simple_forecast_data[0][0];

				current_forecast.high_fahrenheit = forecast_data.high.fahrenheit + '&deg;F';
				current_forecast.high_celsius = forecast_data.high.celsius + '&deg;C';
				current_forecast.low_fahrenheit = forecast_data.low.fahrenheit + '&deg;F';
				current_forecast.low_celsius = forecast_data.low.celsius + '&deg;C';
				weather.current_forecast = current_forecast;
			},

			parseWeatherForecasts: function(weather, data) {
				var forecasts = [];
				var monthArray = [t.Jan, t.Feb, t.Mar, t.Apr, t.May, t.Jun, t.Jul, t.Aug, t.Sep, t.Oct, t.Nov, t.Dec];
				var simple_forecast_data = data.location.simpleforecast;
				_.each(simple_forecast_data, function(forecasts_data) {
					var forecast = {};
					var forecast_data = forecasts_data[0];

					forecast.day = forecast_data.date.weekday;
					forecast.monthAndDay = monthArray[forecast_data.date.month - 1] + '&nbsp;' + forecast_data.date.day;
					forecast.high_fahrenheit = forecast_data.high.fahrenheit + '&deg;';
					forecast.high_celsius = forecast_data.high.celsius + '&deg;';
					forecast.low_fahrenheit = forecast_data.low.fahrenheit + '&deg;';
					forecast.low_celsius = forecast_data.low.celsius + '&deg;';
					forecast.icon = 'touch/img/weather/' + forecast_data.icon + '.gif';
					forecast.icon_style = forecast_data.icon;
					forecast.precipitation_chance = forecast_data.pop + '%';
					forecast.condition = forecast_data.conditions;
					forecasts.push(forecast);
				});
				weather.forecasts = forecasts;
			}

		};

		return WeatherParser;
	}
);