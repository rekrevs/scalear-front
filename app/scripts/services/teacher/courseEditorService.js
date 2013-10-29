'use strict';

angular.module('scalearAngularApp')

  .constant('scalear_api', {host:"http://localhost:3000"})
  .constant('headers', {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'})

  .run(function($rootScope) {
	    $rootScope.$on('detailsUpdatedEmit', function(event) {
	        $rootScope.$broadcast('update');
	    });
	})
  
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
  .factory('Lecture', function ($resource, $http, $stateParams, scalear_api, headers) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/en/courses/:course_id/lectures/:lecture_id/:action', {course_id:$stateParams.course_id, lecture_id:'@id'},
      { 'create': { method: 'POST' , headers:headers},
        'index': { method: 'GET', isArray: true, headers:headers},
        'update': { method: 'PUT', headers:headers},
        'destroy': { method: 'DELETE', headers:headers },
        'show':{method: 'GET', headers:headers},
        'get_quiz_data': {method: 'GET', params: {action: 'get_old_data_angular'}, headers:headers},
        'get_html_data':{method:'GET', params:{action:'get_html_data_angular'}, headers:headers},
        'new_quiz':{method: 'GET', params:{action: 'new_quiz_angular'}, headers:headers},
			  'update_answers':{method:'POST', params:{action:'save_answers_angular'}, headers:headers},
			  'add_answer':{method:'POST',params:{action:'add_answer_angular'}}, headers:headers,
			  'add_html_answer':{method:'POST', params:{action:'add_html_answer_angular'}, headers:headers},
			  'remove_html_answer':{method:'POST', params:{action:'remove_html_answer_angular'}, headers:headers},
			  'remove_answer':{method:'POST', params:{action:'remove_answer_angular'}, headers:headers}
			});

  })
.factory('Online_quizzes', function ($resource, $http, $stateParams, scalear_api, headers){

  	$http.defaults.useXDomain = true;
  	return $resource(scalear_api.host+'/en/online_quizzes/:param', {},
      { 'create': { method: 'POST', headers:headers },
        'index': { method: 'GET', isArray: true, headers:headers},
        'update': { method: 'PUT', headers:headers},
        'destroy': { method: 'DELETE', headers:headers },
			  'show':{method: 'GET', headers:headers},
			  'get_quiz_list':{method:'GET', params:{param:'get_quiz_list_angular'}, headers:headers},
			});
  })
.factory('Module', function ($resource, $http, $stateParams, scalear_api, headers){
  
    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/en/courses/:course_id/groups/:module_id/:action', {course_id:$stateParams.course_id},
      { 'create': { method: 'POST', headers:headers },
        'index': { method: 'GET', isArray: true, headers:headers},
        'update': { method: 'PUT', headers:headers},
        'destroy': { method: 'DELETE', headers:headers },
        'show':{method: 'GET', headers:headers},
        'new_module':{method:'GET', params:{action:'new_module_angular'}, headers:headers},
      });
  });