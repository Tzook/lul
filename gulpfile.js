const gulp = require("gulp");
const spawn = require("child_process").spawn;
const server = require("gulp-develop-server");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const tsProject = ts.createProject("tsconfig.json");

function compile() {
    return (
        tsProject
            .src()
            // .pipe(sourcemaps.init())
            .pipe(tsProject())
            .js // .pipe(sourcemaps.write())
            .pipe(gulp.dest(tsProject.options.outDir))
    );
}

gulp.task("compile", compile);
gulp.task("restart", server.restart);

gulp.task(
    "watch",
    gulp.series("compile", () => {
        server.listen({ path: "output/main.js" });
        gulp.watch("server/**/*", gulp.task("compile"));
        gulp.watch("output/**/*", gulp.task("restart"));
    }),
);

gulp.task("default", () => {
    let app = spawn("npm", ["start", "--color"], { detached: true });
    app.stdout.pipe(process.stdout);
    app.stderr.pipe(process.stderr);

    process.on("SIGINT", terminate);
    process.on("SIGTERM", terminate);

    function terminate() {
        // kills the entire processes group
        process.kill(-app.pid);
    }
});
