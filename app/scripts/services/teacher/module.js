'use strict';

angular.module('scalearAngularApp')
.factory('Module', ['$resource','$http','$stateParams','scalear_api','headers',function ($resource, $http, $stateParams, scalear_api, headers){
  
	$http.defaults.useXDomain = true;
	return $resource(scalear_api.host+'/en/courses/:course_id/groups/:module_id/:action', {course_id:$stateParams.course_id},
	  { 'create': { method: 'POST', headers:headers },
	    'index': { method: 'GET', isArray: true, headers:headers},
	    'update': { method: 'PUT', headers:headers},
	    'destroy': { method: 'DELETE', headers:headers },
	    'show':{method: 'GET', headers:headers},
	    'newModule':{method:'POST', params:{action:'new_module_angular'}, headers:headers},
	    'newDocument':{method:'POST', params:{action:'new_document_angular'}, headers:headers},
	    'saveSort':{method:'POST', params:{action:'sort'}, headers:headers},
	    'validateModule': {method: 'PUT', params: {action: 'validate_group_angular'},headers: headers},
     	'getLectureProgress': {method: 'GET', params: {action: 'get_progress_angular'}, headers:headers},
      	'getQuizzesProgress': {method: 'GET', params: {action: 'get_progress_angular'}, headers:headers},
      	'getModuleProgress':{method:'GET', params:{action: 'module_progress_angular'}, headers:headers},
	  });

}])