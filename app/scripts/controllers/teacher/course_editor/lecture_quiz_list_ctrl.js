'use strict';

angular.module('scalearAngularApp')
    .controller('lectureQuizListCtrl',['$scope', '$http', '$stateParams', '$state', '$filter', 'Online_quizzes' ,function ($scope, $http, $stateParams, $state, $filter, Online_quizzes) {

	console.log("loading quiz list")
	$scope.editing_mode = false

	Online_quizzes.getQuizList(
		{lecture_id:$scope.lecture.id},
		function(data){
			$scope.$parent.quiz_list = data.quizList
		},
		function(){
			alert("Failed to Load Quiz List")
		}
	);	

	var updateOnlineQuiz=function(quiz){
		Online_quizzes.update(
			{online_quizzes_id: quiz.id},
			{online_quiz: {time:Math.round(quiz.time), question:quiz.question}},
			function(data){ //success
				console.log(data)
			},
			function(){ //error
				alert("Could not update quiz, please check your internet connection")
			}
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
	       		return "Incorrect Time Format"
		    }
		    else if( ($scope.lecture_player_controls.getDuration()-1) < total_duration || total_duration <= 0 ){
	       		return "Time Outside Video Range"
		    }
		}
	    else{
	   		return "Incorrect Time Format"
	    }
	}

	$scope.saveEdit=function(quiz){

		var a = quiz.formatedTime.split(':'); // split it at the colons			
		var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); // minutes are worth 60 seconds. Hours are worth 60 minutes.
		quiz.time = seconds
		updateOnlineQuiz(quiz)
	}

	$scope.deleteQuiz=function(quiz){
		if(confirm("Are you sure you want to delete quiz"))
			Online_quizzes.destroy(
				{online_quizzes_id: quiz.id},
				function(data){ //success
					console.log(data)
					$scope.quiz_list.splice($scope.quiz_list.indexOf(quiz), 1)
					$scope.$parent.editing_mode = false;
					$scope.$parent.selected_quiz={}
				},
				function(){ //error
					alert("Failed to delete quiz, please check network connection")
				}
			);
	}

}]);
