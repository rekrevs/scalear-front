'use strict';

angular.module('scalearAngularApp')
.factory('Lecture', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope','$translate',function ($resource, $http, $stateParams, scalear_api, headers, $rootScope ,$translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/:lang/courses/:course_id/lectures/:lecture_id/:action', {course_id:$stateParams.course_id, lecture_id:'@id', lang:$translate.uses()},
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
		//'addHtmlAnswer':{method:'POST', params:{action:'add_html_answer_angular'}, headers:headers},
		//'removeHtmlAnswer':{method:'POST', params:{action:'remove_html_answer_angular'}, headers:headers},
		'removeAnswer':{method:'POST', params:{action:'remove_answer_angular'}, headers:headers},
		'saveSort':{method:'POST', params:{action:'sort'}, headers:headers},
		"validateLecture": {method: 'PUT', params: {action: 'validate_lecture_angular'},headers: headers},
		"getLectureStudent":{method:'GET', params:{action:'get_lecture_data_angular'}, headers:headers},
        "switchQuiz":{method:'GET', params:{action:'switch_quiz'}, headers:headers},
		"confused":{method:'POST', params:{action:'confused'}, headers:headers},
		"back":{method:'POST', params:{action:'back'}, headers:headers},
		"pause":{method:'POST', params:{action:'pause'}, headers:headers},
		"confusedQuestion":{method:'POST', params:{action:'confused_question'}, headers:headers},
		"saveOnline":{method:'POST', params:{action:'save_online'}, headers:headers},
		"saveHtml":{method:'POST', params:{action:'save_html'}, headers:headers},
        "deleteConfused":{method:'DELETE', params:{action:'delete_confused'}, headers:headers},
        "saveNote":{method:'POST', params:{action:'save_note'}, headers:headers},
        "deleteNote":{method:'DELETE', params:{action:'delete_note'}, headers:headers},
        "loadNote":{method:'GET', params:{action:'load_note'}, headers:headers},
        "lectureCopy":{method:'POST', params:{action:'lecture_copy'}, headers:headers},
        "lastViewed":{method: 'GET', params:{action:'last_viewed'}, headers:headers},
		// "hideResponses":{method:'POST',params:{action:'hide_responses'},headers:headers},
		// "sendFeedback":{method:'POST', params:{action:'create_or_update_survey_responses'},headers:headers},
		// "deleteFeedback":{method:'DELETE',params:{action:'delete_response'},headers:headers}
		"exportNotes":{method: 'GET', params:{action:'export_notes'}, headers:headers},
		"updatePercentView":{method: 'POST', params:{action:'update_percent_view'}, headers:headers},
	});

}]) 