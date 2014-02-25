'use strict';

angular.module('scalearAngularApp')
  .controller('displayQuizzesCtrl', ['$scope','$stateParams','Module', '$translate', '$controller', '$log', '$window', function ($scope,$stateParams, Module, $translate, $controller, $log, $window) {
    $controller('lectureQuizzesCtrl', {$scope: $scope});
    
    $window.scrollTo(0, 0);
    $scope.$parent.enlarged=false;
    $scope.$parent.enlarge_text="Maximize"

  	var init = function(){
  		Module.displayQuizzes(
	  		{
                course_id:$stateParams.course_id,
                module_id:$stateParams.module_id
            },
	  		function(data){
	  			$log.debug(data)
	  			$scope.$parent.lecture_list = data.lecture_list
	  			$scope.$parent.display_data = data.display_data
	  			$scope.$parent.total_num_lectures = data.num_lectures
	  			$scope.$parent.total_num_quizzes  = data.num_quizzes
	  			$scope.$parent.chart_data = data.chart_data

                $scope.$parent.quiz_free= data.quiz_free
                $scope.$parent.related_answers = data.related

	  			$scope.nextQuiz()


	  		},
	  		function(){}
		)
  	}

    $scope.$parent.enlarge = function()
    {
        if($scope.$parent.enlarged==false)
        {
            $scope.bottom={display: "block",width: "100%",height: "100%","background-color":"white",position: "absolute",top: 0}
            $scope.right={width: "100%",height: "90%"}
            $scope.title={display: "none"}
            $scope.$parent.enlarged=true;
            $scope.$parent.enlarge_text="Minimize"
            $scope.left={height:"100%"}
        }
        else
        {
            $scope.bottom={display: "block",width: "100%",height: "40%","background-color":"white",position: "",top: 0}
            $scope.right={width: "50%",height: "100%"}
            $scope.title={display: ""}
            $scope.$parent.enlarged=false;
            $scope.$parent.enlarge_text="Maximize"
            $scope.left={height:"40%"}
        }

    }

	$scope.$parent.setData=function(lecture_id, url){
		$scope.$parent.quiz_time= $scope.display_data[lecture_id][$scope.current_quiz_lecture][0]
		$scope.$parent.question_title = $scope.display_data[lecture_id][$scope.current_quiz_lecture][2]
		$scope.$parent.quiz_id  = $scope.display_data[lecture_id][$scope.current_quiz_lecture][3]
        $scope.$parent.quiz_type  = $scope.display_data[lecture_id][$scope.current_quiz_lecture][4]
        $scope.$parent.lecture_id = lecture_id
        if($scope.$parent.lecture_url.indexOf(url) == -1)
			$scope.$parent.lecture_url= url+'&controls&start='+Math.round($scope.$parent.quiz_time)

	}

    $scope.$parent.createChart = function(id){
    	$scope.chart_data.vtitle="quizzes.percentage_of_students"
        return $scope.createLectureChart($scope.chart_data, id, 100)
    }

	init()
}]);
