var gulp = require('gulp');
var webpack = require('webpack');
var plugins = require('gulp-load-plugins')();
var _ = require('lodash');
var gWebpack = plugins.webpack;

gulp.task('pack:lite', function () {
  var webpackConfig = _.clone(require('./webpack.config.js'));

  return gulp.src('./index')
    .pipe(plugins.plumber())
    .pipe(gWebpack(webpackConfig, webpack))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify:lite', function () {
  var webpackConfig = _.clone(require('./webpack.config.js'));
  _.assign(webpackConfig, {
    entry: {
      'yako.min': './build-tools/expose.build'
    },
    plugins: [
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.UglifyJsPlugin({
          compress: {
              warnings: false
          }
      })
    ]
  });

  return gulp.src('./index')
    .pipe(plugins.plumber())
    .pipe(gWebpack(webpackConfig, webpack))
    .pipe(gulp.dest('dist'));
});

gulp.task('pack:addons', function () {
  var webpackConfig = _.clone(require('./webpack.config.js'));
  _.assign(webpackConfig, {
    entry: {
      'yako.addons': './build-tools/addons.expose.build'
    }
  });

  return gulp.src('./addons/index')
    .pipe(plugins.plumber())
    .pipe(gWebpack(webpackConfig, webpack))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify:addons', function () {
  var webpackConfig = _.clone(require('./webpack.config.js'));
  _.assign(webpackConfig, {
    entry: {
      'yako.addons.min': './build-tools/addons.expose.build'
    },
    plugins: [
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.UglifyJsPlugin({
          compress: {
              warnings: false
          }
      })
    ]
  });

  return gulp.src('./addons/index')
    .pipe(plugins.plumber())
    .pipe(gWebpack(webpackConfig, webpack))
    .pipe(gulp.dest('dist'));
});

gulp.task('pack:demo', function () {
  var webpackConfig = _.clone(require('./webpack.config.js'));
  _.assign(webpackConfig, {
    entry: {
      'bundle': './demo/demo-webpack'
    },
    plugins: [
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.UglifyJsPlugin({
          compress: {
              warnings: false
          }
      })
    ]
  });

  return gulp.src(['./index.js', './demo/demo-webpack.js'])
    .pipe(plugins.plumber())
    .pipe(gWebpack(webpackConfig, webpack))
    .pipe(gulp.dest('demo'));
});

gulp.task('pack:example', function () {
  var webpackConfig = _.clone(require('./webpack.config.js'));
  _.assign(webpackConfig, {
    entry: {
      'bundle': './demo/example-webpack'
    },
    plugins: [
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.UglifyJsPlugin({
          compress: {
              warnings: false
          }
      })
    ]
  });

  return gulp.src(['./index.js', './demo/demo-webpack.js'])
    .pipe(plugins.plumber())
    .pipe(gWebpack(webpackConfig, webpack))
    .pipe(gulp.dest('demo'));
});

gulp.task("build", function () {
  var babel = plugins.babel;
  return gulp.src(["src/**/*.js", "src/**/*.es6", "src/**/*.jsx"])
  .pipe(babel({
    blacklist: ["strict"]
  }))
  .pipe(gulp.dest("lib"));
});

gulp.task("clean:build", function (cb) {
  var del = require('del');
  del([
    'lib/'
  ], cb);
});

gulp.task('pack', ['pack:lite', 'minify:lite', 'pack:addons', 'minify:addons', 'pack:demo', 'pack:example']);

gulp.task('dev', function () {
  var nodemon = plugins.nodemon;

  nodemon({
    scripts: 'dev',
    ignore: ['node_modules'],
    ext: 'js jsx html es6'
  })
  .on('restart', function () {
    console.log('[Nodemon] Restarting');
  });
});
