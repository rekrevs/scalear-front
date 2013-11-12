'use strict';

angular.module('scalearAngularApp')
  .controller('teacherNavigationCtrl', ['$scope', '$state',function ($scope, $state) {
  	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
    	$scope.current_state= $state;
   	})
  }]);
