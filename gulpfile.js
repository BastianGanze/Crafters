var gulp = require('gulp'),
    browserify = require('browserify'),
    tsify = require('tsify'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
    watchify = require('watchify'),
    nodemon = require("gulp-nodemon"),
    paths = {src: "src/", build:"build/", tmp:"tmp/"},
    mainFile = "start.ts",
    version = "0.0.1";

var srcCodeBundler = browserify({debug:true}).add(paths.src+mainFile).plugin(tsify),
    watchifyBundler = watchify(browserify({debug:true}).add(paths.src+mainFile).plugin(tsify));

function transpile(bundler){
    return function()
    { return bundler.bundle()
        .on('error', function(error){console.error(error.toString()); })
        .pipe(source('build-'+version+'.js'))
        .pipe(buffer())
        .pipe(gulp.dest(paths.build));
    }
}

gulp.task('transpile', transpile(srcCodeBundler));

gulp.task('watchify', transpile(watchifyBundler));

gulp.task('watch', ['transpile'], function() {
    gulp.watch(paths.src+'**/*.ts', ['watchify']);
});

gulp.task("server", ["transpile"],  function () {
   return nodemon({
       script: "src/server/main.js",
       ext: 'js'
   }).once('quit', function(){
       process.exit();
   });
});

gulp.task("server-only",  function () {
    return nodemon({
        script: "src/server/main.js",
        ext: 'js'
    }).once('quit', function(){
        process.exit();
    });
});

gulp.task('default', ['transpile']);