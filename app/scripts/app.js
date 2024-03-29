'use strict';

angular.module('scalearAngularApp')
.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$translateProvider', '$logProvider', 'cfpLoadingBarProvider', 'scalear_api','$sceProvider', function($stateProvider, $urlRouterProvider, $httpProvider, $translateProvider, $logProvider, cfpLoadingBarProvider, scalear_api, $sceProvider) {
    cfpLoadingBarProvider.includeSpinner = true;

    $logProvider.debugEnabled(scalear_api.debug)

    $sceProvider.enabled(false);

    $translateProvider
        .translations('en', translation_en)
        .translations('sv', translation_sv)
        .preferredLanguage('en')
        .useCookieStorage()
        .useSanitizeValueStrategy('escape');

    //$httpProvider.defaults.headers.common['X-CSRF-Token'] = $cookies['XSRF-TOKEN']//$('meta[name=csrf-token]').attr('content');

    $httpProvider.defaults.withCredentials = false;
    $httpProvider.interceptors.push('ServerInterceptor');
    $httpProvider.interceptors.push('TokenServerInterceptor');

    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/views/empty_view.html',
            controller: 'HomeCtrl'
        })
        .state('landing', {
            url: '/home',
             views:{
                'landing':{
                    templateUrl: '/views/main.html',
                    controller: 'MainCtrl'
                },
            }
        })
        .state('about', {
            url: '/about',
            templateUrl: '/views/about.html',
            controller: 'AboutCtrl'
        })
        .state('ie', {
            url: '/ie',
            templateUrl: '/views/ie.html'
        })
        .state('login', {
            url: '/users/login?access-token&client&expiry&token-type&uid',
            templateUrl: '/views/login.html',
            controller: 'LoginCtrl',
            params : { email: null}
        })
        .state('teacher_signup', {
            url: '/users/teacher',
            templateUrl: '/views/users/signup.html',
            controller: 'UsersTeacherCtrl'
        })
        .state('student_signup', {
            url: '/users/student',
            templateUrl: '/views/users/signup.html',
            controller: 'UsersStudentCtrl'
        })
        .state('signup', {
            url: '/users/signup',
            templateUrl: '/views/users/unified_signup.html',
            controller: 'UsersSignUpCtrl',
            params : { input1: null, input2: null}
        })
        .state('thanks_for_registering', {
            url: '/users/thanks',
            templateUrl: '/views/users/thanks.html',
            controller: 'ThanksForRegisteringCtrl',
            params : {email: null}
        })
        .state('confirmed', {
            url: '/users/confirmed',
            templateUrl: '/views/users/confirmed.html',
            controller: 'UsersConfirmedCtrl'
        })
        .state('edit_account', {
            url: '/users/edit',
            templateUrl: '/views/users/edit.html',
            controller: 'UsersEditCtrl'
        })
        .state('forgot_password', {
            url: '/users/password/new',
            templateUrl: '/views/users/password/new.html',
            controller: 'UsersPasswordNewCtrl'
        })
        .state('forgot_password_confirmation', {
            url: '/users/forgot_password_confirmation',
            templateUrl: '/views/users/password/forgot_password_confirmation.html',
            controller: 'ForgotPasswordConfirmationCtrl',
            params : {email: null}
        })
        .state('change_password', {
            url: '/users/password/edit?token&client_id&uid',
            templateUrl: '/views/users/password/edit.html',
            controller: 'UsersPasswordEditCtrl'
        })
        .state('new_confirmation', {
            url: '/users/confirmation/new',
            templateUrl: '/views/users/confirmation/new.html',
            controller: 'UsersConfirmationNewCtrl'
        })
        .state('show_confirmation', {
            url: '/users/confirmation?access-token&account_confirmation_success&client&client_id&uid',
            templateUrl: '/views/users/confirmation/show.html',
            controller: 'UsersConfirmationShowCtrl'
        })
        .state('privacy', {
            url: '/privacy',
            templateUrl: '/views/privacy.html',
            controller: 'PrivacyCtrl'
        })
        .state('faq', {
            url: '/faq',
            templateUrl: '/views/faq.html',
            controller: 'FaqCtrl'
        })
        .state('course_list', {
            url: '/courses',
            templateUrl: '/views/course_list.html',
            controller: 'courseListCtrl'
        })
        .state('student_enroll_course', {
            url: '/courses/enroll?id',
            templateUrl: '/views/empty_view.html',
            controller: 'CoursesEnrollCtrl'
        })
        .state('new_course', {
            url: '/courses/new',
            templateUrl: '/views/teacher/course_list/new_course.html',
            controller: 'newCourseCtrl'
        })
        .state('course', {
            url: '/courses/:course_id',
            template: '<ui-view/>',
            controller: 'courseCtrl',
            resolve:{   //Injected 'ModuleModel' because it needs to load with the CourseModel
                CourseData:['CourseModel','ModuleModel', 'ItemsModel','$stateParams',function(CourseModel, ModuleModel, ItemsModel, $stateParams){
                    return CourseModel.getData($stateParams.course_id)
                }]
            }
        })
        .state('course.content_selector',{
            url:'/content',
            templateUrl: '/views/empty_view.html',
            controller: 'contentSelectorCtrl',
        })
        .state('course.module',{
            url:'/modules/:module_id',
            templateUrl: '/views/empty_view.html',
            controller: 'moduleCtrl',
            abstract:true
        })
        .state('course.module.course_editor', {
            url: '/course_editor',
            templateUrl: '/views/teacher/course_editor/course_editor.html',
            controller: 'courseEditorCtrl',
            abstract:true
        })
        .state('course.module.course_editor.overview', {
            url: '',
            views: {
                'details': {
                    templateUrl: '/views/teacher/course_editor/module.details.html',
                    controller: 'moduleDetailsCtrl'
                },
                'module': {
                    templateUrl: '/views/teacher/course_editor/module.middle.html',
                    controller: 'moduleMiddleCtrl'
                }
            }
        })
        .state('course.module.course_editor.lecture', {
            url: '/lectures/:lecture_id',
            views: {
                'details': {
                    templateUrl: '/views/teacher/course_editor/lecture.details.html',
                    controller: 'lectureDetailsCtrl'
                },
                'middle': {
                    templateUrl: '/views/teacher/course_editor/lecture.middle.html',
                    controller: 'lectureMiddleCtrl'
                }
            },
            params : { time:null }
        })
        .state('course.module.course_editor.quiz', {
            url: '/quizzes/:quiz_id',
            views: {
                'details': {
                    templateUrl: '/views/teacher/course_editor/quiz.details.html',
                    controller: 'quizDetailsCtrl'
                },
                'middle': {
                    templateUrl: '/views/teacher/course_editor/quiz.middle.html',
                    controller: 'quizMiddleCtrl'
                }
            }
        })
        .state('course.module.course_editor.customlink', {
            url: '/link/:customlink_id',
            views: {
                'details': {
                    templateUrl: '/views/teacher/course_editor/customlink.details.html',
                    controller: 'customLinkDetailsCtrl'
                },
                'middle': {
                    templateUrl: '/views/teacher/course_editor/customlink.middle.html',
                    controller: 'customLinkMiddleCtrl'
                }
            }
        })
        .state('course.course_editor', {
            url: '/course_editor?new_course',
            templateUrl: '/views/teacher/course_editor/course_editor.html',
            controller: 'courseEditorCtrl'
        })
        .state('course.progress', {
            url: '/progress',
            templateUrl: '/views/teacher/progress/progress.html',
            controller: 'progressCtrl'
        })
        .state('course.progress_graph', {
            url: "/progress/graph",
            templateUrl: '/views/teacher/progress/progress_graph.html',
            controller: 'progressGraphCtrl'
        })
        .state('course.progress_overview', {
            url: "/progress_overview",
            templateUrl: '/views/teacher/progress/progress_overview.html',
            controller: 'progressOverviewCtrl'
        })
        .state('course.module.progress_overview', {
            url: "/progress_overview",
            templateUrl: '/views/teacher/progress/progress_overview.html',
            controller: 'progressOverviewCtrl'
        })
        .state('course.module.progress', {
            url: "/progress?item_id",
            templateUrl: '/views/teacher/progress/progress_lecture.html',
            controller: 'progressLectureCtrl'
            // params : { item_id: null }
        })
        .state('course.module.progress_statistics', {
            url: "/progress/statistics",
            templateUrl: '/views/teacher/progress/student_statistics_tab.html',
            controller: 'studentStatisticsCtrl'
        })
        .state('course.module.progress_students', {
            url: "/progress/students",
            templateUrl: '/views/teacher/progress/lecture_progress_tab.html',
            controller: 'lectureProgressCtrl'
        })
        .state('course.module.courseware', {
            url: '/courseware',
            templateUrl: '/views/student/lectures/courseware.html',
            controller: 'coursewareCtrl'
        })
        .state('course.module.courseware.overview', {
            url: '/overview',
            templateUrl: '/views/student/course/module_overview.html',
            controller: 'studentModuleOverviewCtrl'
        })
        .state('course.module.courseware.lecture', {
            url: '/lectures/:lecture_id?time',
            reloadOnSearch : false,
            templateUrl: '/views/student/lectures/lecture.middle.html',
            controller: 'studentLectureMiddleCtrl'
        })
        .state('course.module.student_inclass', {
            url: '/student_inclass',
            templateUrl: '/views/student/inclass/inclass.html',
            controller: 'studentInclassCtrl'
        })
        .state('course.module.courseware.quiz', {
            url: '/quizzes/:quiz_id',
            templateUrl: '/views/student/lectures/quiz.middle.html',
            controller: 'studentQuizMiddleCtrl'
        })
        .state('course.enrolled_students', {
            url: '/enrolled_students',
            templateUrl: '/views/teacher/course/enrolled_students.html',
            controller: 'enrolledStudentsCtrl'
        })
        .state('course.send_emails', {
            url: '/send_emails',
            templateUrl: '/views/teacher/course/send_emails.html',
            controller: 'sendEmailsCtrl'
        })
        .state('course.announcements', {
            url: '/announcements',
            templateUrl: '/views/teacher/announcements/announcements.html',
            controller: 'announcementsCtrl',
            params : { show: null }
        })
        .state('course.course_information', {
            url: '/course_information?new_enroll',
            templateUrl: '/views/student/course/course_information.html',
            controller: 'studentCourseInformationCtrl'
        })
        .state('course.edit_course_information', {
            url: '/information?new_course',
            templateUrl: '/views/teacher/course/course_information.html',
            controller: 'teacherCourseInformationCtrl'
        })
        .state('course.inclass', {
            url: '/inclass',
            templateUrl: '/views/teacher/in_class/inclass.html',
            controller: 'inclassCtrl'
        })
        .state('course.module.inclass', {
            url: "/inclass",
            templateUrl: '/views/teacher/in_class/inclass_module.html',
            controller: 'inclassModuleCtrl'
        })
        .state('course.module.inclass.display_quizzes', {
            url: '/display_quizzes',
            templateUrl: '/views/teacher/in_class/display_quizzes.html',
            controller: 'displayQuizzesCtrl'
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: '/views/dashboard.html',
            controller: 'dashboardCtrl'
        })
        .state('statistics', {
          url: '/statistics',
          templateUrl: '/views/statistics/statistics.html',
          controller: 'statisticsCtrl'
        })
        .state('lti_course_list', {
            url: '/lti_course_list?return_url&email&full_name&first_name&last_name&consumer_key&resource_context_id&access-token&client&expiry&token-type&uid&redirect_local_url&redirect_boolean',
            templateUrl: '/views/teacher/course_list/lti_course_list.html',
            controller: 'ltiCourseListCtrl'
        })
        .state('lti_sign_in_token', {
            url: '/lti_sign_in_token?redirect_local_url&status&redirect_boolean&access-token&client&expiry&token-type&uid',
            templateUrl: '/views/teacher/course_list/lti_sign_in_token.html',
            controller: 'ltiSignInTokenCtrl'
        })
        .state('school_statistics', {
          url: '/school_statistics',
          templateUrl: '/views/statistics/school_statistics.html',
          controller: 'schoolStatisticsCtrl'
        })
        .state('school_gdpr_download', {
            url: '/school_gdpr_download',
            templateUrl: '/views/statistics/school_gdpr_download.html',
            controller: 'schoolGdprDownloadCtrl'
        }) 
        .state('welcome_message', {
          url: '/welcome_message',
          templateUrl: '/views/welcome_message.html',
          controller: 'welcomeMessageCtrl'
        })
        .state('show_shared', {
          url: '/show_shared',
          templateUrl: '/views/teacher/sharing/shared.html',
          controller: 'sharedCtrl'
        })
        .state('student_getting_started', {
          url: '/help/student/getting_started',
          templateUrl: '/views/student/help/student_getting_started.html',
          controller: 'StudentGettingStartedCtrl'
        })
        .state('lti_help', {
          url: '/help/lti_help',
          templateUrl: '/views/teacher/help/lti_help.html',
          controller: 'LtiKeyGenerateCtrl'
        })
        .state('teacher_getting_started', {
          url: '/help/teacher/getting_started',
          templateUrl: '/views/teacher/help/teacher_getting_started.html',
          controller: 'TeacherGettingStartedCtrl'
        })
        .state('preview', {
          url: '/preview',
          params : { course_id: null, module_id: null, lecture_id: null,quiz_id:null,time:null, prevState:null },
          controller: ['Preview','$state',function(Preview,$state){
                Preview.start()
            }
          ]
        })
}])
