'use strict';


  angular.module('scalearAngularApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap.accordion',
  'ui.bootstrap.tabs',
  'ui.bootstrap.collapse',
  'ui.bootstrap.transition',
  'ui.bootstrap.datepicker',
  'ui.bootstrap.alert',
  'ui.bootstrap.modal',
  'ui.bootstrap.tooltip',
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
   'config'
])//.constant('scalear_api', {host:'http://localhost:3000'}) // //http://angular-learning.herokuapp.com
.constant('headers', {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'})
  .value('$anchorScroll', angular.noop)
  .run(['$rootScope','scalear_api', 'editableOptions', '$location', 'UserSession', '$state', 'ErrorHandler', '$timeout', '$window', '$log','$translate', function($rootScope,scalear_api, editableOptions, $location, UserSession, $state, ErrorHandler, $timeout, $window,$log, $translate) {

  	  $rootScope.show_alert="";
      editableOptions.theme = 'bs2';
      $rootScope.textAngularOpts = {
          toolbar: [
              ['h1', 'h2', 'h3', 'p', 'pre', 'quote'],
              ['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
              ['html', 'insertLink', 'unlink', 'insertImage']
          ],
          classes: {
              focussed: "focussed",
              toolbar: "btn-toolbar",
              toolbarGroup: "btn-group",
              toolbarButton: "btn btn-default",
              toolbarButtonActive: "active",
              textEditor: 'form-control',
              htmlEditor: 'form-control'
          }
      }

      $log.debug("lang is "+ $rootScope.current_lang);
    	var statesThatDontRequireAuth =['login', 'home', 'privacy', 'ie']
		  var statesThatForStudents=['student_courses','course.student_calendar', 'course.course_information', 'course.lectures']
		  var statesThatForTeachers=['course_list','new_course', 'course.course_editor', 'course.calendar', 'course.enrolled_students', 'send_email', 'send_emails', 'course.announcements', 'course.edit_course_information','course.teachers', 'course.progress', 'course.progress.main', 'course.progress.module']

  		// check if route does not require authentication
  		var routeClean = function(state) {
  			 for(var element in statesThatDontRequireAuth)
  			{
  				var input =statesThatDontRequireAuth[element];
  				if(state.substring(0, input.length) == input)
  				return true
  			}
  			return false;
  		}

  		var stateStudent = function(state) {
  			for(var element in statesThatForStudents)
  			{
  				var input =statesThatForStudents[element];
  				if(state.substring(0, input.length) == input)
  				return true
  			}
  			return false;
  		}
  		
  		var stateTeacher = function(state) {
  			for(var element in statesThatForTeachers)
  			{
  				var input =statesThatForTeachers[element];
  				if(state.substring(0, input.length) == input)
  					return true
  			}
  			return false;
  		}
		$window.onbeforeunload= function(){
			$rootScope.unload=true;
		}

//          $rootScope.$on('$viewContentLoading',
//              function(event, viewConfig){
//                  $rootScope.start_loading=true;
//                  // Access to all the view config properties.
//                  // and one special property 'targetView'
//                  // viewConfig.targetView
//              });
//          $rootScope.$on('$viewContentLoaded',
//              function(event){
//                  $rootScope.start_loading=false;
//              });
//
//          $rootScope.$on('stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
//              console.log("in success")
//              $rootScope.start_loading=false;
//            });
//
//          $rootScope.$on('stateChangeError', function (ev, to, toParams, from, fromParams) {
//              console.log("in success")
//              $rootScope.start_loading=false;
//          });

       $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {

            //$rootScope.start_loading=true;
    		UserSession.getRole().then(function(result){
    			var s=1;

         if(result==0)
         {
            window.location=scalear_api.host+"/"+$rootScope.current_lang+"/users/sign_angular_in?angular_redirect="+scalear_api.redirection_url; //http://localhost:9000/#/ //http://angular-edu.herokuapp.com/#/

         }
          else if(/MSIE (\d+\.\d+);/.test($window.navigator.userAgent))
          {
              $state.go("ie");
          }
    			if(!routeClean(to.name) && result==0) // user not logged in trying to access a page that needs authentication.
    				{
    					$state.go("login");
    					s=0;
    				}
    			else if( (stateTeacher(to.name) && result==2)) // student trying to access teacher page //routeTeacher($location.url()) && result ||
    				{
    					$state.go("student_courses");
    					s=0;
    				}
    			else if( (stateStudent(to.name) && result==1)) // teacher trying to access student page //(routeStudent($location.url()) && !result) ||
    				{
    					$state.go("course_list");
    					s=0;
    				}
    			else if( to.name=="home" && result==1 ) // teacher going to home, redirected to courses page
    				{
    					$state.go("course_list");
    				}
    			else if( to.name=="home" && result==2 ) // student going to home, redirected to student courses page
    				{
    					$state.go("student_courses");
    				}
    				
    				if(s==0){
    					$rootScope.show_alert="error";
      					ErrorHandler.showMessage('Error ' + ': ' + $translate("controller_msg.you_are_not_authorized"), 'errorMessage', 8000);
      					$timeout(function(){
      					 $rootScope.show_alert="";	
      					},4000);
    					}
    			// success
    			}
  			)
    		
  	});
      
  }])  

  .config(['$stateProvider','$urlRouterProvider','$httpProvider','$translateProvider', '$logProvider', function ($stateProvider, $urlRouterProvider, $httpProvider, $translateProvider, $logProvider) {

    $logProvider.debugEnabled(false)

    //**********Translations*********
    $translateProvider
      .translations('en', translation_en())
      .translations('sv', translation_sv());
    $translateProvider.preferredLanguage('en');
    $translateProvider.useCookieStorage();
    //**********END*********

    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');        

    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('ServerInterceptor');

   
    $urlRouterProvider.otherwise('/');    
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/views/main.html',
        controller: 'MainCtrl'
      })
      .state('ie', {
        url: '/ie',
        templateUrl: '/views/ie.html'
      })
      .state('login', {
      	url:'/login',
      templateUrl: '/views/login.html',
      controller: 'LoginCtrl'
   	 })
   	 .state('privacy',{
   	 	url:'/privacy',
   	 	templateUrl:'/views/privacy.html',
   	 	controller: 'PrivacyCtrl'
   	 })
      .state('course_list', {
        url:'/courses',
        templateUrl: '/views/teacher/course_list/course_list.html',
        controller: 'courseListCtrl'
      })
      .state('new_course', {
        url:'/courses/new',
        templateUrl: '/views/teacher/course_list/new_course.html',
        controller: 'newCourseCtrl'
      })
      .state('course', {
        url: '/courses/:course_id',
        views:{
          'navigation':{templateUrl: '/views/navigation.html', controller: 'navigationCtrl'},
          '':{template:'<ui-view/>'}
        },
        abstract:true
      })
       .state('course.lectures', {
      url: '/courseware',
      templateUrl: '/views/student/lectures/lectures.html',
      controller: 'studentLecturesCtrl'
      })
      .state('course.lectures.lecture', {
        url: '/lectures/:lecture_id',
        views:{
          'middle'  :{templateUrl: '/views/student/lectures/lecture.middle.html',  controller: 'studentLectureMiddleCtrl'}
        }        
      })
      .state('course.lectures.quiz', {
        url: '/quizzes/:quiz_id',
        views:{
          'middle'  :{templateUrl: '/views/student/lectures/quiz.middle.html',  controller: 'studentQuizMiddleCtrl'}
        }        
      })
      .state('course.course_editor', {
        url: '/course_editor',
        templateUrl: '/views/teacher/course_editor/course_editor.html',
        controller: 'courseEditorCtrl'
      })
      .state('course.course_editor.module',{
        url:'/modules/:module_id',
        views:{
          'details' :{templateUrl: '/views/teacher/course_editor/module.details.html', controller: 'moduleDetailsCtrl'},
          'middle'  :{templateUrl: '/views/teacher/course_editor/module.middle.html',  controller: 'moduleMiddleCtrl'}
        }
      })
      .state('course.course_editor.lecture', {
        url: '/lectures/:lecture_id',
        views:{
          'details' :{templateUrl: '/views/teacher/course_editor/lecture.details.html', controller: 'lectureDetailsCtrl'},
          'middle'  :{templateUrl: '/views/teacher/course_editor/lecture.middle.html',  controller: 'lectureMiddleCtrl'}
        }        
      })
      .state('course.course_editor.lecture.quizList', {
        views:{         
          'quizList':{templateUrl: '/views/teacher/course_editor/lecture.middle.quiz_list.html', controller: 'lectureQuizListCtrl'}
        }        
      })
      .state('course.course_editor.quiz', {
        url: '/quizzes/:quiz_id',
        views:{
          'details' :{templateUrl: '/views/teacher/course_editor/quiz.details.html', controller: 'quizDetailsCtrl'},
          'middle'  :{templateUrl: '/views/teacher/course_editor/quiz.middle.html',  controller: 'quizMiddleCtrl'}
        }
      })
      .state('course.progress', {
        url:'/progress',
        templateUrl: '/views/teacher/progress/progress.html',
        controller: 'progressCtrl'
      })
      .state('course.progress.main', {
        url: "/main",
        templateUrl: '/views/teacher/progress/progress_main.html',
        controller: 'progressMainCtrl'
      })
      .state('course.progress.module', {
        url: "/modules/:module_id",
        templateUrl: '/views/teacher/progress/progress_module.html',
        controller: 'progressModuleCtrl'
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
      url:'/announcements',
      templateUrl: '/views/teacher/announcements/announcements.html',
      controller: 'announcementsCtrl'
      })
      .state('course.course_information', {
        url: '/course_information',
        templateUrl: '/views/student/course/course_information.html',
        controller: 'studentCourseInformationCtrl'
      })
      .state('course.edit_course_information', {
            url: '',
            templateUrl: '/views/teacher/course/course_information.html',
            controller: 'teacherCourseInformationCtrl'
      })
      .state('course.teachers', {
         url: '/teachers',
         templateUrl: '/views/teacher/course/teachers.html',
         controller: 'courseTeachersCtrl'
      })
      .state('course.inclass', {
        url: '/inclass',
        templateUrl: '/views/teacher/in_class/inclass.html',
        controller: 'inclassCtrl'
      })
      .state('course.inclass.module', {
        url: "/modules/:module_id",
        templateUrl: '/views/teacher/in_class/inclass_module.html',
        controller: 'inclassModuleCtrl'
      })
      .state('course.inclass.display_quizzes', {
        url:'/display_quizzes',
        templateUrl: '/views/teacher/in_class/display_quizzes.html',
        controller: 'displayQuizzesCtrl'
    })
      .state('student_courses', {
        url:'/student_courses',
        templateUrl: '/views/student/course_list/course_list.html',
        controller: 'studentCourseListCtrl'
      })
  }])




