'use strict';

angular.module('scalearAngularApp')
  .controller('displayQuestionsCtrl', ['$scope','$stateParams','Module','$log', '$window', function ($scope, $stateParams, Module, $log, $window){

 	$window.scrollTo(0, 0);
  	var init = function(){
  		Module.displayQuestions(
	  		{
	  			course_id:$stateParams.course_id,
                module_id:$stateParams.module_id
	  		},
	  		function(data){
	  			$log.debug(data)
	  			$scope.$parent.should_mute = true
	  			$scope.$parent.lecture_list = data.lecture_list
	  			$scope.$parent.display_data = data.display_data
	  			$scope.$parent.total_num_lectures = data.num_lectures
	  			$scope.$parent.total_num_quizzes  = data.num_quizzes
	  			$scope.nextQuiz()
	  			$scope.setQuizShortcuts()
	  			$scope.setBlankShortcut()
	  		},
	  		function(){}
		)
  	}

	$scope.$parent.setData=function(lecture_id,url){
		$scope.$parent.quiz_time= $scope.display_data[lecture_id][$scope.current_quiz_lecture][0][1]
		$scope.$parent.questions = $scope.display_data[lecture_id][$scope.current_quiz_lecture]
		if($scope.$parent.lecture_url.indexOf(url) == -1)
			$scope.$parent.lecture_url= url+'&controls&start='+Math.round($scope.$parent.quiz_time)
	}

	init()
  }]);
