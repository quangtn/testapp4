define(['proxies/proxy'],
function(Proxy) {

	var WeatherProxy = Proxy.extend({

		syncConfig: function(method, options) {
			this.url = '/mapi/services/airport_weather.json';
		}

	});

	return WeatherProxy;

});
