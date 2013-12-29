'use strict';

angular.module('scalearAngularApp')
  .controller('freeTextTableCtrl', ['$scope', '$timeout', 'Quiz', '$log', function ($scope, $timeout, Quiz, $log) {
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

    $scope.saveCheckedHide = function(answer){
    	var survey_id = $scope.survey_id
    	Quiz.hideResponses(
    		{quiz_id: survey_id},
    		{hide: answer}
		)
    }

    $scope.sendFeedback=function(answers,index){
    	var survey_id = $scope.survey_id
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
		Quiz.sendFeedback(
			{quiz_id: survey_id},
			{
				groups:selected,
				response:response
			},
			function(){
				hideFeedback(answers, index)
			},
			function(){}
		)
    }

    $scope.deleteFeedback=function(answers,index){
    	var survey_id = $scope.survey_id
    	var id = answers[index].id
    	$log.debug(answers[index])
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
