var gulp = require('gulp');
var webpack = require('webpack');
var plugins = require('glup-load-plugins');

gulp.task('dev', function () {
  var webpackConfig = require('./webpack.config.js');
  var nodemon = plugins.nodemon;

  var watchList = ['lib/', 'timeseries/', '/demo']

  nodemon({
    scripts: 'app.js',
    watch: watchList,
    ext: 'js jsx html'
  })
  .on('restart', function () {
    console.log('[Nodemon] Restarting');
  });

  var gWebpack = plugins.webpack;
  _.assign(webpackConfig, { watch: true });

  return glulp.src(watchList)
    .pipe(plugins.plumber())
    .pipe(gWebpack(webpackConfig, webpack))
    .pipe(gulp.dest('dist'));
});
