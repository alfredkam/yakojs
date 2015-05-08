var gulp = require('gulp');
var webpack = require('webpack');
var plugins = require('gulp-load-plugins')();
var _ = require('lodash');

gulp.task('dev', function () {
  var webpackConfig = require('./webpack.config.js');
  var nodemon = plugins.nodemon;

  var watchList = ['lib/**/*.js','lib/**/*.es6','./app.js'];

  nodemon({
    scripts: 'index',
    watch: watchList,
    ext: 'js jsx html'
  })
  .on('restart', function () {
    console.log('[Nodemon] Restarting');
  });

  var gWebpack = plugins.webpack;
  _.assign(webpackConfig, { watch: true });

  return gulp.src(watchList)
    .pipe(plugins.plumber())
    .pipe(gWebpack(webpackConfig, webpack))
    .pipe(gulp.dest('dist'));
});
