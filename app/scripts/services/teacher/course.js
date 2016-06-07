'use strict';

angular.module('scalearAngularApp')
.factory('Course', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope','$translate',function ($resource, $http, $stateParams, scalear_api, headers, $rootScope ,$translate) {

  $http.defaults.useXDomain = true;
  return $resource(scalear_api.host+'/:lang/courses/:course_id/:action', {course_id:$stateParams.course_id, lang:$translate.uses()},
    { 'create': { method: 'POST', headers:headers, params:{course_id:null}},
      'index': { method: 'GET', isArray: true , headers:headers, params:{course_id:null}},
      'update': { method: 'PUT' , headers:headers},
      'validateCourse':{method: 'PUT', params: {action: 'validate_course_angular'}, headers:headers},
      'send_email_through':{method: 'POST', params: {action: 'send_email_through'}, headers:headers},
      'send_batch_email_through':{method: 'POST', params: {action: 'send_batch_email_through'}, headers:headers},
      'removeStudent' : { method: 'POST', params: {action: 'remove_student'}, headers:headers},
      'unenroll' : { method: 'POST', params: {action: 'unenroll'}, headers:headers},
      'destroy': { method: 'DELETE' , headers:headers},
      'show':{method: 'GET', headers:headers},
      'saveTeacher':{ method: 'POST', params: {action: 'save_teachers'}, headers:headers},
      'updateTeacher':{ method: 'POST', params: {action: 'update_teacher'}, headers:headers},
      'updateStudentDueDateEmail':{ method: 'POST', params: {action: 'update_student_duedate_email'}, headers:headers},
      'getStudentDueDateEmail':{ method: 'GET', params: {action: 'get_student_duedate_email'}, headers:headers},
      'deleteTeacher':{ method: 'DELETE', params: {action: 'delete_teacher'}, headers:headers},
      'getCalendarEvents':{ method: 'GET', params: {action: 'events'}, headers:headers},
      'getAnnouncements':{ method: 'GET', isArray: true , params: {action: 'announcements'}, headers:headers},
      'newCourse':{method:'GET', headers:headers, params:{action: 'new', course_id:null}},
      'getCourse': {method: 'GET', params: {action: 'get_course_angular'}, headers:headers},
      'getCourseEditor': {method: 'GET', params: {action: 'course_editor_angular'}, headers:headers},
      'getGroupItems' : {method: 'GET', params: {action: 'get_group_items'}, headers:headers},
      'getTeachers' : {method: 'GET', params: {action: 'teachers'}, headers:headers},
      'enroll' : {method: 'POST', params: {action: 'enroll_to_course', course_id:null}, headers:headers},
      'getModuleProgress': {method: 'GET', ignoreLoadingBar: true, params: {action: 'module_progress_angular'}, headers:headers},
      'getTotalChart':{method:'GET', params:{action:'get_total_chart_angular'},headers:headers},
      'getCourseware':{method:'GET', params:{action:'courseware_angular'},headers:headers},
      'getEnrolledStudents':{method:'GET', params:{action:'enrolled_students'},headers:headers, isArray: true},
      'exportCsv':{method:'GET', params:{action:'export_csv'},headers:headers},
      'exportStudentCsv':{method:'GET', params:{action:'export_student_csv'},headers:headers},
      'courseCopy': {method: 'GET', params: {action: 'course_copy_angular', course_id:null}, headers:headers},
      'getAllTeachers':{method:'GET', headers:headers,params:{action: 'get_all_teachers'}},
      'newCustomLink':{method:'POST', params:{action:'new_link_angular'}, headers:headers},
      'currentCourses':{method: 'GET', isArray: true, headers:headers, params: {action: 'current_courses'}},
      'exportModuleProgress':{method: 'GET', headers:headers, params: {action: 'export_modules_progress'}},
      'systemWideEmail':{method: 'POST', params: {action: 'send_system_announcement'}, headers:headers},
    });

}])
