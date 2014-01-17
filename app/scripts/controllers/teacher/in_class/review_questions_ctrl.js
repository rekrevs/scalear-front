'use strict';

angular.module('scalearAngularApp')
  .controller('reviewQuestionsCtrl', ['$scope','$stateParams','Module','$log','$window',function ($scope, $stateParams, Module, $log, $window) {

    $window.scrollTo(0, 0);
  	var init=function(){
      $scope.loading_questions = true
  		Module.getStudentQuestions(
  			{
		      course_id:$stateParams.course_id,
           module_id:$stateParams.module_id
  			},
  			function(data){
  				$log.debug(data)
  				$scope.review_questions= data.questions
          $scope.lecture_names=data.lecture_names
          $scope.loading_questions = false
  			},
  			function(){
  	 		}
		  )
  	}

  	$scope.updateHide=function(question_id, question_hide){
  		Module.hideQuestion(
  			{
  				course_id:$stateParams.course_id,
          module_id:$stateParams.module_id
  			},
  			{
  				question:question_id,
  				hide:question_hide
  			},
  			function(){},
  			function(){}
		  )
  	}

    $scope.getLectureTitle=function(id){
      return $scope.lecture_names[id]
    }

  	init()

  }]);
