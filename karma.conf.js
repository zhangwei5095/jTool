module.exports = function(config) {
	config.set({
		frameworks: ['browserify', 'jasmine-ajax', 'jasmine'],
		files: [
			'src/**/*.js',
			'test/**/*_spec.js'
		],
		preprocessors: {
			'test/**/*.js': ['jshint', 'browserify'],
			'src/**/*.js': ['jshint', 'browserify']
		},
		browsers: ['phantomjs'],
		browserify: {
			debug: true,
			bundleDelay: 2000 // Fixes "reload" error messages, YMMV!
		},
		singleRun: true,
		concurrency: Infinity
	});
};
