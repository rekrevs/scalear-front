'use strict';

angular.module('scalearAngularApp')
  .controller('quizDetailsCtrl',['$stateParams','$rootScope','$scope','Quiz','quiz', function ($stateParams, $rootScope,$scope, Quiz,quiz) {
    $scope.quiz = quiz.data
    $scope.$emit('accordianUpdate',$scope.quiz.group_id); // to parent -> teacher_quiz.js controller
    
   $scope.updateQuiz = function() {
   		
   		var sending=angular.copy($scope.quiz);
   		delete sending["created_at"];
   		delete sending["updated_at"];
   		delete sending["id"];
   		
    	Quiz.update({quiz_id:$scope.quiz.id},{quiz:sending},function(data){
				$scope.$emit('detailsUpdate');
				$scope.quiz= data.quiz;
				$scope.$emit('accordianUpdate',$scope.quiz.group_id);
				return true;
		});	
  	};
    
  }]);
