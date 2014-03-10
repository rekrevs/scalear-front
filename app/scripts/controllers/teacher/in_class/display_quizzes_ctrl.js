'use strict';

angular.module('scalearAngularApp')
  .controller('displayQuizzesCtrl', ['$scope','$stateParams','Module', '$translate', '$controller', '$log', '$window', function ($scope,$stateParams, Module, $translate, $controller, $log, $window) {
    $controller('lectureQuizzesCtrl', {$scope: $scope});
    
    $window.scrollTo(0, 0);
    
  	var init = function(){
  		Module.displayQuizzes(
	  		{
                course_id:$stateParams.course_id,
                module_id:$stateParams.module_id
            },
	  		function(data){
	  			$log.debug(data)
	  			$scope.$parent.should_mute = false
	  			$scope.$parent.lecture_list = data.lecture_list
	  			$scope.$parent.display_data = data.display_data
	  			$scope.$parent.total_num_lectures = data.num_lectures
	  			$scope.$parent.total_num_quizzes  = data.num_quizzes
	  			$scope.$parent.chart_data = data.chart_data
	  			$scope.nextQuiz()
	  			$scope.setShortcuts()
	  		},
	  		function(){}
		)
  	}

	$scope.$parent.setData=function(lecture_id, url){
		$scope.$parent.quiz_time= $scope.display_data[lecture_id][$scope.current_quiz_lecture][0]
		$scope.$parent.question_title = $scope.display_data[lecture_id][$scope.current_quiz_lecture][2]
		$scope.$parent.quiz_id  = $scope.display_data[lecture_id][$scope.current_quiz_lecture][3] 
		if($scope.$parent.lecture_url.indexOf(url) == -1)
			$scope.$parent.lecture_url= url+'&controls&start='+Math.round($scope.$parent.quiz_time)

	}

    $scope.$parent.createChart = function(id){
    	$scope.chart_data.vtitle="quizzes.percentage_of_students"
        return $scope.createLectureChart($scope.chart_data, id, 100)
    }

	init()
}]);
