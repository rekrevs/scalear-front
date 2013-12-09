'use strict';

angular.module('scalearAngularApp')  
.factory('OnlineQuiz', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope',function ($resource, $http, $stateParams, scalear_api, headers, $rootScope){

	$http.defaults.useXDomain = true;
	return $resource(scalear_api.host+'/'+$rootScope.current_lang+'/online_quizzes/:online_quizzes_id/:action', {},
    {  'update': { method: 'PUT', headers:headers},
      'destroy': { method: 'DELETE', headers:headers },
	  'getQuizList':{method:'GET', params:{action:'get_quiz_list_angular'}, headers:headers},
	});

}])