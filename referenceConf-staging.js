var params= {
    frontend: 'http://scalear-staging2.herokuapp.com/#/',

    url1:"http://www.youtube.com/watch?v=xGcG4cp2yzY",
    url2:"https://www.youtube.com/watch?v=SKqBmAHwSkg",
    q_x:169,
    q1_y:127,
    q2_y:157,
    q3_y:187,
    student1:{
        f_name: "Test_1",
        l_name: "student",
        online_name: "studenttest1",
        university: "uni",
        email: "student1@email.com",
    },
    student2:{
        f_name: "Test_2",
        l_name: "student",
        online_name: "studenttest2",
        university: "uni",
        email: "student2@email.com",
    },
    student3:{
        f_name: "Test_3",
        l_name: "student",
        online_name: "studenttest3",
        university: "uni",
        email: "student3@email.com",
    },
    student4:{
        f_name: "Student",
        l_name: "4",
        online_name: "studenttest3",
        university: "test univerisity",
        email: "student4@email.com",
    },
    teacher1:{
        f_name: "teacher",
        l_name: "1",
        online_name: "teacher1@sharklasers.com",
        university: "test univerisity",
        email: "teacher1@email.com",
    },
    teacher2:{
        f_name: "teacher",
        l_name: "test",
        online_name: "teacher test",
        university: "world university",
        email: "teacher2@email.com",
    },
    teacher3:{
        f_name: "teacher",
        l_name: "3",
        online_name: "teacher test3",
        university: "test univerisity",
        email: "z"+Math.floor(100000*Math.random()+1)+"@sharklasers.com",
    },
    admin:{
        f_name: "Administrator",
        l_name: "Control",
        online_name: "Admin",
        university: "uniAdmin",
        email: "admin@scalable-learning.com",
    },
    // teacher_mail:  'teacher1@email.com',
    // teacher2_mail: 'teacher2@email.com',
    // teacher3_mail: "z"+Math.floor(100000*Math.random()+1)+"@sharklasers.com",
    // student_mail:  'student1@email.com',
    // student2_mail: 'student2@email.com',
    // student3_mail: 'student3@email.com',
    // student4_mail: 'student4@email.com',
    // student5_mail: 'student5@email.com',
    password: 'password',
    admin_email:   'admin@scalable-learning.com',
    admin_password:"admin_account_password",
    student_name_list: ['Student 1','Student 2','Student 3'],

    guerrillamail_password: "password1234",
    guerrillamail_url: "https://www.guerrillamail.com/inbox",
    guerrillamail_first_name: "student",
    teacher_first_name: "teacher",
    student_name: "Student",

    guerrillamail_last_name: "4",
    guerrillamail_sch_uni_name: "test univerisity",

    short_name: "csc-test",
    course_name: "aesting course 100",
    course_duration: new Date(Date.now() + (1000  * 60 * 60  * 24  *7)).toDateString(),
    discussion_link: 'www.testing-link.com',
    image_link: "http://dasonlightinginc.com/uploads/2/9/4/2/2942625/4781952_orig.jpg",
    course_description: 'too many words',
    prerequisites: '1- course 1 2- course 2 3- course 3',

    teacher_fname: "teacher" ,
    teacher_lname: "1" ,
    teacher_univer: "test univerisity" ,

}


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
    suites: {
        course_create:[
            'test/e2e/spec/create_course.spec.js',
            'test/e2e/spec/fill_course.spec.js',
        ],
        validation: [
            'test/e2e/spec/course_information_validation.spec.js', //not done
            'test/e2e/spec/account_information_validation.spec.js',
            'test/e2e/spec/enrollment_help.spec.js'
        ],
        course_editor:[
            'test/e2e/spec/course_editor_basic.spec.js',
            'test/e2e/spec/course_editor_copy.spec.js',
            'test/e2e/spec/module_statistics.spec.js',
            'test/e2e/spec/course_editor_sharing.spec.js'
        ],
        announcement:[
            'test/e2e/spec/announcements.spec.js'
        ],
        teacher:[
            'test/e2e/spec/teacher-managment.spec.js'
        ],
        student:[
            'test/e2e/spec/create_course.spec.js',
            'test/e2e/spec/fill_course.spec.js',
            'test/e2e/spec/students_solve_course.spec.js',
            'test/e2e/spec/discussions.spec.js',
            'test/e2e/spec/notes.spec.js',
        ],

        delete_course:'test/e2e/spec/delete_course.spec.js'
      },
    specs: [
        // 'test/e2e/spec/create_course.spec.js', // done xx
        'test/e2e/spec/fill_course.spec.js', // done
        // 'test/e2e/spec/course_information_validation.spec.js', // done
        // 'test/e2e/spec/account_information_validation.spec.js', // done
        // 'test/e2e/spec/enrollment_help.spec.js', // done
        // 'test/e2e/spec/course_editor_basic.spec.js',
        // 'test/e2e/spec/course_editor_copy.spec.js',
        // 'test/e2e/spec/course_editor_sharing.spec.js',
        // 'test/e2e/spec/module_statistics.spec.js', // done
        // 'test/e2e/spec/announcements.spec.js', // done
        // 'test/e2e/spec/teacher-managment.spec.js', // done
        // 'test/e2e/spec/students_solve_course.spec.js',
        // 'test/e2e/spec/notes.spec.js', // done
        // 'test/e2e/spec/discussions.spec.js', // done
        // 'test/e2e/spec/progress-module.spec.js',
        // 'test/e2e/spec/progress-completion-module.spec.js',
        // 'test/e2e/spec/validations.spec.js',
        // 'test/e2e/spec/delete_course.spec.js',


        // to test email features locall

        // 'test/e2e/spec/add_user.spec.js',
        // 'test/e2e/spec/create_course.spec.js', // Done
        // 'test/e2e/spec/fill_course.spec.js',// Done
        // 'test/e2e/spec/email_notification.spec.js',  // Done
        // 'test/e2e/spec/delete_user.spec.js',  // Done




   //{{reviewed}}
        // 'test/e2e/spec/init-progress-data.spec.js', //
        // 'test/e2e/spec/account-info-validation.spec.js',//

        // 'test/e2e/spec/copying.spec.js', //
        // 'test/e2e/spec/course-editor-basic.spec.js', //
        // 'test/e2e/spec/create-announcements.spec.js', //
        // 'test/e2e/spec/dashboard.spec.js', //
        // 'test/e2e/spec/enrollment-help.spec.js', //
        // 'test/e2e/spec/module-statistics.spec.js'
        // 'test/e2e/spec/discussions.spec.js', //
        // 'test/e2e/spec/notes.spec.js', //
        // 'test/e2e/spec/mcq-quizzez-over-video-text.spec.js',//
        // 'test/e2e/spec/mcq-quizzez-over-video.spec.js',//
        // 'test/e2e/spec/mcq-survey-over-video.spec.js', //
        // 'test/e2e/spec/normal-quiz.spec.js', //
        // 'test/e2e/spec/normal-survey.spec.js', //
        // 'test/e2e/spec/ocq-quizzez-over-video-text.spec.js', //
        // 'test/e2e/spec/ocq-quizzez-over-video.spec.js', //
        // 'test/e2e/spec/ocq-survey-over-video.spec.js', //
        // 'test/e2e/spec/drag-quizzez-over-video-text.spec.js',//
        // 'test/e2e/spec/drag-quizzez-over-video.spec.js',//
        // 'test/e2e/spec/free-text-quizzez-over-video-text.spec.js', //
        // 'test/e2e/spec/sharing.spec.js',//
        // 'test/e2e/spec/teacher-managment.spec.js', //
        // 'test/e2e/spec/student-lectures.spec.js', //

        // 'test/e2e/spec/timeline.spec.js',
        // 'test/e2e/spec/validations.spec.js', //  should try changing the appearance date to an invalid date - before module appearance
        // 'test/e2e/spec/preview-as-student.spec.js',// //problem with deleting course at the end
        // 'test/e2e/spec/enrolled-students.spec.js',//
        //
        // 'test/e2e/spec/progress-main.spec.js', //
        // 'test/e2e/spec/progress-module.spec.js', //
        // 'test/e2e/spec/inclass.spec.js',
        // 'test/e2e/spec/statistics.spec.js',  //
        // 'test/e2e/spec/calendar-teacher-student.spec.js',  //


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
    // baseUrl: 'http://scalear-staging2.herokuapp.com/#',
    baseUrl: params.frontend, //'http://0.0.0.0:9000/#',


    // Selector for the element housing the angular app - this defaults to
    // body, but is necessary if ng-app is on a descendant of <body>
    rootElement: 'body',

    // A callback function called once protractor is ready and available, and
    // before the specs are executed
    // You can specify a file containing code to run by setting onPrepare to
    // the filename string.
    onPrepare: function() {
        browser.driver.manage().window().maximize();
        browser.driver.get(params.frontend);
        browser.driver.wait(function() {
            return element(by.id('login')).isPresent()
        }, 30000)
        element(by.id('login')).click();
    },

    // The params object will be passed directly to the protractor instance,
    // and can be accessed from your test. It is an arbitrary object and can
    // contain anything you my need in your test.
    // This can be changed via the command line as:
    //   --params.login.user 'Joe'
    params:params,
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
