'use strict';

angular.module('scalearAngularApp')
  .controller('reviewQuestionsCtrl', ['$scope','$stateParams','Module','$window',function ($scope, $stateParams, Module, $window) {
  	
  	$window.scrollTo(0, 0);
  	
  	var init=function(){
  		Module.getStudentQuestions(
  			{
		   course_id:$stateParams.course_id,
           module_id:$stateParams.module_id
  			},
  			function(data){
  				console.log(data)
  				$scope.review_questions= data.questions
          $scope.lecture_names=data.lecture_names
  			},
  			function(){
  	 		}
		  )
  	}

  	$scope.updateHide=function(question){
  		Module.hideQuestion(
  			{
  				course_id:$stateParams.course_id,
          module_id:$stateParams.module_id
  			},
  			{
  				question:question.id,
  				hide:question.hide
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
