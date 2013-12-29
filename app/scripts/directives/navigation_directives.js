'use strict';

angular.module('scalearAngularApp')
	.directive('teacherNavigation', [function() {
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
	.directive('studentNavigation', [function() {
           return{
			replace:true,
			restrict: "E",
			templateUrl: '/views/student_navigation.html',
		};
 }]);