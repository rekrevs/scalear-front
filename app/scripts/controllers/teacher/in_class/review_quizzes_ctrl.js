'use strict';

angular.module('scalearAngularApp')
  .controller('reviewQuizzesCtrl', ['$scope','$stateParams','Module',function ($scope, $stateParams, Module) {
  	console.log("review quizzes")
  	var getLectureCharts= function(offset, limit){
        $scope.chart_limit = limit
        $scope.chart_offset = offset
        $scope.loading_lectures_chart = true
        Module.getLectureCharts(
            {
                course_id:$stateParams.course_id,
                module_id:$stateParams.module_id
            },
            function(data){
            	console.log(data)
                $scope.lecture_data=data.charts_data 
                // if($scope.lecture_data.question_ids.length){
                //     $scope.sub_question_ids = $scope.lecture_data.question_ids.slice($scope.chart_offset, $scope.chart_limit)
                // }
                $scope.loading_lectures_chart = false
            }
        );
    }

    $scope.updateHide=function(id, value){
    	Module.hideQuiz(
    		{
    			course_id:$stateParams.course_id,
    			module_id:$stateParams.module_id
    		},
    		{
    			quiz:id,
    			hide:value
    		},
    		function(){},
    		function(){}
		)	
    }

    var getQuizTitle= function(id){
		return $scope.lecture_data.questions[id][0];
	};

    $scope.formatLectureChartData = function(data){
        var formated_data ={}
        formated_data.cols=
            [
                {"label": "Students","type": "string"},
                {"label": "Correct","type": "number"},
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

    $scope.createLectureChart = function(id){
        var chart_data = $scope.lecture_data.charts
        var chart = {};
        chart.type = "ColumnChart"
        chart.options = {
            "colors": ['green','gray'],
            "title": getQuizTitle(id),
            "isStacked": "true",
            "fill": 20,
            "height": 200,
            "displayExactValues": true,
            "fontSize" : 12,
            "vAxis": {
                "title": "Number of Students",
            },
        };
        chart.data = $scope.formatLectureChartData(chart_data[id])
        return chart
    }

    getLectureCharts(0,100)

  }]);
