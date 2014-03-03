'use strict';

angular.module('scalearAngularApp')
	.directive('teacherNavigation', ['ErrorHandler',function(ErrorHandler) {
           return{
			replace:true,
			restrict: "E",
			templateUrl: '/views/teacher_navigation.html',
			link: function(scope){
				scope.course_information_state=function(){
					return scope.current_state.includes('course.edit_course_information') ||
					scope.current_state.includes('course.enrolled_students') ||
					scope.current_state.includes('course.teachers') ||
					scope.current_state.includes('course.send_emails');
				};
			}
		};
 }]);
 
angular.module('scalearAngularApp')
	.directive('studentNavigation', ['ErrorHandler',function(ErrorHandler) {
           return{
			replace:true,
			restrict: "E",
			courses: "=",
			templateUrl: '/views/student_navigation.html'
		};
 }]);

angular.module('scalearAngularApp')
	.directive('userNavigation', ['ErrorHandler','$rootScope',function(ErrorHandler,$rootScope) {
           return{
			replace:true,
			restrict: "E",
			scope: {
				courses: "=",
				//currentuser: '=',
				iscollapsed: '=',
				role: '='
			},
			templateUrl: '/views/user_navigation.html'
		};
 }]);