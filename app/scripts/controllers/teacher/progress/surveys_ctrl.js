'use strict';

angular.module('scalearAngularApp')
  .controller('surveysCtrl', ['$scope','$stateParams','$timeout','Module', 'Quiz', function ($scope, $stateParams, $timeout, Module, Quiz) {
  	
  	$scope.surveysTab = function(){
        $scope.tabState(5)
  		$scope.disableInfinitScrolling()
        if(!$scope.selected_survey)
  		    getSurveyCharts()
  		$scope.survey_visible = false
  		$scope.button_msg = "Make Visible"
  	}

  	var getSurveyCharts = function(){
  		var survey_id
    	if($scope.selected_survey)
    		survey_id=$scope.selected_survey[1]
    	$scope.loading_surveys_chart = true
  		Module.getSurveyCharts(
  			{
                course_id: $stateParams.course_id,
  				module_id: $stateParams.module_id,
                survey_id: survey_id
  			},
  			function(data){
  				console.log(data)
                $scope.survey_chart_data = data.chart_data
                $scope.survey_chart_questions = data.chart_questions
                $scope.survey_free= data.survey_free
                $scope.related_answers = data.related
                if(!$scope.selected_survey){
            		$scope.all_surveys = data.all_surveys                
                	$scope.selected_survey = $scope.all_surveys? $scope.all_surveys[0] : ""
                }
                $scope.loading_surveys_chart = false
  			}, 
  			function(){
  				alert("Failed to load survyes, please check your internet connection")
  			}
		)
  	}

	var getSurveyQuestionTitle = function(index){
    	return $scope.survey_chart_questions[index]	
    }

    var formatSurveyChartData = function(data){
        var formated_data ={}
        formated_data.cols=
            [
                {"label": "Students","type": "string"},
                {"label": "Answered","type": "number"},
            ]
        formated_data.rows= []
        for(var ind in data)
        {
            var row=
            {"c":
                [
                    {"v": data[ind][1]},
                    {"v": data[ind][0]},
                ]
            }
            formated_data.rows.push(row)
        }
        return formated_data
    }

    $scope.createSurveyChart = function(chart_data, ind){
        var chart = {};
        chart.type = "ColumnChart"
        chart.options = {
            "colors": ['green','gray'],
            "title": getSurveyQuestionTitle(ind),
            "isStacked": "true",
            "fill": 20,
            "height": 200,
            "displayExactValues": true,
            "fontSize" : 12,
            "vAxis": {
                "title": "Number of Students",
            },
        };
        chart.data = formatSurveyChartData(chart_data)
        return chart
    }

 	$scope.changeSurvey = function(){
    	console.log("survey change")
    	$scope.survey_chart_data={}
    	$scope.survey_chart_questions={}
    	getSurveyCharts()
    }

    $scope.makeVisibleBtn=function(visible){
    	var survey_id = $scope.selected_survey[1]
    	$scope.survey_visible = !$scope.survey_visible 
    	Quiz.makeVisible({quiz_id:survey_id},
    		{
    			visible:$scope.survey_visible
    		},
    		function(){
    			$scope.button_msg = $scope.survey_visible? "Hide" : "Make Visible"
    		}
    	)
    }

    $scope.showFeedback = function(answers, index){
    	answers.showGroups = true
		for(var i in answers){
    		answers[i].show_feedback = false
    		answers[i].group_selected = false
		}
    	answers[index].show_feedback = true
		answers[index].group_selected = true

    }

    var hideFeedback= function(answers, index){
    	answers.showGroups = false
    	answers[index].show_feedback = false
		answers[index].group_selected = false

    }

    $scope.saveCheckedHide = function(answers){
    	var survey_id = $scope.selected_survey[1]
    	var hide = []
    	var ind = 0
    	answers.forEach(function(answer){
    		if(answer.hide){
    			hide[ind] = answer.id
    			ind++
    		}
    	})
    	console.log(hide)
    	Quiz.hideResponses(
    		{quiz_id: survey_id},
    		{hide: hide},
    		function(){
    			$scope.notify = "Saved"
    			$timeout(function(){
    				$scope.notify = ""
    			},2000)
    		}
		)
    }

    $scope.sendFeedback=function(answers,index){
    	var survey_id = $scope.selected_survey[1]
    	var selected = []
    	var ind = 0
    	var response = answers[index].response
    	answers.forEach(function(answer){
    		if(answer.group_selected){
    			selected[ind] = answer.id
    			answer.response = response
    			ind++
    		}
    	})
    	$scope.notify = "Sending Emails"
		Quiz.sendFeedback(
			{quiz_id: survey_id},
			{
				groups:selected,
				response:response
			},
			function(){
				$scope.notify = ""
				hideFeedback(answers, index)
			},
			function(){}
		)
    }

    $scope.deleteFeedback=function(answers,index){
    	var survey_id = $scope.selected_survey[1]
    	var id = answers[index].id
    	console.log(answers[index])
    	Quiz.deleteFeedback(
    		{quiz_id: survey_id},
    		{answer:id},
    		function(){
    			answers[index].response=""
    			hideFeedback(answers, index)
    		},
    		function(){}
		)
    }


  }]);
