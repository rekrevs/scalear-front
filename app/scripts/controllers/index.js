'use strict';

angular.module('scalearAngularApp')
  .controller('indexController', ['$scope', '$stateParams', '$state', 'User','$rootScope','UserSession','$location','$translate' ,function ($scope, $stateParams, $state, User, $rootScope , UserSession, $location, $translate) {
   	
   	$rootScope.current_lang="en";

	$scope.changeLanguage = function (key) {
		console.log("in change language "+key);
    	$translate.uses(key);
    	$rootScope.current_lang=key;
  	};
   	// $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
    	// $scope.current_state= $state;
   	// })
   	// var getUser= function()
   	// {
   		// User.getCurrentUser(function(data){
   			// data.user=JSON.parse(data.user);
   			// if(data.signed_in == true)
   				// $rootScope.current_user=data.user
//    				
   			// console.log($rootScope.current_user);
   		// })
   	// }
//    	
   	// getUser();
//    	
   	
   	$scope.logout = function()
   	{
   		User.logout(function(){
   			console.log("logged out");
   			$rootScope.current_user=null
   			$state.go("home");
   		}, function(){
   			
   		})
   	}
   	
   	$scope.coursePage = function()
   	{
   		if($rootScope.current_user.roles[0].id == 1 || $rootScope.current_user.roles[0].id == 5) // admin
   			$state.go("course_list");
   		else
   			$state.go("student_courses");
   	}
   	
   	
   	
   	
}]);

