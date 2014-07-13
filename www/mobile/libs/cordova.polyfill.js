(function() {
	window.device = {
		platform: ''
	};
	if (typeof window !== 'undefined') {
		window.Connection = {
			WIFI: 'wifi',
			NONE: 'none'
		};
		window.navigator.network = {
			connection: {
				type: window.navigator.onLine?window.Connection.WIFI:window.Connection.NONE
			}
		};
		var ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf("android") > -1) {
			window.device = {
				platform: 'Android',
				version: (function(ua) {
					if( ua.indexOf("android") >= 0 ) {
						return '' + parseFloat(ua.slice(ua.indexOf("android")+8));
					}
				})(ua)
			};

		}
		if (ua.indexOf("blackberry") > -1) {
			window.device.platform = 'Blackberry';
		}

		if (ua.match(/(ipad|iphone|ipod)/i)) {
			window.device = {
				platform: 'iPhone',
				version: (function() {
					var agent = window.navigator.userAgent,
						start = agent.indexOf( 'OS ' );
					if( ( agent.indexOf( 'iPhone' ) > -1 || agent.indexOf( 'iPad' ) > -1 ) && start > -1 ){
						return  '' + window.Number( agent.substr( start + 3, 3 ).replace( '_', '.' ) );
					}
					return '0';
				})()
			};
		}
	}
})();
