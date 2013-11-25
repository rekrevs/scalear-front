'use strict';

angular.module('scalearAngularApp')
.factory('Course', ['$resource','$http','$stateParams','scalear_api','headers',function ($resource, $http, $stateParams, scalear_api, headers) {    

  $http.defaults.useXDomain = true;
  return $resource(scalear_api.host+'/en/courses/:course_id/:action', {course_id:$stateParams.course_id},
    { 'create': { method: 'POST', headers:headers, params:{course_id:null}},
      'index': { method: 'GET', isArray: true , headers:headers, params:{course_id:null}},
      'update': { method: 'PUT' , headers:headers},
      'send_email_through':{method: 'POST', params: {action: 'send_email_through'}, headers:headers},
      'send_batch_email_through':{method: 'POST', params: {action: 'send_batch_email_through'}, headers:headers},
      'remove_student' : { method: 'POST', params: {action: 'remove_student'}, headers:headers},
      'destroy': { method: 'DELETE' , headers:headers},
      'show':{method: 'GET', headers:headers},
      'saveTeachers':{ method: 'POST', params: {action: 'save_teachers'}, headers:headers},
      'updateTeacher':{ method: 'POST', params: {action: 'update_teacher'}, headers:headers},
      'deleteTeacher':{ method: 'DELETE', params: {action: 'delete_teacher'}, headers:headers},
      'newCourse':{method:'GET', headers:headers, params:{action: 'new', course_id:null}},
      'getCourse': {method: 'GET', params: {action: 'get_course_angular'}, headers:headers},
      'getCourseEditor': {method: 'GET', params: {action: 'course_editor_angular'}, headers:headers},
      'getGroupItems' : {method: 'GET', params: {action: 'get_group_items'}, headers:headers},
      'getTeachers' : {method: 'GET', params: {action: 'teachers'}, headers:headers},
      'enroll' : {method: 'POST', params: {action: 'enroll_to_course', course_id:null}, headers:headers},
      'getModuleProgress': {method: 'GET', params: {action: 'module_progress_angular'}, headers:headers},
      'getTotalChart':{method:'GET', params:{action:'get_total_chart_angular'},headers:headers},
      'getCourseware':{method:'GET', params:{action:'courseware_angular'},headers:headers}
    });

}])