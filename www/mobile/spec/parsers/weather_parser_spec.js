require(['namespace', 'backbone', 'underscore',
	'text!fixtures/mock_weather_response.json',
	'parsers/weather_parser'
],
	function(app, Backbone, _, MockWeatherResponseString, WeatherParser) {

		describe('Weather Parser', function() {

			var mockWeatherResponse, weatherModel;

			beforeEach(function() {
				mockWeatherResponse = JSON.parse(MockWeatherResponseString);

				weatherModel = new Backbone.Model();
				_.extend(weatherModel, WeatherParser);

				weatherModel.set(weatherModel.parse(mockWeatherResponse));
			});

			afterEach(function() {
				mockWeatherResponse = null;
				weatherModel = null;
			});

			it('can create application objects for testing', function() {
				expect(MockWeatherResponseString).toBeDefined();
				expect(WeatherParser).toBeDefined();

				expect(mockWeatherResponse).toBeDefined();
				expect(weatherModel).toBeDefined();
				expect(weatherModel.parse).toBeDefined();
			});

			it('can parse current conditions', function() {
				expect(weatherModel.get('current_conditions').ampm).toEqual('AM');
				expect(weatherModel.get('current_conditions').celsius).toEqual('9&deg;C');
				expect(weatherModel.get('current_conditions').condition).toEqual('Scattered Clouds');
				expect(weatherModel.get('current_conditions').fahrenheit).toEqual('49&deg;F');
				expect(weatherModel.get('current_conditions').hour).toEqual(11);
				expect(weatherModel.get('current_conditions').humidity).toEqual('50%');
				expect(weatherModel.get('current_conditions').icon).toEqual('touch/img/weather/partlycloudy.gif');
				expect(weatherModel.get('current_conditions').icon_style).toEqual('partlycloudy');
				expect(weatherModel.get('current_conditions').min).toEqual(53);
				expect(weatherModel.get('current_conditions').visibility_km).toEqual('16.1 km');
				expect(weatherModel.get('current_conditions').visibility_sm).toEqual('10.0 miles');
				expect(weatherModel.get('current_conditions').wind_direction).toEqual('NNE');
				expect(weatherModel.get('current_conditions').wind_kph).toEqual('20 kph');
				expect(weatherModel.get('current_conditions').wind_mph).toEqual('13 mph');
			});

			it('can parse current forecast', function() {
				expect(weatherModel.get('current_forecast').high_celsius).toEqual('9&deg;C');
				expect(weatherModel.get('current_forecast').high_fahrenheit).toEqual('48&deg;F');
				expect(weatherModel.get('current_forecast').low_celsius).toEqual('2&deg;C');
				expect(weatherModel.get('current_forecast').low_fahrenheit).toEqual('36&deg;F');
			});

			it('can parse forecasts', function() {
				var forecast;

				expect(weatherModel.get('forecasts').length).toEqual(10);
				expect(weatherModel.get('forecasts')[10]).not.toBeDefined();

				forecast = weatherModel.get('forecasts')[0];
				expect(forecast.condition).toEqual('Chance of Rain');
				expect(forecast.day).toEqual('Tuesday');
				expect(forecast.high_celsius).toEqual('9&deg;');
				expect(forecast.high_fahrenheit).toEqual('48&deg;');
				expect(forecast.icon).toEqual('touch/img/weather/partlycloudy.gif');
				expect(forecast.icon_style).toEqual('partlycloudy');
				expect(forecast.low_celsius).toEqual('2&deg;');
				expect(forecast.low_fahrenheit).toEqual('36&deg;');
				expect(forecast.monthAndDay).toEqual('Feb&nbsp;19');
				expect(forecast.precipitation_chance).toEqual('20%');

				forecast = weatherModel.get('forecasts')[5];
				expect(forecast.condition).toEqual('Chance of Rain');
				expect(forecast.day).toEqual('Sunday');
				expect(forecast.high_celsius).toEqual('7&deg;');
				expect(forecast.high_fahrenheit).toEqual('45&deg;');
				expect(forecast.icon).toEqual('touch/img/weather/chancerain.gif');
				expect(forecast.icon_style).toEqual('chancerain');
				expect(forecast.low_celsius).toEqual('3&deg;');
				expect(forecast.low_fahrenheit).toEqual('37&deg;');
				expect(forecast.monthAndDay).toEqual('Feb&nbsp;24');
				expect(forecast.precipitation_chance).toEqual('40%');

				forecast = weatherModel.get('forecasts')[9];
				expect(forecast.condition).toEqual('Chance of Rain');
				expect(forecast.day).toEqual('Thursday');
				expect(forecast.high_celsius).toEqual('11&deg;');
				expect(forecast.high_fahrenheit).toEqual('52&deg;');
				expect(forecast.icon).toEqual('touch/img/weather/mostlycloudy.gif');
				expect(forecast.icon_style).toEqual('mostlycloudy');
				expect(forecast.low_celsius).toEqual('7&deg;');
				expect(forecast.low_fahrenheit).toEqual('45&deg;');
				expect(forecast.monthAndDay).toEqual('Feb&nbsp;28');
				expect(forecast.precipitation_chance).toEqual('20%');
			});

			it('can parse location', function() {
				expect(weatherModel.get('location')).toEqual('Seatac, WA');
			});

			it('can parse sun rise', function() {
				expect(weatherModel.get('sun_rise').ampm).toEqual('AM');
				expect(weatherModel.get('sun_rise').hour).toEqual(7);
				expect(weatherModel.get('sun_rise').min).toEqual(7);
			});

			it('can parse sun set', function() {
				expect(weatherModel.get('sun_set').ampm).toEqual('PM');
				expect(weatherModel.get('sun_set').hour).toEqual(17);
				expect(weatherModel.get('sun_set').min).toEqual(39);
			});

			it('can parse updated', function() {
				expect(weatherModel.get('updated_at')).toEqual('11:53 AM PST');
			});



		});
	});