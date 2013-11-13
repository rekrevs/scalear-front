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
  'ui.sortable',
  'ui.calendar',
  'ngDragDrop',
  'pasvaz.bindonce',
  'infinite-scroll',
  'xeditable',
]).constant('scalear_api', {host:'http://localhost:3000'}) //http://localhost:3000
  .constant('headers', {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'})
  .value('$anchorScroll', angular.noop)
  .run(function(editableOptions) {
      editableOptions.theme = 'bs2';
  })  

  .config(['$stateProvider','$urlRouterProvider','$httpProvider',function ($stateProvider, $urlRouterProvider, $httpProvider) {
	
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');        

    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('ServerInterceptor');
    
    $urlRouterProvider.otherwise('/');    
    $stateProvider
      .state('index', {
        url: '/',
      })
      .state('admin', {
        url:'/admin',
        templateUrl: 'views/admin/admin.html',
        controller: 'adminCtrl'
      })
      .state('course', {
        url: '/courses/:course_id',
        views:{
          'navigation':{templateUrl: 'views/teacher_navigation.html', controller: 'teacherNavigationCtrl'},
          '':{template:'<ui-view/>'}
        },
        abstract:true
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
      .state('course.progress.module', {
        url: "/module/:module_id",
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
      .state('student_calendar', {
        resolve:{
          events:function($http, $stateParams, headers,scalear_api){
            return $http({method:'GET', url:scalear_api.host+'/en/courses/'+$stateParams.course_id+'/events', headers:headers})
          }
        },
        url: '/student/events',
        templateUrl: 'views/student/calendar/calendar.html',
        controller: 'StudentCalendarCtrl'
      })
  }])




