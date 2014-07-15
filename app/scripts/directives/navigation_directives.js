'use strict';

angular.module('scalearAngularApp')
	.directive('mainNavigation', ['Course', '$filter', function(Course, $filter){
		return {
			replace: true,
			restrict: "E",
			transclude: "true",
			scope:{
			  user: '=',
			  logout: '=',
			  changelanguage: '='
			},
			templateUrl: "/views/main_navigation.html",
			link: function (scope, element) {
				scope.today = new Date();
				Course.index({},
					function(data){
						scope.courses = data
				  		console.log(scope.courses)
					},
					function(){}
				);

				scope.getEndDate = function(start_date, duration){
					return start_date.setDate(start_date.getDate()+(duration * 7));
				}
			}
		};
	 }])
	.directive('teacherNavigation', ['ErrorHandler', '$rootScope', function(ErrorHandler, $rootScope) {
           return{
			replace:true,
			restrict: "E",
			templateUrl: '/views/teacher_sub_navigation.html',
			link: function(scope){				
			}
		};
 }]).directive('studentNavigation', ['ErrorHandler',function(ErrorHandler) {
           return{
			replace:true,
			transclude: true,
			restrict: "E",
			templateUrl: '/views/student_sub_navigation.html',
			link: function(scope){
				
			}
		};
 }]).directive('userNavigation', ['ErrorHandler','$rootScope', 'User', 'Home',function(ErrorHandler,$rootScope, User, Home) {
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
				$rootScope.$watch('current_user', function(){
					if($rootScope.current_user && $rootScope.current_user.roles){
						scope.arenotification = $rootScope.current_user.roles[0].id!=2 && ($rootScope.current_user.invitations || $rootScope.current_user.shared);
						scope.areshared = $rootScope.current_user.roles[0].id!=2 && $rootScope.current_user.accepted_shared;	
					}
				});
				scope.toggleNotifications = function(){
					scope.show_notifications = !scope.show_notifications;
					scope.show_settings = false;
				}
				scope.toggleSettings = function(){
					scope.show_notifications = false;
					scope.show_settings = !scope.show_settings;
				}
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
					scope.show_notifications = false;
				})
			}
		};
 }]);