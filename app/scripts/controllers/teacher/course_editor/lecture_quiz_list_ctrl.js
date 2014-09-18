'use strict';

angular.module('scalearAngularApp')
    .controller('lectureQuizListCtrl',['$scope', 'OnlineQuiz', '$translate','$q','$log','$stateParams', function ($scope, OnlineQuiz, $translate, $q, $log, $stateParams) {

	$log.debug("loading quiz list")
	$scope.editing_mode = false

	var init= function(){
		OnlineQuiz.getQuizList(
			{lecture_id:$stateParams.lecture_id},
			function(data){
				$scope.$parent.quiz_list = data.quizList
			},
			function(){}
		);	
	}
    init()
	var updateOnlineQuiz=function(quiz){
		OnlineQuiz.update(
			{online_quizzes_id: quiz.id},
			{online_quiz: {time:Math.round(quiz.time), question:quiz.question}},
			function(data){
				$log.debug(data)
			},
			function(){}
		);
	}
 	$scope.validateTime=function(time) { 		
		var int_regex = /^\d\d:\d\d:\d\d$/;  //checking format
		if(int_regex.test(time)) { 
		    var hhmm = time.split(':'); // split hours and minutes
		    var hours = parseInt(hhmm[0]); // get hours and parse it to an int
		    var minutes = parseInt(hhmm[1]); // get minutes and parse it to an int
		    var seconds = parseInt(hhmm[2]);
		    // check if hours or minutes are incorrect
		    var total_duration=(hours*60*60)+(minutes*60)+(seconds);
		    if(hours < 0 || hours > 24 || minutes < 0 || minutes > 59 || seconds< 0 || seconds > 59) {// display error
	       		return $translate('online_quiz.incorrect_format_time')
		    }
		    else if( ($scope.lecture_player.controls.getDuration()-1) <= total_duration || total_duration <= 0 ){
	       		return $translate('online_quiz.time_outside_range')
		    }
		}
	    else{
	   		return $translate('online_quiz.incorrect_format_time')
	    }
	}
	
	$scope.validateName= function(data, elem){
		var d = $q.defer();
	    var doc={}
	    doc.question=data;
	    $log.debug($scope.$parent.quiz_list);
	    OnlineQuiz.validateName(
	    	{online_quizzes_id: elem.id},
	    	doc,
	    	function(){
				d.resolve()
			},function(data){
				$log.debug(data.status);
				$log.debug(data);
			if(data.status==422)
			 	d.resolve(data.data.errors.join());
			else
				d.reject('Server Error');
			}
	    )
	    return d.promise;
	}

	$scope.saveEdit=function(quiz){
		var a = quiz.formatedTime.split(':'); // split it at the colons			
		var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); // minutes are worth 60 seconds. Hours are worth 60 minutes.
		quiz.time = seconds
		updateOnlineQuiz(quiz)
	}
}]);
