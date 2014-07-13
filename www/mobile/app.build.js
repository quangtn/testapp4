({
	dir: "../../stage/mobile",
	appDir: ".",
	baseUrl: "./app",
	removeCombined: true,
	skipDirOptimize: true,
	optimizeCss: "none",
	waitSeconds: 0,

	modules: [
		{ name: "main" }
	],

		paths: {
		// bower components
		'jquery': '../libs/bower_components/jquery/jquery',
		'jquery.placeholder': '../libs/bower_components/jquery-placeholder/jquery.placeholder',
		'jquery.cookie': '../libs/bower_components/jquery-cookie/jquery.cookie',
		'jquery.dotdotdot': '../libs/bower_components/jquery.dotdotdot/src/js/jquery.dotdotdot',
		'handlebars': '../libs/bower_components/handlebars/handlebars',
		'underscore': '../libs/bower_components/underscore/underscore',
		'backbone': '../libs/bower_components/backbone/backbone',
		'domReady': '../libs/bower_components/requirejs-domready/domReady',
		'text': '../libs/bower_components/requirejs-text/text',
		'async': '../libs/bower_components/requirejs-plugins/src/async',
		'i18n': '../libs/bower_components/requirejs-i18n/i18n',
		'kalendae': '../libs/bower_components/kalendae/build/kalendae',
		'machina': '../libs/bower_components/machina/lib/amd/machina',
		'swipe': '../libs/bower_components/swipe/swipe',
		'mobiscroll.core': '../libs/bower_components/mobiscroll/js/mobiscroll.core',
		'mobiscroll.datetime': '../libs/bower_components/mobiscroll/js/mobiscroll.datetime',

		// libraries
		'layoutmanager': '../libs/backbone/backbone.layoutmanager',
		'jquery-ajax-localstorage-cache': '../libs/jquery-ajax-localstorage-cache',
		'moment': '../libs/moment',
		'iscroll': '../libs/iscroll.patched',
		'analytics': '../libs/analytics',
		'timing': '../libs/timing/timing',
		'modernizr': '../libs/modernizr.custom',
		'local_storage_facade': '../libs/local_storage_facade',
		'session_storage_facade': '../libs/session_storage_facade',

		// common app code
		'models': 'models',
		'presenters': 'presenters',
		'collections': 'collections',
		'proxies': 'proxies',
		'parsers': 'parsers',
		'namespace': 'core/namespace',
		'mediator': 'core/mediator',
		'config': '../config/app_config',
		'helpers': 'core/helpers',

		// convenience paths
		'templates': '../templates',
        'strings': 'core/strings'
	},

	shim: {
		'timing': {
			exports: 'Timing'
		},
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['jquery', 'underscore'],
			exports: 'Backbone'
		},
		'handlebars': {
			exports: 'Handlebars'
		},
		'precompiled_templates': {
			deps: ['handlebars']
		},
		'layoutmanager': {
			deps: ['backbone']
		},
		'jquery.cookie': {
			deps: ['jquery']
		},
		'swipe': {
			exports: 'Swipe'
		},
		'iscroll': {
			exports: 'iScroll'
		},
		'kalendae': {
			exports: 'Kalendae'
		},
		'mobiscroll.datetime': {
			deps: ['mobiscroll.core']
		},
		'mobiscroll.core': {
			deps: ['jquery']
		},
		'jquery.dotdotdot': {
			deps: ['jquery']
		},
		'jquery-ajax-localstorage-cache': {
			deps: ['jquery']
		},
		'modernizr': {
			deps: ['jquery'],
			exports: 'Modernizr'
		}
	}

})
