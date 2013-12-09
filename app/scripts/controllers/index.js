'use strict';

angular.module('scalearAngularApp')
  .controller('indexController', ['$scope', '$stateParams', '$state', 'User','$rootScope','UserSession','$location','$translate','Home','$window' ,function ($scope, $stateParams, $state, User, $rootScope , UserSession, $location, $translate, Home, $window) {
	$scope.technical={};
	$scope.technical.show_technical=false;   	
   	//console.log("uses is "+$translate.uses);
   	//console.log("uses is "+$translate.uses());

	$scope.changeLanguage = function (key) {
		console.log("in change language "+key);
    	$translate.uses(key);
    	$rootScope.current_lang=key;
    	$window.moment.lang(key);
  	};
  	
  	$scope.changeLanguage($translate.uses());

  	//$scope.changeLanguage("en");
  	
  	$scope.technical.send_technical = function(){
  		console.log("in sending");
  		$scope.technical.sending_technical=true;
  		Home.technicalProblem({url:$location.url(), problem:$scope.technical.data },function(data){
  			$scope.technical.data="";
  			$scope.technical.sending_technical=false;
  			$scope.technical.show_technical=false;
  		});
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

