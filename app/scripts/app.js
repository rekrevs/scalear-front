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
  'ui.calendar'
])
  .constant('scalear_api', {host: 'http://0.0.0.0:3000'})
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
      .state('student_calendar', {
        resolve:{
          events:function($http, headers, scalear_api){
            //need to change the course id as well
            return $http({method:'GET', headers:headers, url:scalear_api.host+'/en/courses/13/events'})
          }
        },
        url: '/student/calendar',
        templateUrl: 'views/student/calendar.html',
        controller: 'StudentCalendarCtrl'
      })
  })




