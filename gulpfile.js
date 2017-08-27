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
var pug = require('gulp-pug');

var pkg = require('./package.json');
var version = pkg.version;
var banner = '/*! UI Schema v<%= version %> | (c) 2017 Arxitics | MIT license */\n';

gulp.task('default', [
  'csslint',
  'concat-css',
  'minify-css',
  'jshint',
  'concat-js',
  'minify-js',
  'compile-docs',
  'watch'
]);

gulp.task('csslint', function () {
  gulp.src('css/!(import).css')
    .pipe(csslint({
      'box-model': false,
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
    .pipe(csslint.formatter());
});

gulp.task('concat-css', function () {
  gulp.src([
      'css/base.css',
      'css/core.css',
      'css/grid.css',
      'css/navigation.css',
      'css/menus.css',
      'css/typography.css',
      'css/forms.css',
      'css/tables.css',
      'css/images.css',
      'css/icons.css',
      'css/colors.css',
      'css/effects.css',
      'css/shapes.css',
      'css/events.css',
      'css/mobile.css',
      'css/print.css',
      'css/pages.css',
      'css/utilities.css',
      'css/themes.css',
      'css/variables.css'
    ])
    .pipe(concat('ui-schema-' + version + '.css'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('minify-css', function () {
  gulp.src('css/import.css')
    .pipe(minifyCSS({
      keepSpecialComments: 0,
      processImport: true,
      advanced: false
    }))
    .pipe(header(banner, {
      version : version
    }))
    .pipe(rename('ui-schema-' + version + '.min.css'))
    .pipe(gulp.dest('dist/'))
});

gulp.task('jshint', function () {
  gulp.src([
      'js/*.js',
      'js/icons/*.js',
      'js/plugins/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('concat-js', function () {
  gulp.src([
      'js/setup.js',
      'js/core.js',
      'js/forms.js',
      'js/images.js',
      'js/utilities.js',
      'js/icons.js'
    ])
    .pipe(concat('ui-schema-' + version + '.js'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('minify-js', ['concat-js'], function () {
  gulp.src('dist/ui-schema-' + version + '.js')
    .pipe(uglifyJS())
    .pipe(header(banner, {
      version : version
    }))
    .pipe(rename('ui-schema-' + version + '.min.js'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('compile-docs', function () {
  gulp.src('docs/pug/!(layout|links).pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('docs/html/'));

  gulp.src('docs/pug/css/!(modules).pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('docs/html/css/'));

  gulp.src('docs/pug/javascript/!(components).pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('docs/html/javascript/'));

  gulp.src('docs/pug/examples/!(contents).pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('docs/html/examples/'));
});

gulp.task('watch', function () {
  gulp.watch('css/*.css', [
    'csslint',
    'concat-css',
    'minify-css'
  ]);

  gulp.watch('js/*.js', [
    'jshint',
    'concat-js',
    'minify-js'
  ]);

  gulp.watch('docs/pug/{*,*/}*.pug', [
    'compile-docs'
  ]);
});
