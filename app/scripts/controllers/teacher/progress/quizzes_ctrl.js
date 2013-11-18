'use strict';

angular.module('scalearAngularApp')
  .controller('quizzesCtrl', ['$scope','$stateParams','$timeout','Module', function ($scope, $stateParams, $timeout, Module) {
   
   $scope.quizzesTab = function(){
   		$scope.disableInfinitScrolling()
        getQuizCharts()            
    }    

    var getQuizCharts = function(){
    	var quiz_id
    	if($scope.selected_quiz)
    		quiz_id=$scope.selected_quiz[1]
    	$scope.loading_quizzes_chart = true
        Module.getQuizCharts(
            {
                quiz_id:quiz_id,
                module_id: $stateParams.module_id
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
            	alert("Failed to load quizzes, please check your internet connection")
            }
        )
    }
    $scope.getQuizQuestionTitle = function(index){
    	return $scope.quiz_chart_questions[index]	
    }

    $scope.getQuizChartData = function(id){
        var studentProgress = $scope.quiz_chart_data[id];
        
        var data = new google.visualization.DataTable();
	    data.addColumn('string', 'Choices');
	    data.addColumn('number', 'Correct');
	    data.addColumn('number', 'Incorrect');
    
	    var size=0
	    for(var e in studentProgress){
            size++;
	    }

        data.addRows(size);
        var i=0;
        for (var key in studentProgress) {
            if(!studentProgress[key][1]){
				var c="(Incorrect)";
				var color=1
			}
			else{
				var c="(Correct)";
				var color=2
			}
                
            data.setValue(i, 0, studentProgress[key][2]+" "+c); //x axis  // first value
            data.setValue(i, color, studentProgress[key][0]); // yaxis //correct
        	i+=1;
        }
        return data;
    };

    $scope.changeQuiz = function(){
    	console.log("quiz change")
        console.log($scope.selected_quiz)
    	$scope.quiz_chart_data={}
    	$scope.quiz_chart_questions={}
    	getQuizCharts()
    }

  }]);
