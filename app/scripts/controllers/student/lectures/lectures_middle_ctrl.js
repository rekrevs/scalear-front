'use strict';

angular.module('scalearAngularApp')
  .controller('studentLectureMiddleCtrl', ['$scope','Course','$stateParams','lecture', function ($scope, Course, $stateParams, lecture) {
//    console.log($scope);
    $scope.lecture=lecture.data
    $scope.quiz_layer={}
    $scope.lecture_player_controls={}
    $scope.$emit('accordianUpdate',{g_id:$scope.lecture.group_id, type:"lecture", id:$scope.lecture.id});
    
    $scope.hideOverlay= function(){
 		$scope.hide_overlay = true
 	}
    
  }]);
