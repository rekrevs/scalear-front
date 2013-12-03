'use strict';

angular.module('scalearAngularApp')
  .controller('studentLectureMiddleCtrl', ['$scope','Course','$stateParams','Lecture','$document','$timeout', function ($scope, Course, $stateParams,Lecture, $document, $timeout) {
//    console.log($scope);
//    $scope.lecture=lecture.data
    $scope.quiz_layer={}
    $scope.lecture_player={}
    $scope.lecture_player.events={}
    $scope.display_mode=false
    $scope.studentAnswers={}
    $scope.explanation={}

    
    //$scope.lecture_player_events
    
    $scope.hideOverlay= function(){
 		$scope.hide_overlay = true
 	}
 	
 	var init= function(){
 		Lecture.getLectureStudent({course_id:$stateParams.course_id, lecture_id:$stateParams.lecture_id}, function(data){
 			$scope.alert_messages=data.alert_messages;
 			$scope.lecture=JSON.parse(data.lecture)
 			console.log($scope.lecture.online_quizzes)
 			$scope.lecture_player.events.onReady=function(){
 				$scope.lecture.online_quizzes.forEach(function(quiz){
 					$scope.lecture_player.controls.cue(quiz.time, function(){
 						$scope.studentAnswers[quiz.id]={}
 						$scope.selected_quiz=quiz
 						$scope.display_mode=true
 						$scope.lecture_player.controls.pause()
 						if(quiz.quiz_type == 'invideo')
	 						console.log('invideo')
	 					else
	 					{
	 						console.log("html")
	 						console.log("HTML quiz")
							$scope.quiz_layer.backgroundColor= "white"
							$scope.quiz_layer.overflowX= 'hidden'
            				$scope.quiz_layer.overflowY= 'auto'
            				if(quiz.question_type.toUpperCase()=="DRAG")
            				{
            					$scope.studentAnswers[quiz.id]=quiz.online_answers[0].answer;
            				}
	 					}

 						$scope.$apply()
	 				})
 				})
 			}
 			$scope.$emit('accordianReload');
			$scope.$emit('accordianUpdate',{g_id:$scope.lecture.group_id, type:"lecture", id:$scope.lecture.id});
 			//$scope.$emit('accordianUpdate',{g_id:$scope.lecture.group_id, type:"lecture", id:$scope.lecture.id});
 		
 		});	
    
    
    
    }
    
    
    init();
   
   
   $scope.lecture_player.events.onPlay=function(){
   		// here check if selected_quiz solved now.. or ever will play, otherwhise will stop again.
   		if($scope.display_mode==true)
   		{
   			console.log($scope.selected_quiz)
   			if($scope.selected_quiz.is_quiz_solved==false)
   			{
   				$scope.lecture_player.controls.pause();
   				$scope.show_notification="You must answer the question";
   				$timeout(function(){
	             		 $scope.show_notification=false;
	         	}, 2000);
   				// show message telling him to answer. notification directive.. pass text to it..
   				// also when just solved it want to set is_quiz_solved.. gheir ely bageebo from there..
   			}
   			else
   				$scope.display_mode=false;
   		}
   		
   }
    $scope.safeApply = function(fn) {
  			var phase = this.$root.$$phase;
  			if(phase == '$apply' || phase == '$digest') {
    			if(fn && (typeof(fn) === 'function')) {
      				fn();
    			}
  			} else {
    			this.$apply(fn);
  			}
		};
	
	
    
  }]);
