(function() {
	var gulp 		= require("gulp"),
		mocha 		= require("gulp-mocha"),
		server 		= require("gulp-develop-server"),
		buildConfig	= require('./server/buildConfig.js');
		
	// Server unit tests
	gulp.task("server:tests", function () {
  		return gulp.src('./server/tests/**/*.js')
				.pipe(mocha());
	});
	
	// Build config file
	gulp.task("server:config", buildConfig);
	
	// Server start
	gulp.task("server:start", function() {
	    server.listen({path: './server/main.js'});
	});
	
	// Server kill
	gulp.task("server:restart", function() {
		server.restart();
	});

	// WATCH
	// =====
	// Run the server unit tests just once, then run the server itself
	gulp.task("watch", ["server:tests", "server:start"], function() {
		// watch for config files, and regenerate the big config file on save
		gulp.watch(["server/lib/**/*.config.json"], ["server:config"]);
		// Watch for saving files and restart server
		gulp.watch(["server/*.js", "server/**/*.js", "server/**/**/*.js", "server/*.json", "server/**/*.json", "server/**/**/*.json"], ["server:restart"]);
	});
})();