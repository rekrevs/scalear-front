'use strict';

angular.module('scalearAngularApp')
  .controller('studentLectureMiddleCtrl', ['$scope','Course','$stateParams','Lecture','$window','$timeout','$translate', '$state', '$log','CourseEditor', function ($scope, Course, $stateParams,Lecture, $window, $timeout, $translate, $state, $log,CourseEditor) {

  	$scope.video_layer={}
    $scope.quiz_layer={}
    $scope.resize={}
    $scope.lecture={}
    $scope.lecture.aspect_ratio=""
    $scope.lecture_player={}
    $scope.lecture_player.events={}
    $scope.display_mode=false
    $scope.studentAnswers={}
    $scope.explanation={}
    $scope.wHeight=0;
    $scope.wWidth=0;
    $scope.pHeight=0;
    $scope.pWidth=0;
    $scope.show_notification=false;
    $scope.fullscreen = false
 	
 	
 
 	var init= function(){
 		Lecture.getLectureStudent(
 			{
 				course_id:$stateParams.course_id, 
 				lecture_id:$stateParams.lecture_id
 			}, 
 			function(data){
	 			$scope.alert_messages=data.alert_messages;
	 			$scope.lecture=JSON.parse(data.lecture)
	 			for(var element in $scope.lecture.online_quizzes) // if no answers remove it
	 			{
	 				if($scope.lecture.online_quizzes[element].online_answers.length===0)
	 					$scope.lecture.online_quizzes.splice(element, 1);
	 			}
	 			$scope.next_lecture = data.next_lecture
	 			var watcher=$scope.$watch('course', function(){
	 				if($scope.$parent.course)
	 				{
	 					var group_index= CourseEditor.get_index_by_id($scope.$parent.course.groups, data.done[1])
	 					var lecture_index= CourseEditor.get_index_by_id($scope.$parent.course.groups[group_index].lectures, data.done[0])
	 					if(lecture_index!=-1 && group_index!=-1)
	 						$scope.$parent.course.groups[group_index].lectures[lecture_index].is_done= data.done[2]
	 					watcher();
	 				}	
	 			})
	 			
	 			$log.debug($scope.lecture.online_quizzes)

	 			$scope.lecture_player.events.onReady=function(){
	 				$scope.lecture.online_quizzes.forEach(function(quiz){
	 					$scope.lecture_player.controls.cue(quiz.time, function(){
	 						$scope.studentAnswers[quiz.id]={}
	 						$scope.selected_quiz=quiz
	 						$scope.display_mode=true
	 						$scope.lecture_player.controls.pause()
	 						if(quiz.quiz_type == 'invideo'){
		 						$scope.quiz_layer.backgroundColor= ""
		 						$scope.quiz_layer.overflowX= ''
	            				$scope.quiz_layer.overflowY= ''
	 						}
		 					else{
		 						$log.debug("HTML quiz")
								$scope.quiz_layer.backgroundColor= "white"
								$scope.quiz_layer.overflowX= 'hidden'
	            				$scope.quiz_layer.overflowY= 'auto'
	            				if(quiz.question_type.toUpperCase()=="DRAG")
	            					$scope.studentAnswers[quiz.id]=quiz.online_answers[0].answer;
		 					}
	 						$scope.$apply()
		 				})
	 				})
	 				$scope.lecture_player.controls.cue($scope.lecture_player.controls.getDuration()-1, function(){
	 					if($scope.next_lecture.id){
		 					var next_state="course.lectures."+$scope.next_lecture.class_name
				 			var s= $scope.next_lecture.class_name+"_id"
				 			var to={}
				 			to[s] = $scope.next_lecture.id 
				 			$state.go(next_state, to);
			 			}
	 				})
	 			}
	 			// here need to update scope.parent.
	 			//$scope.$emit('accordianReload');
				$scope.$emit('accordianUpdate',{g_id:$scope.lecture.group_id, type:"lecture", id:$scope.lecture.id});	
	 		}
 		);
    }

    $scope.seek=function(time){
    	$scope.selected_quiz='';
		$scope.display_mode=false;
    	$scope.lecture_player.controls.seek(time)
    }

   $scope.lecture_player.events.onPlay=function(){
   		// here check if selected_quiz solved now.. or ever will play, otherwhise will stop again.
   		if($scope.display_mode===true){
   			$log.debug($scope.selected_quiz)
   			if($scope.selected_quiz.is_quiz_solved===false){
   				$log.debug("in notification")
   				$scope.lecture_player.controls.pause();
   				$scope.lecture_player.controls.seek($scope.selected_quiz.time)
				$scope.show_notification=$translate('groups.answer_question');	
   				$timeout(function(){
         		 	$scope.show_notification=false;
	         	}, 2000);
   				// show message telling him to answer. notification directive.. pass text to it..
   				// also when just solved it want to set is_quiz_solved.. gheir ely bageebo from there..
   			}
   			else{
   				$scope.selected_quiz='';
   				$scope.display_mode=false;
   			}
   		}
   	}

    init();
    
  }]);
