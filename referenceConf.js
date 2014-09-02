// A reference configuration file.
exports.config = {
    // ----- How to setup Selenium -----
    //
    // There are three ways to specify how to use Selenium. Specify one of the
    // following:
    //
    // 1. seleniumServerJar - to start Selenium Standalone locally.
    // 2. seleniumAddress - to connect to a Selenium server which is already
    //    running.
    // 3. sauceUser/sauceKey - to use remote Selenium servers via SauceLabs.

    // The location of the selenium standalone server .jar file.
    seleniumServerJar: null, //'selenium/selenium-server-standalone-2.39.0.jar',
    // The port to start the selenium server on, or null if the server should
    // find its own unused port.
    //seleniumPort: 4444,
    // Chromedriver location is used to help the selenium standalone server
    // find chromedriver. This will be passed to the selenium jar as
    // the system property webdriver.chrome.driver. If null, selenium will
    // attempt to find chromedriver using PATH.
    //  chromeDriver: './selenium/chromedriver',
    // Additional command line options to pass to selenium. For example,
    // if you need to change the browser timeout, use
    // seleniumArgs: ['-browserTimeout=60'],
    seleniumArgs: [],

    // If sauceUser and sauceKey are specified, seleniumServerJar will be ignored.
    // The tests will be run remotely using SauceLabs.
    sauceUser: null,
    sauceKey: null,

    // The address of a running selenium server. If specified, Protractor will
    // connect to an already running instance of selenium. This usually looks like
    seleniumAddress: 'http://localhost:4444/wd/hub',



    // The timeout for each script run on the browser. This should be longer
    // than the maximum time your application needs to stabilize between tasks.
    allScriptsTimeout: 120000,

    // ----- What tests to run -----
    //
    // Spec patterns are relative to the location of this config.
    specs: [

        // 'test/e2e/spec/main_menu.spec.js',

        // 'test/e2e/spec/course-editor-basic.spec.js',//done
        // 'test/e2e/spec/create-course-check-info.spec.js',//<x> done
        // 'test/e2e/spec/teacher-managment.spec.js', //done
        // 'test/e2e/spec/enrolled-students.spec.js',//done
        // 'test/e2e/spec/create-announcements.spec.js',//done
        // 'test/e2e/spec/copying-sharing.spec.js',//done

        // 'test/e2e/spec/normal-quiz.spec.js',//done
        // 'test/e2e/spec/normal-survey.spec.js',//done

        // 'test/e2e/spec/mcq-quizzez-over-video.spec.js',//<x> //done
        // 'test/e2e/spec/ocq-quizzez-over-video.spec.js',//<x> //done
        // 'test/e2e/spec/drag-quizzez-over-video.spec.js', //done

        // 'test/e2e/spec/mcq-quizzez-over-video-text.spec.js',//<x> //done
        // 'test/e2e/spec/ocq-quizzez-over-video-text.spec.js',//<x> //done
        // 'test/e2e/spec/drag-quizzez-over-video-text.spec.js',//done
        // 'test/e2e/spec/free-text-quizzez-over-video-text.spec.js', //<x>//done
        
        // 'test/e2e/spec/mcq-survey-over-video.spec.js',//<x>//done
        // 'test/e2e/spec/ocq-survey-over-video.spec.js',//<x>//done

        // 'test/e2e/spec/student-lectures.spec.js',//<x>//done

        // 'test/e2e/spec/init-progress-data.spec.js',        
        // 'test/e2e/spec/progress-main.spec.js',
        'test/e2e/spec/progress-module.spec.js',
        // 'test/e2e/spec/inclass.spec.js',

        // 'test/e2e/spec/calendar-teacher-student.spec.js',//<x>//done
        // 'test/e2e/spec/statistics.spec.js',//done
    ],

    // ----- Capabilities to be passed to the webdriver instance ----
    //
    // For a full list of available capabilities, see
    // https://code.google.com/p/selenium/wiki/DesiredCapabilities
    // and
    // https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js
    capabilities: {
        'browserName': 'chrome'
    },

    // ----- More information for your tests ----
    //
    // A base URL for your application under test. Calls to protractor.get()
    // with relative paths will be prepended with this.
    // baseUrl: 'http://staging.scalable-learning.com/#',
    baseUrl: 'http://0.0.0.0:9000/#',


    // Selector for the element housing the angular app - this defaults to
    // body, but is necessary if ng-app is on a descendant of <body>
    rootElement: 'body',

    // A callback function called once protractor is ready and available, and
    // before the specs are executed
    // You can specify a file containing code to run by setting onPrepare to
    // the filename string.
    onPrepare: function() {
        // At this point, global 'protractor' object will be set up, and jasmine
        // will be available. For example, you can add a Jasmine reporter with:
        //     jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter(
        //         'outputdir/', true, true));
    },

    // The params object will be passed directly to the protractor instance,
    // and can be accessed from your test. It is an arbitrary object and can
    // contain anything you my need in your test.
    // This can be changed via the command line as:
    //   --params.login.user 'Joe'
    params: {
        //local
        frontend: 'http://0.0.0.0:9000/#',
        admin_mail: 'admin@scalear.com',
        teacher_mail: 'teacher1@sharklasers.com',
        teacher2_mail: 'teacher3@sharklasers.com',
        student_mail: 'studenttest@sharklasers.com',
        student2_mail: 'studenttest2@sharklasers.com',
        student3_mail: 'student_mail_2@sharklasers.com',
        password: 'password',
        admin_password:"password",


        //mena
        // frontend: 'http://0.0.0.0:9000/#',
        // // frontend: 'http://staging.scalable-learning.com/#',
        // // teacher_mail: 'teacher3@sharklasers.com',
        // // mail: 'studenttest2@sharklasers.com',
        // // teacher_mail: 'teacher2@sharklasers.com',
        // // teacher_mail: 'teacher15@sharklasers.com',

        // // mail: 'studenttest@sharklasers.com',
        // student_mail: 'mena.happy@yahoo.com',

        // admin_mail: 'admin@scalear.com',
        // teacher_mail: 'teacher1@sharklasers.com',
        // teacher2_mail: 'teacher3@sharklasers.com',
        // // student_mail: 'studenttest@sharklasers.com',
        // student2_mail: 'studenttest2@sharklasers.com',
        // student3_mail: 'student_mail_2@sharklasers.com',
        // password: 'password',
        // admin_password:"password",

        //staging
        // frontend: 'http://staging.scalable-learning.com/#',
        // admin_email: 'admin@scalable-learning.com',       
        // teacher_mail: 'teacher1@sharklasers.com',
        // teacher2_mail: 'teacher2@sharklasers.com',
        // teacher3_mail: 'teacher3@sharklasers.com',
        // student_mail: 'studenttest@sharklasers.com',
        // student2_mail:'studenttest2@sharklasers.com',
        // student3_mail: 'student_mail_2@sharklasers.com',
        // password: 'password',
        // admin_password:"admin_account_password",

        short_name: "csc-test",
        course_name: "testing course 100",
        course_duration: '19',
        discussion_link: 'www.testing-link.com',
        image_link: "http://dasonlightinginc.com/uploads/2/9/4/2/2942625/4781952_orig.jpg",
        course_description: 'too many words',
        prerequisites: '1- course 1 2- course 2 3- course 3',
        width: 1366,
        height: 768,
        
        // frontend: 'http://staging.scalable-learning.com/#/',
        //====================================================
        //               wait for element
        //====================================================
        wait_ele: function(ptor, element){
          ptor.wait(function(){
            return ptor.isElementPresent(element)
        });
      }
  },
    // ----- Options to be passed to minijasminenode -----
    //
    // See the full list at https://github.com/juliemr/minijasminenode
    jasmineNodeOpts: {
        // onComplete will be called just before the driver quits.
        onComplete: null,
        // If true, display spec names.
        isVerbose: true,
        // If true, print colors to the terminal.
        showColors: true,
        // If true, include stack traces in failures.
        includeStackTrace: true,
        // Default time to wait in ms before a test fails.
        defaultTimeoutInterval: 300000
    }
};
