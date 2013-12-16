'use strict';

angular.module('scalearAngularApp')
  .controller('indexController', ['$scope', '$state', 'User','$rootScope','$translate','$window','$log' ,function ($scope, $state, User, $rootScope, $translate, $window, $log) {
	
	$scope.changeLanguage = function (key) {
		$log.debug("in change language "+key);
    	$translate.uses(key);
    	$rootScope.current_lang=key;
    	$window.moment.lang(key);
  	};
  	
  	$scope.changeLanguage($translate.uses());

   	$scope.logout = function()
   	{
   		User.logout(function(){
   			$log.debug("logged out");
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

