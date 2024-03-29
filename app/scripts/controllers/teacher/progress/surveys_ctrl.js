'use strict';

angular.module('scalearAngularApp')
  .controller('surveysCtrl', ['$scope','$stateParams','$timeout','Module', 'Quiz', '$translate','$log','ScalearUtils', function ($scope, $stateParams, $timeout, Module, Quiz, $translate, $log,ScalearUtils) {
  	
    $scope.surveysTab = function(){
        $scope.tabState(5)
  		$scope.disableInfinitScrolling()
        if(!$scope.selected_survey)
  		    $scope.getSurveyCharts()
  	}

  	$scope.getSurveyCharts = function(view, module_id, survey_id){
  		var selected_id
    	if($scope.selected_survey)
    		selected_id=$scope.selected_survey? $scope.selected_survey[1] : ""
      var id = survey_id || selected_id
    	$scope.loading_surveys_chart = true
  		Module.getSurveyChart(
  			{
          course_id: $stateParams.course_id,
  				module_id: $stateParams.module_id || module_id,
          survey_id: id,
          display_only:view
  			},
  			function(data){
  				$log.debug(data)
          $scope.current_survey = data.survey
          $scope.ordered_survey= data.ordered_survey
          $scope.survey_chart_data = data.chart_data
          $scope.survey_chart_questions = data.chart_questions
          $scope.survey_free= data.survey_free
          $scope.related_answers = data.related
          $scope.student_count = data.students_count
          if(!$scope.selected_survey){
      		  $scope.all_surveys = data.all_surveys                
          	$scope.selected_survey = $scope.all_surveys? $scope.all_surveys[0] : ""
          }
          $scope.button_msg = $scope.selected_survey[2]? "progress.button.hide" : "progress.button.make_visible"
          $scope.loading_surveys_chart = false
  			}, 
  			function(){
  				//alert("Failed to load survyes, please check your internet connection")
  			}
		)
  	}

    $scope.getSurveyQuestionTitle = function(index){
    	return $scope.survey_chart_questions[index].question
    }

    $scope.getSurveyQuestionType = function(index) {
        return $scope.survey_chart_questions[index].type + ' | '
    }

    $scope.formatSurveyChartData = function(data){
      var formated_data ={}
      formated_data.cols=
          [
              {"label": $translate.instant('global.students'),"type": "string"},
              {"label": $translate.instant('progress.chart.answered'),"type": "number"}
          ]
      formated_data.rows= []
      for(var ind in data)
      {
          var row=
          {"c":
              [
                  {"v": ScalearUtils.getHtmlText(data[ind][1])},
                  {"v": data[ind][0]}
              ]
          }
          formated_data.rows.push(row)
      }
      return formated_data
    }

    $scope.createSurveyChart = function(chart_data, ind, student_count){
      var chart = {};
      chart.type = "ColumnChart"
      chart.options = {
          "colors": ['green','gray'],
          "title": $scope.getSurveyQuestionType(ind) + ScalearUtils.getHtmlText($scope.getSurveyQuestionTitle(ind)),
          "isStacked": "true",
          "fill": 20,
          "height": 200,
          "displayExactValues": true,
          "fontSize" : 12,
          "vAxis": {
              "title": $translate.instant("progress.number_of_students")+ " ("+$translate.instant("progress.out_of")+" "+student_count+")",
              "gridlines": {
                  "count":9
              },
              "maxValue": student_count
          }
      };
      chart.data = $scope.formatSurveyChartData(chart_data)
      return chart
    }

 	  $scope.changeSurvey = function(){
    	$log.debug("survey change")
    	$scope.survey_chart_data={}
    	$scope.survey_chart_questions={}
    	$scope.getSurveyCharts()
    }

    $scope.makeVisibleBtn=function(){
    	var survey_id = $scope.selected_survey[1]
    	$scope.selected_survey[2] = !$scope.selected_survey[2]
    	Quiz.makeVisible(
        {quiz_id:survey_id},
    		{visible:$scope.selected_survey[2]},
    		function(){
    			$scope.button_msg = $scope.selected_survey[2]? "progress.button.hide" : "progress.button.make_visible"
    		}
    	)
    }

    $scope.updateHideSurveyQuestion=function(quiz_id,id, value){
      Quiz.showStudent(
        {
          course_id:$stateParams.course_id,
          quiz_id:quiz_id
        },
        {
          question:id,
          show:value
        }
      )
    }


  }]);
