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
  'ui.sortable',
  'ngDragDrop', 
  'pasvaz.bindonce', 
  'infinite-scroll',
  'xeditable',  
])
  .constant('scalear_api', {host:"http://localhost:3000"})
  .constant('headers', {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'})

  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');        
    $httpProvider.defaults.withCredentials = true;

    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: 'views/main.html',
        controller:'MainCtrl'
      })
      .state('course', {
        url: "/course/:course_id",
        template: '<ui-view/>',
        abstract:true
      })
      .state('course.course_editor', {
        url: "/course_editor",
        templateUrl: 'views/teacher/course_editor/course_editor.html',
        controller: 'courseEditorCtrl'
      })
      .state('course.course_editor.module',{
        resolve:{
          module:function($http, $stateParams, $rootScope, scalear_api, headers){
            return $http({method: 'GET', headers:headers, url: scalear_api.host+'/en/courses/'+$stateParams.course_id+'/groups/'+$stateParams.module_id+'/get_group_angular'})
             .success(function (module) {
              console.log(module)
                $rootScope.module = module
             });
          }
        },
        url:'/module/:module_id',
        views:{
          "details" :{templateUrl: 'views/teacher/course_editor/module.details.html', controller: "moduleDetailsCtrl"},
          "middle"  :{templateUrl: 'views/teacher/course_editor/module.middle.html',  controller: "moduleMiddleCtrl"}
        }
      }).state('course.course_editor.lecture', {
        resolve:{ 
          lecture:function($http, $stateParams, $rootScope, scalear_api, headers){
            return $http({method: 'GET', headers:headers, url: scalear_api.host+'/en/courses/'+$stateParams.course_id+'/lectures/'+$stateParams.lecture_id})
             .success(function (lecture) {
                $rootScope.lecture = lecture
             });
          }
        },
        url: "/lecture/:lecture_id",
        views:{
          "details" :{templateUrl: 'views/teacher/course_editor/lecture.details.html', controller: "lectureDetailsCtrl"},
          "middle"  :{templateUrl: 'views/teacher/course_editor/lecture.middle.html',  controller: "lectureMiddleCtrl"}
        }        
      })
      .state('course.course_editor.lecture.quizList', {
        views:{         
          "quizList":{templateUrl: 'views/teacher/course_editor/lecture.middle.quiz_list.html', controller: "lectureQuizListCtrl"}
        }        
      })
      .state('course.course_editor.quiz', {
        resolve:{ 
          quiz:function($http, $q, $stateParams, $rootScope, scalear_api, headers){
            console.log(scalear_api.host+'/en/courses/'+$stateParams.course_id+'/quizzes/'+$stateParams.quiz_id)
            var deferred= $q.defer();
             $http({method: 'GET', url: scalear_api.host+'/en/courses/'+$stateParams.course_id+'/quizzes/'+$stateParams.quiz_id, headers: headers})
             .success(function (quiz) {
              deferred.resolve(quiz);
              //$rootScope.quiz = quiz
             });
            return deferred.promise; 
          }
        },
        url: "/quizzes/:quiz_id",
        views:{
          "details" :{templateUrl: 'views/teacher/course_editor/quiz.details.html', controller: "quizDetailsCtrl"},
          "middle"  :{templateUrl: 'views/teacher/course_editor/quiz.middle.html',  controller: "quizMiddleCtrl"}
        }        
      })
  })




