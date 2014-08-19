// Karma configuration
// Generated on Tue Aug 19 2014 00:52:37 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      {pattern: 'index.html', watched: true, included: false, served: true},
      {pattern: 'node_modules/chai/chai.js', include: true},
      'yako.js',
      'test/**/*.unit-test.js',
    ],


    // list of files to exclude
    exclude: [
        'karma.conf.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'yako.js': ['coverage']
    },

    coverageReporter : {
      type : 'html',
      dir : 'coverage/'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // cannot include ie on mac :(
    browsers: ['Chrome','Firefox', 'Safari', 'PhantomJS'], //'IE', 'IE9', 'IE8'],

    // customLaunchers: {
    //   IE9: {
    //     base: 'IE',
    //     'x-ua-compatible': 'IE=EmulateIE9'
    //   },
    //   IE8: {
    //     base: 'IE',
    //     'x-ua-compatible': 'IE=EmulateIE8'
    //   }
    // },


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
