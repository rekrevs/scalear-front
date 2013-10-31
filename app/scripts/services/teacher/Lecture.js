'use strict';

angular.module('scalearAngularApp')
.factory('Lecture', function ($resource, $http, $stateParams, scalear_api, headers) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/en/courses/:course_id/lectures/:lecture_id/:action', {course_id:$stateParams.course_id, lecture_id:'@id'},
	{ 	'create': { method: 'POST' , headers:headers},
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