'use strict';

angular.module('scalearAngularApp')
  .controller('studentLectureMiddleCtrl', ['$scope','Course','$stateParams','Lecture', function ($scope, Course, $stateParams,Lecture) {
//    console.log($scope);
//    $scope.lecture=lecture.data
    $scope.quiz_layer={}
    $scope.lecture_player={}
    $scope.lecture_player.events={}
    $scope.display_mode=false
    
    $scope.hideOverlay= function(){
 		$scope.hide_overlay = true
 	}
 	
 	var init= function(){
 		Lecture.getLectureStudent({course_id:$stateParams.course_id, lecture_id:$stateParams.lecture_id}, function(data){
 			$scope.lecture=JSON.parse(data.lecture)
 			console.log($scope.lecture.online_quizzes)
 			$scope.lecture_player.events.onReady=function(){
 				$scope.lecture.online_quizzes.forEach(function(quiz){
 					$scope.lecture_player.controls.cue(quiz.time, function(){
 						$scope.selected_quiz=quiz
 						$scope.display_mode=true
 						$scope.lecture_player.controls.pause()
 						if(quiz.quiz_type == 'invideo'){
	 						//showInvideoQuiz()
 						}
	 					else
	 						console.log("html")

 						$scope.$apply()
	 				})
 				})
 			}
 			$scope.$emit('accordianUpdate',{g_id:$scope.lecture.group_id, type:"lecture", id:$scope.lecture.id});
 		});	
    }
    init();

    // var showInvideoQuiz=function(){

    // }
    
  }]);
