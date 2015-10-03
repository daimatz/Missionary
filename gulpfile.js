'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('background', function() {
  browserify('js/background.js')
    .transform(babelify)
    .bundle()
    .pipe(source('background-bundle.js'))
    .pipe(gulp.dest('./app'));
});

gulp.task('options', function() {
  browserify('js/options.js')
    .transform(babelify)
    .bundle()
    .pipe(source('options-bundle.js'))
    .pipe(gulp.dest('./app'));
});

gulp.task('static', function() {
  gulp.src('static/*')
    .pipe(gulp.dest('./app'));
});

gulp.task('build', ['background', 'options', 'static']);
