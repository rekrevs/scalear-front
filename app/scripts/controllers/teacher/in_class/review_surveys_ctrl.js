'use strict';

angular.module('scalearAngularApp')
  .controller('reviewSurveysCtrl', ['$scope', '$controller', 'Quiz','$window', function ($scope, $controller, Quiz, $window) {
 	$controller('surveysCtrl', {$scope: $scope});

	$window.scrollTo(0, 0);
	
 	var init=function(){
 		$scope.getSurveyCharts()
 		$scope.current_survey=0
 	}

 	$scope.nextSurvey=function(){
 		if($scope.current_survey < $scope.all_surveys.length -1){
	 		$scope.current_survey+=1
	 		$scope.selected_survey=$scope.all_surveys[$scope.current_survey]
	 		$scope.getSurveyCharts()
 		}
 	}

 	$scope.prevSurvey=function(){
 		if($scope.current_survey > 0){
	 		$scope.current_survey-=1
	 		$scope.selected_survey=$scope.all_surveys[$scope.current_survey]
	 		$scope.getSurveyCharts()
 		}
 	}

 	$scope.showInclass=function(question_id, value){
 		Quiz.showInclass(
 			{quiz_id:$scope.selected_survey[1]},
 			{
 				question:question_id,
 				show:value
 			}
		)
 	}
 	
 	init()

  }]);
