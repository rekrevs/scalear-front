// Karma configuration
// Generated on Wed Oct 31 2018 18:02:10 GMT+0200 (EET)

module.exports = function(config) {
  config.set({
    
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine','fixture'],


    // list of files / patterns to load in the browser
    files: [
      './node_modules/angular/angular.js',                             // angular
      './node_modules/angular-ui-router/release/angular-ui-router.js', // ui-router
      './node_modules/angular-mocks/angular-mocks.js',
    
      // 'app/bower_components/angular/angular.js',
      // 'app/bower_components/angular-ui-router/release/angular-ui-router.js',
      // 'app/bower_components/angular-mocks/angular-mocks.js',

      'app/bower_components/jquery/dist/jquery.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-touch/angular-touch.js',
      'app/bower_components/angular-ui-bootstrap/src/datepicker/datepicker.js',
      'app/bower_components/angular-ui-bootstrap/src/position/position.js',
      'app/bower_components/angular-ui-bootstrap/src/timepicker/timepicker.js',
      'app/bower_components/angular-ui-sortable/sortable.js',
      'app/bower_components/angular-ui-calendar/src/calendar.js',
      'app/bower_components/angular-dragdrop/src/angular-dragdrop.js',
      'app/bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
      'app/bower_components/angular-xeditable/dist/js/xeditable.js',
      'app/bower_components/angular-google-chart/ng-google-chart.js',
      'app/bower_components/angular-translate/angular-translate.js',
      'app/bower_components/moment/moment.js',
      'app/bower_components/angular-moment/angular-moment.js',
      
      'app/bower_components/textAngular/textAngular.js',
      'app/bower_components/highcharts-ng/dist/highcharts-ng.js',
      'app/scripts/config.js',


     
      // 'config',
      'app/bower_components/angular-loading-bar/src/loading-bar.js',
      'app/bower_components/angu-fixed-header-table/angu-fixed-header-table.js',
      'app/bower_components/angular-foundation/mm-foundation.js',
      'app/bower_components/angular-img-fallback/angular.dcb-img-fallback.js',
      'app/bower_components/ngclipboard/src/ngclipboard.js',
      'app/bower_components/angular-truncate/ng-text-truncate.js',
      'app/bower_components/ngDialog/js/ngDialog.js',
      'app/bower_components/angular-wizard/dist/angular-wizard.js',
      'app/bower_components/angular-medium-editor/dist/angular-medium-editor.js',
      'app/bower_components/angular-smart-table/dist/smart-table.js',

      'app/bower_components/jquery/dist/jquery.min.js',
      'app/bower_components/jquery-ui/jquery-ui.js',
      'app/bower_components/jquery.cookie/jquery.cookie.js',
      'app/bower_components/jquery-placeholder/jquery-placeholder.js',
      'app/bower_components/popcornjs/popcorn.js',
      'app/bower_components/popcornjs/wrappers/common/popcorn._MediaElementProto.js',

      'app/scripts/externals/popcorn.HTMLKalturaVideoElement.js',

      'app/scripts/core.app.js',
      
      // './test/spec/directives/kal_lib.js',
      './test/spec/directives/kaltura.spec.js'
    ],
  

    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: { 
      '**/*.html'   : ['html2js'],
      '**/*.json'   : ['json_fixtures']
    },
    plugins: [
      'karma-fixture',
      'karma-html2js-preprocessor',
      'karma-json-fixtures-preprocessor',
      require('karma-jasmine'),
      require('karma-chrome-launcher')
    ],

    jsonFixturesPreprocessor: {
      variableName: '__json__'
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
