'use strict';

angular.module('scalearAngularApp')
.factory('Lecture', ['$resource','$http','$stateParams','scalear_api','headers',function ($resource, $http, $stateParams, scalear_api, headers) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/en/courses/:course_id/lectures/:lecture_id/:action', {course_id:$stateParams.course_id, lecture_id:'@id'},
	{ 	'create': { method: 'POST' , headers:headers},
		'index': { method: 'GET', isArray: true, headers:headers},
		'update': { method: 'PUT', headers:headers},
		'destroy': { method: 'DELETE', headers:headers },
		'show':{method: 'GET', headers:headers},
		'newLecture':{method:'GET', params:{action:'new_lecture_angular'}, headers:headers},
		'getQuizData': {method: 'GET', params: {action: 'get_old_data_angular'}, headers:headers},
		'getHtmlData':{method:'GET', params:{action:'get_html_data_angular'}, headers:headers},
		'newQuiz':{method: 'GET', params:{action: 'new_quiz_angular'}, headers:headers},
		'updateAnswers':{method:'POST', params:{action:'save_answers_angular'}, headers:headers},
		'addAnswer':{method:'POST',params:{action:'add_answer_angular'}}, headers:headers,
		'addHtmlAnswer':{method:'POST', params:{action:'add_html_answer_angular'}, headers:headers},
		'removeHtmlAnswer':{method:'POST', params:{action:'remove_html_answer_angular'}, headers:headers},
		'removeAnswer':{method:'POST', params:{action:'remove_answer_angular'}, headers:headers},
		'saveSort':{method:'POST', params:{action:'sort'}, headers:headers},
		"validateLecture": {method: 'PUT', params: {action: 'validate_lecture_angular'},headers: headers},
		"getLectureStudent":{method:'GET', params:{action:'get_lecture_data_angular'}, headers:headers},
		"confused":{method:'POST', params:{action:'confused'}, headers:headers},
		"back":{method:'POST', params:{action:'back'}, headers:headers},
		"pause":{method:'POST', params:{action:'pause'}, headers:headers},
		"confusedQuestion":{method:'POST', params:{action:'confused_question'}, headers:headers},
		"saveOnline":{method:'POST', params:{action:'save_online'}, headers:headers},
		"saveHtml":{method:'POST', params:{action:'save_html'}, headers:headers}
	});

}]) 