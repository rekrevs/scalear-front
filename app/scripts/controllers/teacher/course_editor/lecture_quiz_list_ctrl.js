'use strict';

angular.module('scalearAngularApp')
    .controller('lectureQuizListCtrl',['$scope', 'OnlineQuiz', '$translate','$q','$log','$stateParams','$rootScope', function ($scope, OnlineQuiz, $translate, $q, $log, $stateParams, $rootScope) {

	var init= function(){
		$scope.$parent.$parent.$parent.quiz_list = null
		OnlineQuiz.getQuizList(
			{lecture_id:$stateParams.lecture_id},
			function(data){
				$scope.$parent.$parent.$parent.quiz_list = data.quizList
			},
			function(){}
		);	
	}
    init()

	$scope.showQuiz=function(quiz){
		$rootScope.$broadcast("show_online_quiz", quiz)
	}

	$scope.deleteQuiz=function(quiz){
		$rootScope.$broadcast("delete_online_quiz", quiz)
	}
}]);
