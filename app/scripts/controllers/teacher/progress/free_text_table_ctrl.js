'use strict';

angular.module('scalearAngularApp')
  .controller('freeTextTableCtrl', ['$scope', '$timeout', 'Quiz', function ($scope, $timeout, Quiz) {
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
    	var survey_id = $scope.survey_id
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
    	var survey_id = $scope.survey_id
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
