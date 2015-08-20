'use strict';

angular.module('scalearAngularApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ngTouch',
    // 'ui.bootstrap.accordion',
    // 'ui.bootstrap.tabs',
    // 'ui.bootstrap.collapse',
    // 'ui.bootstrap.transition',
    'ui.bootstrap.datepicker',
    // 'ui.bootstrap.alert',
    // 'ui.bootstrap.modal',
    // 'ui.bootstrap.tooltip',
    'ui.bootstrap.timepicker',
    // 'ui.bootstrap.popover',
    'ui.sortable',
    'ui.calendar',
    'ngDragDrop',
    'pasvaz.bindonce',
    'infinite-scroll',
    'xeditable',
    'googlechart',
    'pascalprecht.translate',
    'angularMoment',
    'textAngular',
    'highcharts-ng',
    'config',
    'chieffancypants.loadingBar',
    'anguFixedHeaderTable',
    'mm.foundation',
    // 'mm.foundation.accordion',
    // 'mm.foundation.alert',
    // 'mm.foundation.bindHtml',
    // 'mm.foundation.buttons',
    // 'mm.foundation.dropdownToggle',
    // 'mm.foundation.modal',
    // 'mm.foundation.offcanvas',
    // 'mm.foundation.popover',
    // 'mm.foundation.position',
    // 'mm.foundation.progressbar',
    // 'mm.foundation.tabs',
    // 'mm.foundation.tooltip',
    // 'mm.foundation.tour',
    // 'mm.foundation.transition',
    // 'mm.foundation.typeahead',
    // 'mm.foundation.topbar',
    'Mac',
    'dcbImgFallback',
    'ngClipboard',
    'ngTextTruncate'
    // 'duScroll',
    // 'ngAnimate'
])
    .constant('headers', {
        withCredentials: true,
        'X-Requested-With': 'XMLHttpRequest'
    })
   // .value('$anchorScroll', angular.noop)
    .run(['$http', '$rootScope', 'editableOptions', 'editableThemes', 'UserSession', '$state', 'ErrorHandler', '$timeout', '$window', '$log', '$translate', '$cookies', '$tour',
        function($http, $rootScope, editableOptions, editableThemes, UserSession, $state, ErrorHandler, $timeout, $window, $log, $translate, $cookies, $tour) {


            $http.defaults.headers.common['X-CSRF-Token'] = $cookies['XSRF-TOKEN']
            $rootScope.show_alert = "";
            editableOptions.theme = 'default';
            editableThemes['default'].submitTpl = '<button class="button tiny with-tiny-padding with-medium-padding-right with-medium-padding-left no-margin-bottom size-1 success check" type="submit"><i class="fi-check"></i></button>';
            editableThemes['default'].cancelTpl = '<button class="button tiny with-tiny-padding with-medium-padding-right with-medium-padding-left no-margin-bottom size-1 alert cancel" type="button" ng-click="$form.$cancel()"><i class="fi-x"></i></button>';
            editableThemes['default'].errorTpl = '<small class="error with-tiny-padding position-relative" ng-show="$error" ng-bind="$error" style="z-index:90"></small>'
            $rootScope.textAngularOpts = {
                toolbar: [
                    ['h1', 'h2', 'h3', 'p', 'pre', 'quote'],
                    ['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
                    ['insertLink', 'unlink', 'insertImage']
                ],
                classes: {
                    // focussed: "focussed",
                    // toolbar: "btn-toolbar",
                    toolbarGroup: "button-group tiny custom_button_group",
                    toolbarButton: "button tiny secondary",
                    // toolbarButtonActive: "active",
                    textEditor: 'form-control',
                    htmlEditor: 'form-control'
                }
            }


            $log.debug("lang is " + $rootScope.current_lang);
            var statesThatDontRequireAuth = ['login', 'teacher_signup', 'student_signup', 'thanks_for_registering', 'forgot_password', 'change_password', 'show_confirmation', 'new_confirmation', 'home', 'privacy', 'ie', 'student_getting_started', 'teacher_getting_started']
            var statesThatForStudents = ['course.student_calendar', 'course.course_information', 'course.courseware']
            var statesThatForTeachers = [ 'new_course', 'course.course_editor', 'course.calendar', 'course.enrolled_students', 'send_email', 'send_emails', 'course.announcements', 'course.edit_course_information', 'course.teachers', 'course.progress', 'course.progress.main', 'course.progress.module', 'statistics']
            var statesThatRequireNoAuth = ['login','student_signup', 'teacher_signup', 'thanks_for_registering', 'new_confirmation', 'forgot_password', 'change_password', 'show_confirmation']

            //check if route requires no auth
            var stateNoAuth = function(state) {
                for (var element in statesThatRequireNoAuth) {
                    var input = statesThatRequireNoAuth[element];
                    if (state.substring(0, input.length) === input)
                        return true;
                }
                return false;
            }

            // check if route does not require authentication
            var routeClean = function(state) {
                for (var element in statesThatDontRequireAuth) {
                    var input = statesThatDontRequireAuth[element];
                    if (state.substring(0, input.length) === input)
                        return true
                }
                return false;
            }

            var stateStudent = function(state) {
                for (var element in statesThatForStudents) {
                    var input = statesThatForStudents[element];
                    if (state.substring(0, input.length) === input)
                        return true
                }
                return false;
            }

            var stateTeacher = function(state) {
                for (var element in statesThatForTeachers) {
                    var input = statesThatForTeachers[element];
                    if (state.substring(0, input.length) === input)
                        return true
                }
                return false;
            }
            $window.onbeforeunload = function() {
                $rootScope.unload = true;
            }

            $rootScope.$on('$stateChangeStart', function(ev, to, toParams, from) {
                if($tour.isActive()){
                    $tour.end();
                }                

               UserSession.getRole().then(function(result) {
                    var s = 1;
                    if (/MSIE (\d+\.\d+);/.test($window.navigator.userAgent) && to.name !== "home") {
                        $state.go("ie");
                    }

                    if($rootScope.current_user && $rootScope.current_user.info_complete === false){
                        $state.go('edit_account')
                        s = 2;
                    }
                    else{
                        if(to.name === 'confirmed'){
                            if(from.name === 'show_confirmation'){
                                $state.go("confirmed")
                            }
                            else{
                                $state.go("home");
                                s = 0;
                            }
                        }
                        if($rootScope.current_user && !$rootScope.current_user.intro_watched && to.name !== "edit_account"){
                            $state.go('confirmed')
                            s = 1;
                        }
                        if (!routeClean(to.name) && result === 0 ){ // user not logged in trying to access a page that needs authentication.
                            $state.go("login");
                            s = 0;
                        } else if ((stateTeacher(to.name) && result === 2)){ // student trying to access teacher page //routeTeacher($location.url()) && result ||
                            $state.go("course_list");
                            s = 0;
                        } 
                        else if ((stateStudent(to.name) && result === 1)){ // teacher trying to access student page //(routeStudent($location.url()) && !result) ||
                            $state.go("course_list");
                            s = 0;
                        } 
                        else if ((to.name === "login" || to.name === "teacher_signup" || to.name === "student_signup") && result === 1)// teacher going to home, redirected to courses page
                            $state.go("course_list");
                        else if ((to.name === "login" || to.name === "teacher_signup" || to.name === "student_signup") && result === 2)// student going to home, redirected to student courses page
                            $state.go("course_list");
                        else if (stateNoAuth(to.name)) {
                            if (result === 1 || result === 2) {
                                $state.go("home");
                                s = 0;
                            }
                        }
                    }

                    if (s === 0) {
                        $rootScope.show_alert = "error";
                        ErrorHandler.showMessage('Error ' + ': ' + $translate("controller_msg.you_are_not_authorized"), 'errorMessage', 8000);
                        $timeout(function() {
                            $rootScope.show_alert = "";
                        }, 4000);
                    }
                    if(s === 2){
                        $rootScope.show_alert = "error";
                        ErrorHandler.showMessage($translate("controller_msg.update_account_information"), 'errorMessage', 8000);
                        $timeout(function() {
                            $rootScope.show_alert = "";
                        }, 4000);
                    }
               })

        });

    }
])

.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$translateProvider', '$logProvider', 'cfpLoadingBarProvider', 'scalear_api',function($stateProvider, $urlRouterProvider, $httpProvider, $translateProvider, $logProvider, cfpLoadingBarProvider, scalear_api) {
        cfpLoadingBarProvider.includeSpinner = true;
        // cfpLoadingBarProvider.color = 'black';

        $logProvider.debugEnabled(scalear_api.debug)

        $translateProvider
            .translations('en', translation_en())
            .translations('sv', translation_sv());
        $translateProvider.preferredLanguage('en');
        $translateProvider.useCookieStorage();

        //$httpProvider.defaults.headers.common['X-CSRF-Token'] = $cookies['XSRF-TOKEN']//$('meta[name=csrf-token]').attr('content');        

        $httpProvider.defaults.withCredentials = true;
        $httpProvider.interceptors.push('ServerInterceptor');

        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                 views:{
                    'landing':{
                        templateUrl: '/views/main.html',
                        controller: 'MainCtrl'
                    },
                }
                // templateUrl: '/views/main.html',
                // controller: 'MainCtrl'
            })
            .state('ie', {
                url: '/ie',
                templateUrl: '/views/ie.html'
            })
            .state('forum', {
                url: '/forum',
                templateUrl: '/views/forum/forum.html',
                controller: 'forumCtrl'
            })
            .state('login', {
                url: '/users/login',
                templateUrl: '/views/login.html',
                controller: 'LoginCtrl'
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
            .state('thanks_for_registering', {
                url: '/users/thanks?type',
                templateUrl: '/views/users/thanks.html',
                controller: 'ThanksForRegisteringCtrl'
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
                // views:{
                //     // 'user_navigation':{
                //     //     templateUrl: '/views/user_navigation.html',
                //     //     controller: 'navigationCtrl'
                //     // },
                //     '':{
                        
                //     }
                // }
            })
            .state('profile', {
                url: '/users/profile/:user_id',
                templateUrl: '/views/users/profile.html',
                controller: 'UsersProfileCtrl'
            })
            .state('forgot_password', {
                url: '/users/password/new',
                templateUrl: '/views/users/password/new.html',
                controller: 'UsersPasswordNewCtrl'
            })
            .state('change_password', {
                url: '/users/password/edit?reset_password_token',
                templateUrl: '/views/users/password/edit.html',
                controller: 'UsersPasswordEditCtrl'
            })
            .state('new_confirmation', {
                url: '/users/confirmation/new',
                templateUrl: '/views/users/confirmation/new.html',
                controller: 'UsersConfirmationNewCtrl'
            })
            .state('show_confirmation', {
                url: '/users/confirmation?confirmation_token',
                templateUrl: '/views/users/confirmation/show.html',
                controller: 'UsersConfirmationShowCtrl'
            })
            .state('privacy', {
                url: '/privacy',
                templateUrl: '/views/privacy.html',
                controller: 'PrivacyCtrl'
            })
            .state('course_list', {
                url: '/courses',
                templateUrl: '/views/course_list.html',
                controller: 'courseListCtrl'
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
                resolve:{
                    course_data:['courseResolver','$stateParams',function(courseResolver, $stateParams){
                        return courseResolver.init($stateParams.course_id)
                    }]
                }
            })           
            .state('course.module',{
                url:'/modules/:module_id',
                templateUrl: '/views/empty_view.html',
                controller: 'moduleCtrl',
                abstract:true
            })
            .state('course.module.course_editor', {
                url: '/course_editor',
                // templateUrl: '/views/teacher/course_editor/module.middle.html',
                // controller: 'moduleMiddleCtrl'
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
                }
            })
            // .state('course.course_editor.lecture.quizList', {
            //     url: '/qy',
            //     views: {
            //         'quizList': {
            //             templateUrl: '/views/teacher/course_editor/lecture.middle.quiz_list.html',
            //             controller: 'lectureQuizListCtrl'
            //         }
            //     }
            // })
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
                url: '/course_editor',
                // templateUrl: '/views/teacher/course_editor/module.middle.html',
                // controller: 'moduleMiddleCtrl'
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
            .state('course.progress_main', {
                url: "/progress/main",
                templateUrl: '/views/teacher/progress/progress_main.html',
                controller: 'progressMainCtrl'
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
                url: "/progress",
                templateUrl: '/views/teacher/progress/progress_lecture.html',
                controller: 'progressLectureCtrl'
            })            
            .state('course.module.progress_details', {
                url: "/progress/details",
                templateUrl: '/views/teacher/progress/progress_module.html',
                controller: 'progressModuleCtrl'
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
            // .state('course.module.courseware',{
            //     url:'/modules/:module_id',
            //     templateUrl: '/views/empty_view.html',
            //     controller: 'studentModulesCtrl',
            // })
            .state('course.module.courseware.lecture', {
                url: '/lectures/:lecture_id?time',
                // views: {
                //     'middle': {
                //         templateUrl: '/views/student/lectures/lecture.middle.html',
                //         controller: 'studentLectureMiddleCtrl'
                //     },
                //     'right': {
                //         templateUrl: '/views/student/lectures/lecture.right.html',
                //         controller: 'studentLectureMiddleCtrl'
                //     }
                // }
                templateUrl: '/views/student/lectures/lecture.middle.html',
                controller: 'studentLectureMiddleCtrl'
            })
            .state('course.module.courseware.quiz', {
                url: '/quizzes/:quiz_id',
                // views: {
                //     'quiz': {
                //         templateUrl: '/views/student/lectures/quiz.middle.html',
                //         controller: 'studentQuizMiddleCtrl'
                //     }
                // }
                templateUrl: '/views/student/lectures/quiz.middle.html',
                controller: 'studentQuizMiddleCtrl'
            })
            .state('course.calendar', {
                url: '/events',
                templateUrl: '/views/teacher/calendar/calendar.html',
                controller: 'teacherCalendarCtrl'
            })
            .state('course.student_calendar', {
                url: '/student/events',
                templateUrl: '/views/student/calendar/calendar.html',
                controller: 'studentCalendarCtrl'
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
                controller: 'announcementsCtrl'
            })
            .state('course.course_information', {
                url: '/course_information',
                templateUrl: '/views/student/course/course_information.html',
                controller: 'studentCourseInformationCtrl'
            })
            .state('course.edit_course_information', {
                url: '/information',
                templateUrl: '/views/teacher/course/course_information.html',
                controller: 'teacherCourseInformationCtrl'
            })
            // .state('course.teachers', {
            //     url: '/teachers',
            //     templateUrl: '/views/teacher/course/teachers.html',
            //     controller: 'courseTeachersCtrl'
            // })
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
            // .state('student_courses', {
            //     url: '/student_courses',
            //     templateUrl: '/views/student/course_list/course_list.html',
            //     controller: 'studentCourseListCtrl'
            // })
            .state('statistics', {
              url: '/statistics',
              templateUrl: '/views/statistics/statistics.html',
              controller: 'statisticsCtrl'
            })
            .state('show_shared', {
              url: '/show_shared',
              templateUrl: '/views/shared.html',
              controller: 'sharedCtrl'
            })
            .state('student_getting_started', {
              url: '/help/student/getting_started',
              templateUrl: '/views/help/student_getting_started.html',
              controller: 'StudentGettingStartedCtrl'
            })
            .state('teacher_getting_started', {
              url: '/help/teacher/getting_started',
              templateUrl: '/views/help/teacher_getting_started.html',
              controller: 'TeacherGettingStartedCtrl'
            })
    }
])