'use strict';

var babelify = require('babelify');
var browserify = require('browserify');
var del = require('del');
var gulp = require('gulp');
var source = require('vinyl-source-stream');

gulp.task('background', function() {
  browserify('js/background.js')
    .transform(babelify)
    .bundle()
    .pipe(source('background-bundle.js'))
    .pipe(gulp.dest('build/app'));
});

gulp.task('options', function() {
  browserify('js/options.js')
    .transform(babelify)
    .bundle()
    .pipe(source('options-bundle.js'))
    .pipe(gulp.dest('build/app'));
});

gulp.task('static', function() {
  gulp.src('static/*')
    .pipe(gulp.dest('build/app'));
});

gulp.task('clean', del.bind(null, ['build']));

gulp.task('build', ['background', 'options', 'static']);
