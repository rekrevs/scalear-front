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
  'ui.sortable',
  'ngDragDrop', 
  'pasvaz.bindonce', 
  'infinite-scroll'
])
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
      .state('course.course_editor.lecture', {
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
  })




