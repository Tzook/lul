'use strict';
(function() {
	var gulp 		= require("gulp"),
	    spawn       = require('child_process').spawn,
		server 		= require("gulp-develop-server");

	gulp.task("server:start", () => {
		let ts = spawn('npm', ['start']); // set the typescript compilation process going
		ts.stdout.on("data", data => {
			data = data.toString();
			console.log(data);
			if (data.indexOf("Compilation complete") !== -1) {
				startServerWhenReady(data);
			}
		});
	});

	let startServerWhenReady = data => {
		server.listen({path: './output/main.js'});
		startServerWhenReady = () => {
			server.restart();
		};
	};

	// Server kill
	gulp.task("server:restart", function() {
		server.restart();
	});

	// WATCH
	// =====
	// Run the server unit tests just once, then run the server itself
	gulp.task("default", ["server:start"], function() {
		gulp.watch(["server/**/*.json"], ["server:restart"]);
	});
})();