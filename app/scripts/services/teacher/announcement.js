'use strict';

angular.module('scalearAngularApp')
.factory('Announcement', ['$resource','$http','$stateParams','scalear_api','headers',function ($resource, $http, $stateParams, scalear_api, headers) {    

  $http.defaults.useXDomain = true;
  return $resource(scalear_api.host+'/en/courses/:course_id/announcements/:announcement_id/:action', {course_id:$stateParams.course_id},
    { 
      'index': { method: 'GET', isArray: true , headers:headers},
      'create': { method: 'POST', headers:headers},
      'update': { method: 'PUT' , headers:headers},
      'destroy': { method: 'DELETE' , headers:headers},
      'show':{method: 'GET', headers:headers},
    });

}])