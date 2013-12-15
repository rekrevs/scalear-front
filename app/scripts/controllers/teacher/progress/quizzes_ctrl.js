'use strict';

angular.module('scalearAngularApp')
  .controller('quizzesCtrl', ['$scope','$stateParams','$timeout','Module', function ($scope, $stateParams, $timeout, Module) {
   
   $scope.quizzesTab = function(){
        $scope.tabState(6)
   		$scope.disableInfinitScrolling()
        if(!$scope.selected_quiz)
            getQuizCharts()            
    }    

    var getQuizCharts = function(){
    	var quiz_id
    	if($scope.selected_quiz)
    		quiz_id=$scope.selected_quiz[1]
    	$scope.loading_quizzes_chart = true
        Module.getQuizCharts(
            {
                course_id: $stateParams.course_id,
                module_id: $stateParams.module_id,
                quiz_id:quiz_id
            },
            function(data){
                console.log(data)
                $scope.quiz_chart_data = data.chart_data
                $scope.quiz_chart_questions = data.chart_questions
                if(!$scope.selected_quiz){
                	$scope.all_quizzes = data.all_quizzes
                	$scope.selected_quiz = $scope.all_quizzes? $scope.all_quizzes[0] : ""
                }
                $scope.loading_quizzes_chart = false
            },
            function(){
            	//alert("Failed to load quizzes, please check your internet connection")
            }
        )
    }
    var getQuizQuestionTitle = function(index){
    	return $scope.quiz_chart_questions[index]	
    }

    $scope.formatQuizChartData = function(data){
        var formated_data ={}
        formated_data.cols=
            [
                {"label": "Students","type": "string"},
                {"label": "Correct","type": "number"},
                {"label": "Incorrect","type": "number"},
            ]
        formated_data.rows= []
        var text, correct, incorrect
        for(var ind in data)
        {
            if(!data[ind][1]){
                text=data[ind][2]+" "+"(Incorrect)";
                correct=0
                incorrect=data[ind][0]
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

    $scope.createQuizChart = function(chart_data, ind){
        var chart = {};
        chart.type = "ColumnChart"
        chart.options = {
            "colors": ['green','gray'],
            "title": getQuizQuestionTitle(ind),
            "isStacked": "true",
            "fill": 20,
            "height": 200,
            "displayExactValues": true,
            "fontSize" : 12,
            "vAxis": {
                "title": "Number of Students",
            },
        };
        chart.data = $scope.formatQuizChartData(chart_data)
        return chart
    }

    $scope.changeQuiz = function(){
    	console.log("quiz change")
        console.log($scope.selected_quiz)
    	$scope.quiz_chart_data={}
    	$scope.quiz_chart_questions={}
    	getQuizCharts()
    }



  }]);
