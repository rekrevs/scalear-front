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
			templateUrl: '/views/student_navigation.html',
			link: function(scope){
				scope.settingsOpened = function(which){
					scope.selected=which;
					scope.$emit('settingsOpened', [which]);
				}
				scope.$on('mainMenuToggled', function(event, collapsed){
					scope.show_settings = false;
				})
			}
		};
 }]);

angular.module('scalearAngularApp')
	.directive('userNavigation', ['ErrorHandler','$rootScope', 'User',function(ErrorHandler,$rootScope, User) {
           return{
			replace:true,
			restrict: "E",
			scope: {
				courses: "=",
				//currentuser: '=',
				iscollapsed: '=',
				role: '='
			},
			templateUrl: '/views/user_navigation.html',
			link: function(scope){
				scope.update_account = function() {
	                scope.sending = true;
	                delete $rootScope.current_user.errors
	                User.update_account({}, {
	                    user: $rootScope.current_user
	                }, function() {
	                    scope.sending = false;
	                    //console.log("signed up");
	                    scope.iscollapsed=true;
	                }, function(response) {
	                    scope.sending = false;
	                    $rootScope.current_user.errors = response.data.errors
	                    //console.log("sign up failed")
	                })
	            };
	            scope.$on('mainMenuToggled', function(event, collapsed){
					scope.show_settings = false;
				})
			}
		};
 }]);