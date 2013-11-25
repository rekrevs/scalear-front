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
  'ui.sortable',
  'ui.calendar',
  'ngDragDrop',
  'pasvaz.bindonce',
  'infinite-scroll',
  'xeditable',
  'ui.calendar',
  'ui.tinymce',
  'googlechart'
]).constant('scalear_api', {host:'http://localhost:3000'}) // //http://angular-learning.herokuapp.com

  .constant('headers', {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'})
  .value('$anchorScroll', angular.noop)
  .run(function($rootScope, editableOptions, $location, UserSession, $state, ErrorHandler, $timeout) {
  	  $rootScope.show_alert="";
      editableOptions.theme = 'bs2';
      
    	var statesThatDontRequireAuth =['login', 'home']
		  var statesThatForStudents=['student_courses','course.student_calendar', 'course.course_information', 'course.lectures']
		  var statesThatForTeachers=['course_list','new_course', 'course.course_editor', 'course.calendar', 'course.enrolled_students', 'send_email', 'send_emails', 'course.announcements', 'course.edit_course_information','course.teachers', 'course.progress', 'course.progress.main', 'course.progress.module']

  		// check if route does not require authentication
  		var routeClean = function(state) {
  			 for(var element in statesThatDontRequireAuth)
  			{
  				var input =statesThatDontRequireAuth[element];
  				if(state.substring(0, input.length) === input)
  				return true
  			}
  			return false;
  		}

  		var stateStudent = function(state) {
  			for(var element in statesThatForStudents)
  			{
  				var input =statesThatForStudents[element];
  				if(state.substring(0, input.length) === input)
  				return true
  			}
  			return false;
  		}
  		
  		var stateTeacher = function(state) {
  			for(var element in statesThatForTeachers)
  			{
  				var input =statesThatForTeachers[element];
  				if(state.substring(0, input.length) === input)
  					return true
  			}
  			return false;
  		}

  		$rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
    	
    		UserSession.getRole().then(function(result){
    			var s=1;
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
      					ErrorHandler.showMessage('Error ' + ': ' + "You are not Authorized", 'errorMessage', 8000);
      					$timeout(function(){
      					 $rootScope.show_alert="";	
      					},4000);
    					}
    			// success
    			}
  			)
    		
  	});
      
  })  

  .config(['$stateProvider','$urlRouterProvider','$httpProvider',function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');        

    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('ServerInterceptor');

   
    $urlRouterProvider.otherwise('/');    
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('login', {
      	url:'/login',
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
   	 })
      .state('course_list', {
        url:'/courses',
        templateUrl: 'views/teacher/course_list/course_list.html',
        controller: 'courseListCtrl'
      })
      .state('new_course', {
        url:'/courses/new',
        templateUrl: 'views/teacher/course_list/new_course.html',
        controller: 'newCourseCtrl'
      })
      .state('course', {
        url: '/courses/:course_id',
        views:{
          'navigation':{templateUrl: 'views/navigation.html', controller: 'navigationCtrl'},
          '':{template:'<ui-view/>'}
        },
        resolve:{
          course_information:function($http, $stateParams, $rootScope, scalear_api, headers){
            return $http({method: 'GET', headers:headers, url: scalear_api.host+'/en/courses/'+$stateParams.course_id});
          }
        },
        abstract:true
      })
       .state('course.lectures', {
      url: '/lectures',
      templateUrl: 'views/student/lectures/lectures.html',
      controller: 'studentLecturesCtrl'
      })
      .state('course.course_editor', {
        url: '/course_editor',
        templateUrl: 'views/teacher/course_editor/course_editor.html',
        controller: 'courseEditorCtrl'
      })
      .state('course.course_editor.module',{
        resolve:{
          module:function($http, $stateParams, $rootScope, scalear_api, headers){
            return $http({method: 'GET', headers:headers, url: scalear_api.host+'/en/courses/'+$stateParams.course_id+'/groups/'+$stateParams.module_id+'/get_group_angular'});
          }
        },
        url:'/modules/:module_id',
        views:{
          'details' :{templateUrl: 'views/teacher/course_editor/module.details.html', controller: 'moduleDetailsCtrl'},
          'middle'  :{templateUrl: 'views/teacher/course_editor/module.middle.html',  controller: 'moduleMiddleCtrl'}
        }
      })
      .state('course.course_editor.lecture', {
        resolve:{
          lecture:function($http, $stateParams, $rootScope, scalear_api, headers){
            return $http({method: 'GET', headers:headers, url: scalear_api.host+'/en/courses/'+$stateParams.course_id+'/lectures/'+$stateParams.lecture_id})
          }
        },
        url: '/lectures/:lecture_id',
        views:{
          'details' :{templateUrl: 'views/teacher/course_editor/lecture.details.html', controller: 'lectureDetailsCtrl'},
          'middle'  :{templateUrl: 'views/teacher/course_editor/lecture.middle.html',  controller: 'lectureMiddleCtrl'}
        }        
      })
      .state('course.course_editor.lecture.quizList', {
        views:{         
          'quizList':{templateUrl: 'views/teacher/course_editor/lecture.middle.quiz_list.html', controller: 'lectureQuizListCtrl'}
        }        
      })
      .state('course.course_editor.quiz', {
        resolve:{ 
          quiz:function($http, $stateParams, $rootScope, scalear_api, headers){
            return $http({method: 'GET', url: scalear_api.host+'/en/courses/'+$stateParams.course_id+'/quizzes/'+$stateParams.quiz_id, headers: headers})
          }
        },
        url: '/quizzes/:quiz_id',
        views:{
          'details' :{templateUrl: 'views/teacher/course_editor/quiz.details.html', controller: 'quizDetailsCtrl'},
          'middle'  :{templateUrl: 'views/teacher/course_editor/quiz.middle.html',  controller: 'quizMiddleCtrl'}
        }
      })
      .state('course.progress', {
        url:'/progress',
        templateUrl: 'views/teacher/progress/progress.html',
        controller: 'progressCtrl'
      })
      .state('course.progress.main', {
        url: "/main",
        templateUrl: 'views/teacher/progress/progress_main.html',
        controller: 'progressMainCtrl'
      })
      .state('course.progress.module', {
        url: "/modules/:module_id",
        templateUrl: 'views/teacher/progress/progress_module.html',
        controller: 'progressModuleCtrl'
      })
      .state('course.calendar', {
        resolve:{
          events:function($http, $stateParams, headers,scalear_api){
            return $http({method:'GET', url:scalear_api.host+'/en/courses/'+$stateParams.course_id+'/events', headers:headers})
          }
        },
        url: '/events',
        templateUrl: 'views/teacher/calendar/calendar.html',
        controller: 'TeacherCalendarCtrl'
      })
      .state('course.student_calendar', {
        resolve:{
          events:function($http, $stateParams, headers,scalear_api){
            return $http({method:'GET', url:scalear_api.host+'/en/courses/'+$stateParams.course_id+'/events', headers:headers})
          }
        },
        url: '/student/events',
        templateUrl: 'views/student/calendar/calendar.html',
        controller: 'StudentCalendarCtrl'
      })
      .state('course.enrolled_students', {
        resolve:{
            students:function($http, $stateParams, headers, scalear_api){
                return $http({method:'GET', url:scalear_api.host+'/en/courses/'+$stateParams.course_id+'/enrolled_students', headers:headers})
            }
        },
        url: '/enrolled_students',
        templateUrl: 'views/teacher/course/enrolled_students.html',
        controller: 'TeacherCourseEnrolledStudentsCtrl'
      })
      .state('course.send_email', {
        resolve:{
            emails:function($http, $stateParams, headers, scalear_api){
                return $http({method: 'GET', url:scalear_api.host+'/en/courses/'+$stateParams.course_id+'/send_email?student='+$stateParams.student_id})
            }
        },
        url: '/send_email/:student_id',
        templateUrl: 'views/teacher/course/send_email.html',
        controller: 'TeacherCourseSendEmailCtrl'
      })
      .state('course.send_emails', {
        url: '/send_emails',
        templateUrl: 'views/teacher/course/send_emails.html',
        controller: 'TeacherCourseSendEmailsCtrl'
      })
      .state('course.announcements', {
      url:'/announcements',
      templateUrl: 'views/teacher/announcements/announcements.html',
      controller: 'AnnouncementsCtrl'
      })
      .state('course.course_information', {
            resolve:{
                course:function($http, $stateParams, headers, scalear_api){
                    return $http({method: 'GET', url:scalear_api.host+'/en/courses/'+$stateParams.course_id+'/student_show', headers:headers})
                }
            },
        url: '/course_information',
        templateUrl: 'views/student/course/course_information.html',
        controller: 'StudentCourseCourseInformationCtrl'
      })
      .state('course.edit_course_information', {
            resolve:{
                course:function($http, $stateParams, headers, scalear_api){
                    return $http({method: 'GET', url:scalear_api.host+'/en/courses/'+$stateParams.course_id, headers:headers})
                }
            },
            url: '',
            templateUrl: 'views/teacher/course/course_information.html',
            controller: 'TeacherCourseCourseInformationCtrl'
      })
      .state('course.teachers', {
         resolve:{
             teachers:function($http, $stateParams, headers, scalear_api){
                 return $http({method: 'GET', url:scalear_api.host+'/en/courses/'+$stateParams.course_id+'/teachers', headers:headers})
             }
         },
         url: '/teachers',
         templateUrl: 'views/teacher/course/teachers.html',
         controller: 'TeacherCourseTeachersCtrl'
      })
      .state('student_courses', {
        url:'/student_courses',
        templateUrl: 'views/student/course_list/course_list.html',
        controller: 'StudentCourseListCtrl'
      })
  }])




