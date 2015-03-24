'use strict';

angular.module('scalearAngularApp')
.factory('Module', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope','$translate',function ($resource, $http, $stateParams, scalear_api, headers, $rootScope ,$translate){
  
	$http.defaults.useXDomain = true;
	return $resource(scalear_api.host+'/:lang/courses/:course_id/groups/:module_id/:action', {course_id:$stateParams.course_id, lang:$translate.uses()},
	  { 'create': { method: 'POST', headers:headers },
	    'index': { method: 'GET', isArray: true, headers:headers},
	    'update': { method: 'PUT', headers:headers},
	    'destroy': { method: 'DELETE', headers:headers },
	    'show':{method: 'GET', headers:headers},
	    'newModule':{method:'POST', params:{action:'new_module_angular'}, headers:headers},
	    'newCustomLink':{method:'POST', params:{action:'new_link_angular'}, headers:headers},
	    'saveSort':{method:'POST', params:{action:'sort'}, headers:headers},
          'getModuleStatistics':{method:'GET', params:{action:'get_group_statistics'},headers:headers},
	    'validateModule': {method: 'PUT', params: {action: 'validate_group_angular'},headers: headers},
	      'getLectureProgress': {method: 'GET', params: {action: 'get_lecture_progress_angular'}, headers:headers},
            'getQuizzesProgress': {method: 'GET', params: {action: 'get_quizzes_progress_angular'}, headers:headers},
      	'getSurveysProgress': {method: 'GET', params: {action: 'get_surveys_progress_angular'}, headers:headers},
      	'getModuleCharts':{method:'GET', params:{action:'get_module_charts_angular'}, headers:headers},
      	'getLectureCharts':{method:'GET', params:{action: 'get_lecture_charts_angular'}, headers:headers},
      	'getQuizChart':{method:'GET', params:{action: 'get_quiz_chart_angular'}, headers:headers},
      	'getSurveyChart':{method:'GET', params:{action:'get_survey_chart_angular'}, headers:headers},
      	'getStudentStatistics':{method:'GET', params:{action:'get_student_statistics_angular'},headers:headers},
      	'changeModuleStatus':{method:'POST', params:{action:'change_status_angular'},headers:headers},
      	'displayQuizzes':{method:'GET', params:{action:'display_quizzes_angular'},headers:headers},
      	'displayQuestions':{method:'GET',params:{action:'display_questions_angular'},headers:headers},
      	'displaySurveys':{method:'GET',params:{action:'display_surveys_angular'},headers:headers},
      	'hideQuiz':{method:'POST',params:{action:'hide_invideo_quiz'},headers:headers},
      	'hideQuestion':{method:'POST',params:{action:'hide_student_question'},headers:headers},
            'getStudentQuestions':{method:'GET', params:{action:'get_student_questions'},headers:headers},
      	'getInclassActive':{method:'GET', params:{action:'get_inclass_active_angular'},headers:headers},
            'getStudentModule':{method:'GET', params:{action:'get_module_data_angular'},headers:headers},
            'moduleCopy':{method:'POST', params:{action:'module_copy'},headers:headers},
            'displayAll':{method:'GET', params:{action:'display_all'},headers:headers},
            'getModuleProgress':{method:'GET', params:{action:'get_module_progress'},headers:headers},
            'getModuleInclass':{method:'GET', params:{action:'get_module_inclass'},headers:headers},
            'getQuizCharts':{method:'GET', params:{action:'get_quiz_charts'},headers:headers},
      	'getSurveyChartsInclass':{method:'GET', params:{action:'get_survey_charts_inclass'},headers:headers},
      	'getSurveyCharts':{method:'GET', params:{action:'get_survey_charts'},headers:headers},
            'getLastWatched':{method: 'GET', params:{action: 'last_watched'}, headers:headers},
            'sortGroupLinks':{method: 'POST', headers:headers, params: {action: 'sort_group_links'}},

	  });

}])