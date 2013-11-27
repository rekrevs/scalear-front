'use strict';

angular.module('scalearAngularApp')
  .controller('displayQuizzesCtrl', ['$scope','Module',function ($scope,Module) {

  	var init = function(){
  		Module.displayQuizzes(
	  		{module_id: 34},
	  		function(data){
	  			console.log(data)
	  			$scope.$parent.lecture_list = data.lecture_list
	  			$scope.$parent.display_data = data.display_data
	  			$scope.$parent.total_num_lectures = data.num_lectures
	  			$scope.$parent.total_num_quizzes  = data.num_quizzes
	  			$scope.$parent.chart_data = data.chart_data
	  			$scope.nextQuiz()
	  		},
	  		function(){}
		)
		
  	}

	$scope.$parent.setData=function(url){
		$scope.$parent.lecture_url= url
		$scope.$parent.quiz_time= $scope.display_data[url][$scope.current_quiz_lecture][0]
		$scope.$parent.question_title = $scope.display_data[url][$scope.current_quiz_lecture][2]
		$scope.$parent.quiz_id  = $scope.display_data[url][$scope.current_quiz_lecture][3] 
	}

	var formatChartData = function(data){
        var formated_data ={}
        formated_data.cols=
            [
                {"label": "Students","type": "string"},
                {"label": "Correct", "type": "number"},
                {"label": "Incorrect","type": "number"},
            ]
        formated_data.rows= []
        for(var ind in data)
        {
            var text, correct, incorrect
            if(data[ind][1]=="gray"){
                text=data[ind][2]+" "+"(Incorrect)";
                correct=0
                incorrect = data[ind][0]
            }
            else{
                text=data[ind][2]+" "+"(Correct)";
                correct=data[ind][0]
                incorrect=0
            }
            var row=
            {"c":
                [
                    {"v":text},
                    {"v":correct},
                    {"v":incorrect},
                ]
            }
            formated_data.rows.push(row)
        }
        return formated_data
    }

    $scope.$parent.createChart = function(id){
        var chart_data = $scope.chart_data[id]
        var chart = {};
        chart.type = "ColumnChart"
        chart.options = {
            "colors": ['green','gray'],
            "isStacked": "true",
            "fill": 20,
            "height": 200,
            "displayExactValues": true,
            "fontSize" : 12,
            "vAxis": {
                "title": "Number of Students",
            },
        };
        chart.data = formatChartData(chart_data)
        return chart
    }

	init()
}]);
