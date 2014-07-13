var RuntimeErrorHandler = function(options) {
	this.onErrorHandler = this.onErrorHandler.bind(this);

	this.config = {
		endpoint: "/mapi/services/report_error.json",
		requestHeaders: {
			"Content-type": "application/json;charset=UTF-8"
		},
		xhrMethod: "POST",
		async: true,
		failOnError: false,
		extend: function(options) {
			for (var option in options) {
				if (typeof options[option] === "function") {
					continue;
				}
				this[option] = options[option];
			}
		}
	};

	if (options) {
		this.config.extend(options);
	}
};

RuntimeErrorHandler.prototype.request = function() {
	var xhr = new XMLHttpRequest(),
		config = this.config;

	xhr.open(config.xhrMethod, config.endpoint, config.async);

	for (var header in config.requestHeaders) {
		var value = config.requestHeaders[header];
		xhr.setRequestHeader(header, value);
	}

	return xhr;
};

RuntimeErrorHandler.prototype.onErrorHandler = function (message, url, line) {
	var request = this.request(),
		data = JSON.stringify({
			error: message,
			file: url,
			lineNumber: line,
			additionalData: this.getAdditionalErrorData()
		});

	request.send(data);

	return (this.config.failOnError) ? false : true;
};

RuntimeErrorHandler.prototype.getAdditionalErrorData = function() {
	return {
		platform: (window.location.href.match(/^file/i)) ? "app" : "tdot",
		screenHeight: window.innerHeight || document.documentElement.clientHeight,
		screenWidth: window.innerWidth || document.documentElement.clientWidth
	};
};


