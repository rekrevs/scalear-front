'use strict';

angular.module('scalearAngularApp')
  .controller('indexController', ['$scope', '$stateParams', '$state' ,function ($scope, $stateParams, $state ) {
   	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
    	$scope.current_state= $state;
   	})
}]);

