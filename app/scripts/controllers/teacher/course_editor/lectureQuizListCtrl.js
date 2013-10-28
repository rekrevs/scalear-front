'use strict';

angular.module('scalearAngularApp')
    .controller('lectureQuizListCtrl', function ($scope, $http, $stateParams, $state, $filter, Online_quizzes) {

	console.log("loading quiz list")
	$scope.editingMode = false

	Online_quizzes.get_quiz_list(
		{lecture_id:$scope.lecture.id},
		function(data){
			$scope.$parent.quizList = data.quizList
		},
		function(){
			alert("Failed to Load Quiz List")
		}
	);
	

	var update_online_quiz=function(quiz){
		console.log(quiz)
		Online_quizzes.update(
			{param: quiz.id},
			{ online_quiz: {time:Math.round(quiz.time), question:quiz.question}},
			function(data){ //success
				console.log(data)
			},
			function(){ //error

			}
		);
	}
 	var validate_time=function(time) {
 		
		var intRegex = /^\d\d:\d\d:\d\d$/;  //checking format
		if(intRegex.test(time)) { 
		    var hhmm = time.split(':'); // split hours and minutes
		    var hours = parseInt(hhmm[0]); // get hours and parse it to an int
		    var minutes = parseInt(hhmm[1]); // get minutes and parse it to an int
		    var seconds = parseInt(hhmm[2]);
		    // check if hours or minutes are incorrect
		    var total_duration=(hours*60*60)+(minutes*60)+(seconds);
		    if(hours < 0 || hours > 24 || minutes < 0 || minutes > 59 || seconds< 0 || seconds > 59) {// display error
	       		$scope.alertMsg="Incorrect Time Format"
	        	return false;
		    }
		    else if( ($scope.player.duration()-1) < total_duration || total_duration <= 0 ){
	       		$scope.alertMsg="Time Outside Video Range"
	        	return false;
		    }
		    else
		    	return true;
		}
	    else{
	   		$scope.alertMsg="Incorrect Time Format"
	    	return false;
	    }
	}

	$scope.validate_edit=function(quiz){
		if(!quiz.formatedTime)
			quiz.formatedTime = $filter('format')(quiz.time)

		if(validate_time(quiz.formatedTime)){				
			var a = quiz.formatedTime.split(':'); // split it at the colons			
			var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); // minutes are worth 60 seconds. Hours are worth 60 minutes.
			quiz.time = seconds
			$scope.alertMsg=""
			update_online_quiz(quiz)	
			return false			
		}
		else
			return true		
	}

	$scope.delete_quiz=function(index){
		if(confirm("Are you sure you want to delete quiz"))
			Online_quizzes.destroy(
				{param: $scope.quizList[index].id},
				function(data){ //success
					console.log(data)
					$scope.quizList.splice(index, 1)
					$scope.$parent.editingMode = false;
					$scope.$parent.selectedQuiz={}
				},
				function(){ //error
					alert("Failed to delete quiz, please check network connection")
				}
			);
	}

	$scope.edit_quiz = function(quiz){
		$scope.player.currentTime(quiz.time);
		$scope.player.pause();
	 }
});


// check_enter = function(ev,the_id)
// {
// 	if (ev.keyCode == 13) {
//         // Do something
    
// 	var id= the_id;
// 	if(validate($("#time_"+id), id))
// 	{
// 		var a = $("#time_"+id).val().split(':'); // split it at the colons
// 		// minutes are worth 60 seconds. Hours are worth 60 minutes.
// 		var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 

// 		$.ajax({url:"/<%= I18n.locale %>/online_quizzes/"+id, type:'put',data: { online_quiz: {time:Math.round(seconds), question:$("#question_"+id).val()}}, dataType:'script'}); //save with time
// 	}
// 	}
// }

// $(document).ready(function(){
// 	//$(document).on("click", ".edit_question", function () {
// 
// 	});

// 	$(".edit_question").click(function(event){


// });

// 	// $('#change_time').click(function(event){
// 		// if($(this).is(":checked")){
// 			// $('#vid').show();
// 			// var time=$(this).siblings("#time").val()
// 			// tt=time.split(":");
// 			// sec=tt[0]*3600+tt[1]*60+tt[2]*1;
// 			// console.log("time is "+sec)
// 			// pop2.currentTime(sec);
// 			// console.log(pop2);
// 		// }else{
// 			// $('#vid').hide();
// 		// }
// 	// });
	
// 	$("#save_quiz").click(function(event){
// 		id= $("#quiz_id").val()
// 		$('#myModal').modal('hide');
// 		if($('#change_time').is(":checked"))
// 			$.ajax({url:"/<%= I18n.locale %>/online_quizzes/"+id, type:'put',data: { online_quiz: {time: Math.round(pop2.currentTime()), question:$("#question").val()}}, dataType:'script'}); //save with time
// 		else
// 			$.ajax({url:"/<%= I18n.locale %>/online_quizzes/"+id, type:'put',data: { online_quiz:{question:$("#question").val()}}, dataType:'script'}); //save without time
		
// 	});	
// });

// 