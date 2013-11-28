'use strict';

angular.module('scalearAngularApp')
  .controller('reviewQuestionsCtrl', ['$scope','$stateParams','Module',function ($scope, $stateParams, Module) {
  	var init=function(){
  		Module.getStudentQuestions(
  			{
			 	course_id:$stateParams.course_id,
                module_id:$stateParams.module_id
  			},
  			function(data){
  				console.log(data)
  				$scope.questions= data.questions
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

  	init()


  }]);
