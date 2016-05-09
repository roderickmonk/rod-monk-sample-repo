var gulp 			  = require ('gulp');
var concat 			= require ('gulp-concat');
var uglify 			= require ('gulp-uglify');
var ngAnnotate 	= require ('gulp-ng-annotate');
var changed 		= require ('gulp-changed');
var minifyHTML 	= require ('gulp-minify-html');
var minifyCss 	= require ('gulp-minify-css');
var sourcemaps	= require ('gulp-sourcemaps');
var image 			= require ('gulp-image');
var concat			= require ('gulp-concat');
 
gulp.task ('image', function () {
  gulp.src('./client-src/assets/images/**/*.*')
    .pipe(image())
    .pipe(gulp.dest('./client-build/assets/images/'));
});

gulp.task('minify-css', function() {
  return gulp.src  ('./client-src/assets/**/*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('./client-build/'));
});

gulp.task('css.map', function() {
  return gulp.src('./client-src/assets/css/*.css.map')
    .pipe(gulp.dest('./client-build/'));
});

gulp.task('minify-html', function() {
   var 	htmlSrc = './client-src/**/*.html',
   		htmlDst = './client-build/';
   var 	opts 	= {empty: true};

   gulp.src(htmlSrc)
      .pipe(minifyHTML(opts))
      .pipe(gulp.dest(htmlDst));
});

gulp.task('angular-bundle', function () {
  gulp.src(['./client-src/app.js', './client-src/app.route.js', './client-src/ng-components/**/*.js', './client-src/ng-services/**/*.js', './client-src/ng-directives/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('client-build/angular-bundle.js'))
    .pipe(ngAnnotate())
    //.pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.'))
})

gulp.task('asset-bundle', function () {
  gulp.src([	'./client-src/assets/libs/**/*.js', './client-src/assets/js/**/*.js'])
    .pipe(sourcemaps.init())
      .pipe(concat('client-build/asset-bundle.js'))
      .pipe(ngAnnotate())
      .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.'))
})

gulp.task('minify-js', function() {
	gulp.src ('./client-src/**/*.js')
		.pipe (ngAnnotate ())
		/*.pipe (uglify ())*/
		.pipe (gulp.dest ('./client-build'));
});

gulp.task('json', function() {
	gulp.src ('./client-src/**/*.json')
		.pipe (gulp.dest ('./client-build'));
});

gulp.task('minify-map', function() {
	gulp.src ('./client-src/**/*.map')
		.pipe (gulp.dest ('./client-build'));
});

gulp.task('PDFs', function() {
	gulp.src ('./client-src/assets/PDFs/*.pdf')
		.pipe (gulp.dest ('./client-build/assets/PDFs/'));
});

gulp.task('automate', function() {
  gulp.watch('./client-src/assets/images/**/*.*', ['image']);
	gulp.watch('./client-src/assets/**/*.css', ['minify-css']);
	gulp.watch('./client-src/**/*.html', ['minify-html']);
	gulp.watch('./client-src/**/*.js', ['minify-js']);
	gulp.watch('./client-src/**/*.js', ['one-js']);
});

gulp.task('default', ['minify-map', 'minify-html', 'minify-css', 'minify-js', 'css.map', 'image', 'PDFs', 'json', 'angular-bundle', 'asset-bundle']);
