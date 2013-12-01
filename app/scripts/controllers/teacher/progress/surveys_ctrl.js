'use strict';

angular.module('scalearAngularApp')
  .controller('surveysCtrl', ['$scope','$stateParams','$timeout','Module', 'Quiz', function ($scope, $stateParams, $timeout, Module, Quiz) {
  	
    $scope.surveysTab = function(){
        $scope.tabState(5)
  		$scope.disableInfinitScrolling()
        if(!$scope.selected_survey)
  		    $scope.getSurveyCharts()
  	}

  	$scope.getSurveyCharts = function(view, module_id, survey_id){
  		//var id
    	//if($scope.selected_survey)
    		//id=$scope.selected_survey[1]
      //if(survey_id)
      var id = survey_id || $scope.selected_survey[1] || ""
    	$scope.loading_surveys_chart = true
  		Module.getSurveyCharts(
  			{
          course_id: $stateParams.course_id,
  				module_id: $stateParams.module_id || module_id,
          survey_id: id,
          display_only:view
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
          $scope.button_msg = $scope.selected_survey[2]? "Hide" : "Make Visible"
          $scope.loading_surveys_chart = false
  			}, 
  			function(){
  				alert("Failed to load survyes, please check your internet connection")
  			}
		)
  	}

    $scope.getSurveyQuestionTitle = function(index){
    	return $scope.survey_chart_questions[index]	
    }

    $scope.formatSurveyChartData = function(data){
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
          "title": $scope.getSurveyQuestionTitle(ind),
          "isStacked": "true",
          "fill": 20,
          "height": 200,
          "displayExactValues": true,
          "fontSize" : 12,
          "vAxis": {
              "title": "Number of Students",
          },
      };
      chart.data = $scope.formatSurveyChartData(chart_data)
      return chart
    }

 	  $scope.changeSurvey = function(){
    	console.log("survey change")
    	$scope.survey_chart_data={}
    	$scope.survey_chart_questions={}
    	$scope.getSurveyCharts()
    }

    $scope.makeVisibleBtn=function(visible){
    	var survey_id = $scope.selected_survey[1]
    	$scope.selected_survey[2] = !$scope.selected_survey[2]
    	Quiz.makeVisible({quiz_id:survey_id},
    		{visible:$scope.selected_survey[2]},
    		function(data){
    			$scope.button_msg = $scope.selected_survey[2]? "Hide" : "Make Visible"
    		}
    	)
    }


  }]);
