'use strict';

angular.module('scalearAngularApp')
    .controller('lectureQuizListCtrl',['$scope', 'OnlineQuiz', '$translate','$q','$log','$stateParams','$rootScope', function ($scope, OnlineQuiz, $translate, $q, $log, $stateParams, $rootScope) {

	var init= function(){
		OnlineQuiz.getQuizList(
			{lecture_id:$stateParams.lecture_id},
			function(data){
				$scope.$parent.$parent.$parent.quiz_list = data.quizList
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
	
	$scope.validateName= function(question, elem){
		var d = $q.defer();
	    var doc={}
	    doc.question=question;
	    OnlineQuiz.validateName(
	    	{online_quizzes_id: elem.id},
	    	doc,
	    	function(){
				d.resolve()
			},function(data){
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

	$scope.showQuiz=function(quiz){
		$rootScope.$broadcast("show_online_quiz", quiz)
	}

	$scope.deleteQuiz=function(quiz){
		$rootScope.$broadcast("delete_online_quiz", quiz)
	}
}]);
