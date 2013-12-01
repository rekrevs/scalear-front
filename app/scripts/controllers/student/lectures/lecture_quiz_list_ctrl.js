'use strict';

angular.module('scalearAngularApp')
.controller('OnlineQuizCtrl', function ($scope, Lecture, $location) {
    	$scope.solved_quiz=false;
    	
    	
    	$scope.solved = function()
    	{
    		// Lecture.get($scope.path+"/online_quizzes_solved",{quiz_id:$scope.quiz.id}, function(data){
    			// $scope.solved_quiz=data.flag;
    		// });
    	};
    	
    	$scope.$watch('update_answers', function(){
    		console.log("in update answers");
    		$scope.solved();
    	});
    	
    	
})