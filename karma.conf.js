// Karma configuration
// Generated on Wed Oct 31 2018 18:02:10 GMT+0200 (EET)

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/popcornjs/popcorn.js',
      'app/bower_components/popcornjs/wrappers/common/popcorn._MediaElementProto.js',
      'app/scripts/externals/popcorn.HTMLKalturaVideoElement.js',
      './test/spec/directives/kaltura.spec.js'
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher')
    ],

    jsonFixturesPreprocessor: {
      
    },
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,

    crossOriginAttribute: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,//Karma should automatically restart any time you save changes to your tests or code

    // Concurrncy level
    // how many browser should be started simultaneous
    concurrency: Infinity,
    browserDisconnectTolerance: 1,
    browserNoActivityTimeout: 500000


  })
}
