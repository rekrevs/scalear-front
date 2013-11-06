'use strict';

angular.module('scalearAngularApp')
.factory('Module', function ($resource, $http, $stateParams, scalear_api, headers){
  
	$http.defaults.useXDomain = true;
	return $resource(scalear_api.host+'/en/courses/:course_id/groups/:module_id/:action', {course_id:$stateParams.course_id},
	  { 'create': { method: 'POST', headers:headers },
	    'index': { method: 'GET', isArray: true, headers:headers},
	    'update': { method: 'PUT', headers:headers},
	    'destroy': { method: 'DELETE', headers:headers },
	    'show':{method: 'GET', headers:headers},
	    'new_module':{method:'POST', params:{action:'new_module_angular'}, headers:headers},
	    'new_document':{method:'POST', params:{action:'new_document_angular'}, headers:headers},
	    'saveSort':{method:'POST', params:{action:'sort'}, headers:headers}
	  });

})