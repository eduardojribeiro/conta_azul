var gulp = require('gulp');
var coffee = require('gulp-coffee');
var watch = require('gulp-watch');

gulp.task('coffee', function() {
	gulp.src('./app/coffee/**/*.coffee')
		.pipe(coffee())
		.pipe(gulp.dest('./app/js/'));
});

gulp.task('watch', function() {
	return watch('app/coffee/**/*.coffee', { ignoreInitial: false })
		.pipe(coffee())
		.pipe(gulp.dest('./app/js/'));
});