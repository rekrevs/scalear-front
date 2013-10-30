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
  'infinite-scroll',
  'xeditable',
  'ui.bootstrap.datepicker'
])
.run(function(editableOptions) {
  editableOptions.theme = 'bs2'; // bootstrap3 theme. Can be also 'bs2', 'default'
})
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
      .state('teacher_quiz',{
      	url: "/courses/:course_id/course_editor",
      	templateUrl: 'views/teacher_quiz/teacher_quiz.html',
      	controller: 'TeacherQuizTeacherQuizCtrl'
      })
      .state('teacher_quiz.fillView', {
        resolve:{ 
          quiz:function($http, $q, $stateParams,  $rootScope, myAppConfig){
          	var deferred= $q.defer();
             $http({method: 'GET', url: myAppConfig.host+'/en/courses/'+$stateParams.course_id+'/quizzes/'+$stateParams.quiz_id, headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}})
             .success(function (quiz) {
             	deferred.resolve(quiz);
             	//$rootScope.quiz = quiz
             });
            return deferred.promise; 
          }
        },
        url: "/quizzes/:quiz_id",
        views:{
          "details" :{templateUrl: 'views/teacher_quiz/details.html', controller: "TeacherQuizDetailsCtrl"},
          "middle"  :{templateUrl: 'views/teacher_quiz/middle.html',  controller: "TeacherQuizMiddleCtrl"}
        }        
      })
  });




