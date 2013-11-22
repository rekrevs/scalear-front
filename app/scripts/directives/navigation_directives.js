'use strict';

angular.module('scalearAngularApp')
	.directive('teacherNavigation', ['ErrorHandler',function(ErrorHandler) {
           return{
			replace:true,
			restrict: "E",
			templateUrl: 'views/teacher_navigation.html',
		};
 }]);
 
angular.module('scalearAngularApp')
	.directive('studentNavigation', ['ErrorHandler',function(ErrorHandler) {
           return{
			replace:true,
			restrict: "E",
			templateUrl: 'views/student_navigation.html',
		};
 }]);