'use strict';

angular.module('scalearAngularApp')
  .controller('reviewNormalQuizzesCtrl', ['$scope', '$controller', 'Quiz','$log', '$window', function ($scope, $controller, Quiz, $log, $window) {
 	$controller('quizzesCtrl', {$scope: $scope});

	$window.scrollTo(0, 0);
	
 	var init=function(){
 		$scope.getQuizCharts()
 		$scope.current_quiz=0
 	}

 	$scope.nextQuiz=function(){
 		if($scope.current_quiz < $scope.all_quizzes.length -1){
	 		$scope.current_quiz+=1
	 		$scope.selected_quiz=$scope.all_quizzes[$scope.current_quiz]
	 		$scope.getQuizCharts()
 		}
 	}

 	$scope.prevQuiz=function(){
 		if($scope.current_quiz > 0){
	 		$scope.current_quiz-=1
	 		$scope.selected_quiz=$scope.all_quizzes[$scope.current_quiz]
	 		$scope.getQuizCharts()
 		}
 	}

 	$scope.showInclass=function(question_id, value){
 		Quiz.showInclass(
 			{quiz_id:$scope.selected_quiz[1]},
 			{
 				question:question_id,
 				show:value
 			}
		)
 	}
 	
 	init()

  }]);
