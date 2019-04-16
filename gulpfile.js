"use strict";

let gulp = require("gulp"),
	autoprefixer = require("gulp-autoprefixer"),
	exec = require("gulp-exec"),
	browserSync = require('browser-sync').create(),
	sass = require('gulp-sass'),
	child = require("child_process");
;

gulp.task("scss", function () {
	return gulp.src('_assets/scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest('./docs/css/'))
		.pipe(browserSync.stream({ match: '**/*.css' }));
});


gulp.task("jekyll", function () {
	return child.spawn("bundle.bat", ["exec", "jekyll.bat", "build", '--incremental'], { stdio: "inherit", shell: true });
});

gulp.task("watch", function () {

	browserSync.init({
		server: {
			baseDir: "./docs/"
		}
	});

	gulp.watch('_assets/scss/**/*.scss', gulp.series('scss'));

	gulp.watch(
		[
			"./*.html",
			"./_includes/*.html",
			"./_layouts/*.html",
			"./_homeworks/**/*.html",
			'_homeworks/**/**/*.css'
		]
	).on('change', gulp.series('jekyll', 'scss'));

	gulp.watch('docs/**/*.html').on('change', browserSync.reload);
	gulp.watch('docs/homeworks/**/**/*.css').on('change', browserSync.reload);
	gulp.watch('docs/**/*.js').on('change', browserSync.reload);
});

gulp.task("default", gulp.series('scss', 'watch'));