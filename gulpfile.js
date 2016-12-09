(function() {
	var gulp 		= require("gulp"),
	    spawn       = require('child_process').spawn,
		server 		= require("gulp-develop-server"),
		buildConfig	= require('./server/buildConfig.js'),
		_ 			= require("underscore");

	// Build config file
	gulp.task("server:config", buildConfig);

	// Server start
	gulp.task("server:start", function() {
	    spawn('npm', ['start'], {stdio: 'inherit'}); // set the typescript compilation process going
	    server.listen({path: './output/main.js'});
	});

	// Server kill
	gulp.task("server:restart", function() {
		server.restart();
	});

	// WATCH
	// =====
	// Run the server unit tests just once, then run the server itself
	gulp.task("default", ["server:start"], function() {
		// watch for config files, and regenerate the big config file on save
		// gulp.watch(["server/lib/**/*.config.json"], ["server:config"]);
		// Watch for saving files and restart server
		gulp.watch(["output/*.js", "output/**/*.js", "server/*.json", "server/**/*.json", "server/**/**/*.json"], ["server:restart"]);
	});
})();