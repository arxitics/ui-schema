/**
 * UI Schema's Gulpfile
 */

var gulp = require('gulp');
var header = require('gulp-header');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var csslint = require('gulp-csslint');
var minifyCSS = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var uglifyJS = require('gulp-uglify');
var jade = require('gulp-jade');

var pkg = require('./package.json');
var version = pkg.version;
var banner = '/*! UI Schema v<%= version %> | (c) 2016 Arxitics | MIT license */\n';

gulp.task('default', [
  'csslint',
  'minify-css',
  'jshint',
  'concat-js',
  'minify-js',
  'compile-jade',
  'watch'
]);

gulp.task('csslint', function() {
  gulp.src('css/!(import).css')
    .pipe(csslint({
      'box-sizing': false,
      'compatible-vendor-prefixes': false,
      'gradients': false,
      'fallback-colors': false,
      'font-sizes': false,
      'important': false,
      'known-properties': false,
      'outline-none': false,
      'qualified-headings': false,
      'unique-headings': false,
      'unqualified-attributes': false,
      'vendor-prefix': false
    }))
    .pipe(csslint.reporter('default'));
});

gulp.task('minify-css', function() {
  gulp.src('css/import.css')
    .pipe(minifyCSS({
      keepSpecialComments: 0,
      processImport: true,
      advanced: false
    }))
    .pipe(header(banner, {
      version : pkg.version
    }))
    .pipe(rename('ui-schema-' + version + '.min.css'))
    .pipe(gulp.dest('dist/'))
});

gulp.task('jshint', function () {
  gulp.src([
      'js/*.js',
      'js/icons/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('concat-js', function () {
  gulp.src([
      'js/setup.js',
      'js/core.js',
      'js/forms.js',
      'js/utilities.js',
      'js/icons.js'
    ])
    .pipe(concat('ui-schema.js'))
    .pipe(gulp.dest('js/'));
});

gulp.task('minify-js', ['concat-js'], function () {
  gulp.src('js/ui-schema.js')
    .pipe(uglifyJS())
    .pipe(header(banner, {
      version : pkg.version
    }))
    .pipe(rename('ui-schema-' + version + '.min.js'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('compile-jade', function () {
  gulp.src('docs/jade/!(layout|links).jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('docs/html/'));

  gulp.src('docs/jade/css/!(modules).jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('docs/html/css/'));

  gulp.src('docs/jade/examples/!(contents).jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('docs/html/examples/'));

  gulp.src('docs/jade/javascript/!(components).jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('docs/html/javascript/'));
});

gulp.task('watch', function () {
  gulp.watch('css/*.css', [
    'csslint',
    'minify-css'
  ]);

  gulp.watch('js/*.js', [
    'jshint',
    'concat-js',
    'minify-js'
  ]);

  gulp.watch('docs/jade/{*,*/}*.jade', [
    'compile-jade'
  ]);
});
