var fs =              require('fs');
var del =             require('del');
var gulp =            require('gulp');
var useref =          require('gulp-useref');
var uglify =          require('gulp-uglify');
var gulpif =          require('gulp-if');
var concat =          require('gulp-concat');
var base64 =          require('gulp-css-base64');
var minifyCss =       require('gulp-minify-css');
var ngAnnotate =      require('gulp-ng-annotate');
var runSequence =     require('run-sequence');

gulp.task('default', ['make-dist']);

gulp.task('make-dist', function(cb) {
	runSequence('clean', 'copy-favicon', 'bundle-index', 'bundle-dash', cb);
});

gulp.task('clean', function() {
	return del('dist');
});

gulp.task('copy-favicon', function() {
	return gulp.src('src/favicon.png')
		.pipe(gulp.dest('dist'));
});

gulp.task('bundle-index', function() {
	var assets = useref.assets({noconcat: true});
	return gulp.src('src/index.html')
		.pipe(assets)
		.pipe(gulpif('*.js', concat('site.min.js')))
		.pipe(gulpif('*.js', ngAnnotate()))
		.pipe(gulpif('*.js', uglify({output: {max_line_len: 200}})))
		.pipe(gulpif('*.css', base64({maxWeightResource: Infinity})))
		.pipe(gulpif('*.css', concat('site.min.css')))
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(gulp.dest('dist'));
});

gulp.task('bundle-dash', function() {
	var assets = useref.assets({noconcat: true});
	return gulp.src('src/dash/index.html')
		.pipe(assets)
		.pipe(gulpif('*.js', concat('dash.min.js')))
		.pipe(gulpif('*.js', ngAnnotate()))
		.pipe(gulpif('*.js', uglify({output: {max_line_len: 200}})))
		.pipe(gulpif('*.css', base64({maxWeightResource: Infinity})))
		.pipe(gulpif('*.css', concat('dash.min.css')))
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(gulp.dest('dist/dash'));
});