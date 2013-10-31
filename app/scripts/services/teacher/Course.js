'use strict';

angular.module('scalearAngularApp')
.factory('Course', function ($resource, $http, $stateParams, scalear_api, headers) {    

  $http.defaults.useXDomain = true;
  return $resource(scalear_api.host+'/en/courses/:course_id/:action', {course_id:$stateParams.course_id},
    { 'create': { method: 'POST', headers:headers},
      'index': { method: 'GET', isArray: true , headers:headers},
      'update': { method: 'PUT' , headers:headers},
      'destroy': { method: 'DELETE' , headers:headers},
      'show':{method: 'GET', headers:headers},
      'get_course': {method: 'GET', params: {action: 'get_course_angular'}, headers:headers},
      'get_course_editor': {method: 'GET', params: {action: 'course_editor_angular'}, headers:headers},
      'get_group_items' : {method: 'GET', params: {action: 'get_group_items'}, headers:headers},
    });

})