'use strict';

angular.module('scalearAngularApp')
  .controller('indexController', ['$scope', '$stateParams', '$state', 'User','$rootScope' ,function ($scope, $stateParams, $state, User, $rootScope ) {
   	// $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
    	// $scope.current_state= $state;
   	// })
   	var getUser= function()
   	{
   		User.getCurrentUser(function(data){
   			data.user=JSON.parse(data.user);
   			if(data.signed_in == true)
   				$rootScope.current_user=data.user
   				
   			console.log($rootScope.current_user);
   		})
   	}
   	
   	getUser();
   	$scope.logout = function()
   	{
   		User.logout(function(){
   			console.log("logged out");
   			$rootScope.current_user=null
   			$state.go("home");
   		}, function(){
   			
   		})
   	}
   	
}]);

