'use strict';

angular.module('scalearAngularApp')  
.factory('OnlineQuiz', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope','$translate',function ($resource, $http, $stateParams, scalear_api, headers, $rootScope ,$translate){

	$http.defaults.useXDomain = true;
	return $resource(scalear_api.host+'/:lang/online_quizzes/:online_quizzes_id/:action', {lang:$translate.uses()},
    { 'update': { method: 'PUT', headers:headers},
      'destroy': { method: 'DELETE', headers:headers },
	  'getQuizList':{method:'GET', params:{action:'get_quiz_list_angular'}, headers:headers},
	  'validateName':{method:'PUT', params:{action:'validate_name'}, headers:headers},
	  'voteForReview':{method:'POST', params:{action:'vote_for_review'}, headers:headers},
	  'unvoteForReview':{method:'POST', params:{action:'unvote_for_review'}, headers:headers},
	  'hideResponses':{method:'POST', params:{action:'hide_responses'}, headers:headers},
	  'updateInclassSession':{method:'POST', ignoreLoadingBar: true, params:{action:'update_inclass_session'}, headers:headers},
	  'getChartData':{method:'GET', ignoreLoadingBar: true, params:{action:'get_chart_data'}, headers:headers}
	});

}])