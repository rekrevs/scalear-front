'use strict';

angular.module('scalearAngularApp')
  .controller('displayQuizzesCtrl', ['$scope','$stateParams','Module', '$translate', '$controller', '$log', '$window', function ($scope,$stateParams, Module, $translate, $controller, $log, $window) {
    
    $window.scrollTo(0, 0);
    
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
	  			$scope.nextQuiz()
	  			$scope.setQuizShortcuts()
	  			$scope.setBlankShortcut()
	  		},
	  		function(){}
		)
  	}
	$scope.$parent.setData=function(lecture_id, url, name){
		$scope.$parent.lecture_name = name
		$scope.$parent.lecture_url= url; //+'&controls=0'
		$scope.$parent.quiz_time= $scope.display_data[lecture_id][$scope.current_quiz_lecture][0]
		$scope.$parent.question_title = $scope.display_data[lecture_id][$scope.current_quiz_lecture][2]
		$scope.$parent.quiz_id  = $scope.display_data[lecture_id][$scope.current_quiz_lecture][3] 
	}

    $scope.$parent.createChart = function(id){
    	$scope.chart_data.vtitle="quizzes.percentage_of_students"
        return createLectureChart($scope.chart_data, id, 100)
    }

    var createLectureChart = function(data, id, student_count) {
        //console.log(student_count)
        var chart_data = data
        var chart = {};
        chart.type = "ColumnChart"
        chart.options = {
            "colors": ['green', 'gray'],
            //"title": getQuizType(id) + getQuizTitle(id),
            "isStacked": "true",
            "fill": 25,
            "height": 180,
            backgroundColor: 'beige',
            "displayExactValues": true,
            "legend": {"position": 'none'},
            "fontSize": 12,
            "chartArea":{width:'82%'},
            "vAxis": {
                // "title": $translate(data.vtitle || "quizzes.number_of_students") + " (" + $translate("groups.out_of") + " " + student_count + ")",
                ticks: [25,50,75,100],
                "maxValue": student_count,
                viewWindowMode:'maximized'
            },


        };
        chart.data = $scope.formatLectureChartData(chart_data[id])
        return chart
    }

	    $scope.formatLectureChartData = function(data) {
		    var formated_data = {}
		    formated_data.cols =
		        [{
		        "label": $translate('courses.students'),
		        "type": "string"
		    }, {
		        "label": $translate('lectures.correct'),
		        "type": "number"
		    }, {
		        "label": $translate('lectures.incorrect'),
		        "type": "number"
		    }, ]
		    formated_data.rows = []
		    for (var ind in data) {
		        var text, correct, incorrect
		        if (data[ind][1] == "gray") {
		            text = data[ind][2] + " " + "(" + $translate('lectures.incorrect') + ")";
		            correct = 0
		            incorrect = data[ind][0]
		        } else {
		            text = data[ind][2] + " " + "(" + $translate('lectures.correct') + ")";
		            correct = data[ind][0]
		            incorrect = 0
		        }
		        var row = {
		            "c": [{
		                "v": text
		            }, {
		                "v": correct
		            }, {
		                "v": incorrect
		            }, ]
		        }
		        formated_data.rows.push(row)
		    }
		    return formated_data
		}


	init()
}]);
