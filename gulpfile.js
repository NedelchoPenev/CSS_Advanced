"use strict";

let gulp = require("gulp"),
	autoprefixer = require("gulp-autoprefixer"),
	exec = require("gulp-exec"),
	browserSync = require('browser-sync').create(),
	child = require("child_process");
;

gulp.task("css", function() {
	return gulp.src( '_assets/css/**/*.css' )
		.pipe( autoprefixer() )
		.pipe( gulp.dest( './docs/css/' ) )
		.pipe( browserSync.stream({ match: '**/*.css' }) )
	;
});


gulp.task("jekyll", function() {
	return child.spawn("bundle.bat", ["exec", "jekyll.bat", "build", '--incremental'], { stdio: "inherit" });
});

gulp.task("watch", function() {

	browserSync.init({
		server: {
            baseDir: "./docs/"
		}
	});

	gulp.watch( '_assets/css/**/*.css', gulp.series('css') );

	gulp.watch(
		[
			"./*.html",
			"./_includes/*.html",
			"./_layouts/*.html",
			"./_homeworks/**/*.html",
			"./_topics/*.html",
			'_homeworks/**/**/*.css'
		]
	).on('change', gulp.series('jekyll', 'css') );

	gulp.watch( 'docs/**/*.html' ).on('change', browserSync.reload );
	gulp.watch( 'docs/homeworks/**/**/*.css' ).on('change', browserSync.reload );
	gulp.watch( 'docs/**/*.js' ).on('change', browserSync.reload );

});

gulp.task("default", gulp.series('css','watch'));