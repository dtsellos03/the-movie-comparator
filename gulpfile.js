// Gulp.js configuration
var
  // modules
  gulp = require('gulp'),
  imagemin = require('gulp-imagemin'),
  stripdebug = require('gulp-strip-debug'),
  uglify = require('gulp-uglify'),

  // development mode?
  devBuild = (process.env.NODE_ENV !== 'production'),

  // folders
  folder = {
    src: 'src/',
    build: 'public/'
  }
;

// image processing
gulp.task('images', function() {
  var out = folder.build + 'images/';
  return gulp.src(folder.src + 'images/**/*')
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest(out));
});


// JavaScript processing
gulp.task('js', function() {

  var jsbuild = gulp.src(folder.src + 'js/**/*')



    jsbuild = jsbuild
      .pipe(stripdebug())
      .pipe(uglify());
  

  return jsbuild.pipe(gulp.dest(folder.build + 'js/'));

});

gulp.task('run', ['images', 'js']);