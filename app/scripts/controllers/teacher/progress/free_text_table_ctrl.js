'use strict';

angular.module('scalearAngularApp')
  .controller('freeTextTableCtrl', ['$scope', '$timeout', 'Quiz', '$log','Lecture','$stateParams', function ($scope, $timeout, Quiz, $log, Lecture, $stateParams) {
    
    $scope.grade_options= [{
         value: 0, // not set
         text: 'Under Review'
     }, {
         value: 1, // wrong
         text: 'Wrong'
     }, {
         value: 2,
         text: 'Partial'
     }, {
         value: 3,
         text: 'Good'
     }]
 
     // $scope.grade_display={0 : "Under Review", 1: "Wrong", 2:"Partial", 3:"Good"}


    $scope.showFeedback = function(answers, index, flag){
    	if(!flag){
        answers.showGroups = true
  		  for(var i in answers){
      		answers[i].show_feedback = false
      		answers[i].group_selected = false
  		  }
      	answers[index].show_feedback = true
  		  answers[index].group_selected = true
      }
    }

    var hideFeedback= function(answers, index){
    	answers.showGroups = false
    	answers[index].show_feedback = false
		answers[index].group_selected = false
    }

    $scope.saveCheckedHideSurvey = function(answer_id, answer_hide){
    	Quiz.hideResponses(
    		{quiz_id: $scope.survey_id},
    		{
                hide:{
                    id:answer_id, 
                    hide: answer_hide
                }                
            }
		)
    }

   $scope.saveCheckedHideQuiz = function(answer_id, answer_hide){
        Lecture.hideResponses(
            {lecture_id: $scope.lecture_id},
            {
                hide:{
                    id:answer_id, 
                    hide: answer_hide
                }                
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

    $scope.updateGrade = function(answer){
        Quiz.updateGrade(
            {course_id:$stateParams.course_id, quiz_id: answer.quiz_id},
            {answer_id: answer.id, grade:answer.grade}
        )
    }


  }]);
