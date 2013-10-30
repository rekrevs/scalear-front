'use strict';

angular.module('scalearAngularApp')
.constant('myAppConfig', {host: 'http://localhost:3000'}) //'http://angular-learning.herokuapp.com' // constant for constant, value for editable value
	.run(function($rootScope) {
	    $rootScope.$on('detailsUpdatedEmit', function(event) {
	        $rootScope.$broadcast('update');
	    });
	}).factory('Course', function($resource, $http, $stateParams, myAppConfig) {

    $http.defaults.useXDomain = true;
    return $resource(myAppConfig.host+'/en/courses/:course_id/:action', {course_id:$stateParams.course_id},
                    { 'create': { method: 'POST' ,headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
                      'index': { method: 'GET', isArray: true, headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'} },
                      'update': { method: 'PUT' , headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'} },
                      'destroy': { method: 'DELETE' , headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'} },
 					   'show':{method: 'GET', headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'} },
 					   'get_course_editor': {method: 'GET',headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'},  params: {action: 'course_editor_angular'}},
 					   'get_group_items' : {method: 'GET',headers:{withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}, params: {action: 'get_group_items'}}
 					});

  }).factory('Lecture', function($resource, $http, $stateParams, myAppConfig) {

    $http.defaults.useXDomain = true;
    return $resource(myAppConfig.host+'/en/courses/:course_id/lectures/:lecture_id/:action', {course_id:$stateParams.course_id, lecture_id:'@id'},
                    { 'create': { method: 'POST', headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'} },
                      'index': { method: 'GET', isArray: true, headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
                      'update': { method: 'PUT', headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
                      'destroy': { method: 'DELETE', headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'} },
 					  'show':{method: 'GET', headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
 					  'get_quiz_data': {method: 'GET', params: {action: 'get_old_data_angular'},headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
 					  'get_html_data':{method:'GET', params:{action:'get_html_data_angular'},headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
 					  'new_quiz':{method: 'GET', params:{action: 'new_quiz_angular'},headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
 					  'update_answers':{method:'POST', params:{action:'save_answers_angular'},headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
 					  'add_answer':{method:'POST',params:{action:'add_answer_angular'},headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
 					  'add_html_answer':{method:'POST', params:{action:'add_html_answer_angular'}, headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
 					  'remove_html_answer':{method:'POST', params:{action:'remove_html_answer_angular'}, headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
 					  'remove_answer':{method:'POST', params:{action:'remove_answer_angular'}, headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}}
 					});

  }).factory('Online_quizzes', function($resource, $http, $stateParams, myAppConfig){
  	$http.defaults.useXDomain = true;
  	return $resource(myAppConfig.host+'/en/online_quizzes/:param', {},
                    { 'create': { method: 'POST' ,headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
                      'index': { method: 'GET', isArray: true, headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
                      'update': { method: 'PUT', headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
                      'destroy': { method: 'DELETE' , headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
 					  'show':{method: 'GET', headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
 					  'get_quiz_list':{method:'GET', params:{param:'get_quiz_list_angular'},headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
 					});
  })
  .factory('Quiz', function($resource, $http, $stateParams, myAppConfig) {

    $http.defaults.useXDomain = true;
    return $resource(myAppConfig.host+'/en/courses/:course_id/quizzes/:quiz_id/:action', {course_id:$stateParams.course_id, lecture_id:'@id'},
                    { 'create': { method: 'POST', headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'} },
                      'index': { method: 'GET', isArray: true, headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
                      'update': { method: 'PUT', headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
                      'destroy': { method: 'DELETE', headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'} },
 					  'show':{method: 'GET', headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
 					  'get_quiz_data': {method: 'GET', params: {action: 'get_old_data_angular'},headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
 					  'get_html_data':{method:'GET', params:{action:'get_html_data_angular'},headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
 					  'new_quiz':{method: 'GET', params:{action: 'new_quiz_angular'},headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
 					  'update_answers':{method:'POST', params:{action:'save_answers_angular'},headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
 					  'add_answer':{method:'POST',params:{action:'add_answer_angular'},headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
 					  'add_html_answer':{method:'POST', params:{action:'add_html_answer_angular'}, headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
 					  'remove_html_answer':{method:'POST', params:{action:'remove_html_answer_angular'}, headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}},
 					  'remove_answer':{method:'POST', params:{action:'remove_answer_angular'}, headers: {withCredentials: true, 'X-Requested-With': 'XMLHttpRequest'}}
 					});

  });