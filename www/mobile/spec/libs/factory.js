define([
	'underscore'
], function(
	_) {

	// https://gist.github.com/damncabbage/3365538
	// https://gist.github.com/trinonsense/9219151

	var Factory = {
		createFactoryMethod: function(Type) {
			var defaults = _.toArray(arguments).slice(1);

			return function() {
				var obj, objAttributes = [],
					overrides = arguments,
					collection = (defaults.length > overrides.length)? defaults : overrides;

				// dynamically gather object defaults and overrides
				for (var i = collection.length - 1; i >= 0; i--) {
					var attributes = _.extend({}, defaults[i], overrides[i]);
					objAttributes.unshift(attributes);
				}

				obj = Object.create(Type.prototype);	// set up prototype chain
				Type.apply(obj, objAttributes);			// call constructor on the new object
				return obj;
			};
		}
	};
	return Factory;
});