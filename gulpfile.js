'use strict';

const gulp = require('gulp');
const del = require('del');
const plumber = require('gulp-plumber');
const server = require('browser-sync').create();
const rollup = require('gulp-better-rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');

gulp.task('scripts', function () {
  return gulp.src('js/main.js')
    .pipe(plumber())
    .pipe(rollup({
      plugins: [
        resolve({browser: true}),
        commonjs(),
        babel({
          babelrc: false,
          exclude: 'node_modules/**',
          presets: [
            ['env', {
              'modules': false
            }]
          ],
          plugins: [
            'external-helpers'
          ],
          externalHelpers: false
        })
      ]
    }, 'iife'))
    .pipe(gulp.dest('build/js'))
});

gulp.task('copy-html', function () {
  return gulp.src('*.{html,ico}')
    .pipe(gulp.dest('build'))
    .pipe(server.stream());
});

gulp.task('copy', ['copy-html', 'scripts'], function () {
  return gulp.src([
    'img/*.*'
  ], {base: '.'})
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('js-watch', ['scripts'], function (done) {
  server.reload();
  done();
});

gulp.task('serve', ['assemble'], function () {
  server.init({
    server: './build',
    notify: false,
    open: true,
    port: 3502,
    ui: false
  });

  gulp.watch('*.html').on('change', function (e) {
    if (e.type !== 'deleted') {
      gulp.start('copy-html');
    }
  });
  gulp.watch('js/**/*.js', ['js-watch']);
});

gulp.task('assemble', ['clean'], function () {
  gulp.start('copy');
});

gulp.task('build', ['assemble']);
