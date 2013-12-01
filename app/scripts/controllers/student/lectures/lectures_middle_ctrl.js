'use strict';

angular.module('scalearAngularApp')
  .controller('studentLectureMiddleCtrl', ['$scope','Course','$stateParams','Lecture','$document', function ($scope, Course, $stateParams,Lecture, $document) {
//    console.log($scope);
//    $scope.lecture=lecture.data
    $scope.quiz_layer={}
    $scope.lecture_player={}
    $scope.lecture_player.events={}
    
    
    //$scope.lecture_player_events
    
    $scope.hideOverlay= function(){
 		$scope.hide_overlay = true
 	}
 	
 	var init= function(){
 		Lecture.getLectureStudent({course_id:$stateParams.course_id, lecture_id:$stateParams.lecture_id}, function(data){
 			$scope.lecture=JSON.parse(data.lecture)
 			console.log($scope.lecture.online_quizzes)
 			//$scope.online_quizzes=data.online_quizzes;
 			$scope.$emit('accordianUpdate',{g_id:$scope.lecture.group_id, type:"lecture", id:$scope.lecture.id});
 		});
 				
    }
    init();
    
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
