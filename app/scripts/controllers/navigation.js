'use strict';

angular.module('scalearAngularApp')
  .controller('navigationCtrl', ['$scope', '$state','$stateParams','course_information',function ($scope, $state, $stateParams, course_information) {
  	$scope.current_course_id= $stateParams.course_id;
  	$scope.course_information=course_information.data.course;
  	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
    	$scope.current_state= $state;
   	})
  	
  }]);
