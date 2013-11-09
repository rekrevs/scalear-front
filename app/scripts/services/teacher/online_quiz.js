'use strict';

angular.module('scalearAngularApp')  
.factory('Online_quizzes', function ($resource, $http, $stateParams, scalear_api, headers){

	$http.defaults.useXDomain = true;
	return $resource(scalear_api.host+'/en/online_quizzes/:online_quizzes_id/:action', {},
    { 'create': { method: 'POST', headers:headers },
      'index': { method: 'GET', isArray: true, headers:headers},
      'update': { method: 'PUT', headers:headers},
      'destroy': { method: 'DELETE', headers:headers },
	  'show':{method: 'GET', headers:headers},
	  'getQuizList':{method:'GET', params:{action:'get_quiz_list_angular'}, headers:headers},
	});

})