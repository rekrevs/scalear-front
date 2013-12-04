'use strict';

angular.module('scalearAngularApp')
  .controller('displayQuestionsCtrl', ['$scope','$stateParams','Module',function ($scope, $stateParams, Module){
 	
  	var init = function(){
  		Module.displayQuestions(
	  		{
	  			course_id:$stateParams.course_id,
                module_id:$stateParams.module_id
	  		},
	  		function(data){
	  			console.log(data)
	  			$scope.$parent.lecture_list = data.lecture_list
	  			$scope.$parent.display_data = data.display_data
	  			$scope.$parent.total_num_lectures = data.num_lectures
	  			$scope.$parent.total_num_quizzes  = data.num_quizzes
	  			$scope.nextQuiz()
	  		},
	  		function(){}
		)
  	}

	$scope.$parent.setData=function(url){
		$scope.$parent.lecture_url= url+'&controls=0'
		$scope.$parent.quiz_time= $scope.display_data[url][$scope.current_quiz_lecture][0][1]
		$scope.$parent.questions = $scope.display_data[url][$scope.current_quiz_lecture]
	}

	init()
  }]);
