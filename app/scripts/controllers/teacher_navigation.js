'use strict';

angular.module('scalearAngularApp')
  .controller('teacherNavigationCtrl', ['$scope', '$state','$stateParams',function ($scope, $state, $stateParams) {
  	$scope.current_course_id= $stateParams.course_id;
  	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
    	$scope.current_state= $state;
   	})
  }]);
