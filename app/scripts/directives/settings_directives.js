'use strict';

angular.module('scalearAngularApp')
  .directive('accountInformation', ['ErrorHandler','$rootScope', 'User',function(ErrorHandler, $rootScope, User) {
    return {
      replace: true,
      restrict: 'E',
      templateUrl: '/views/account_information.html',
      user: '=',
      link: function (scope, element, attrs) {
      	scope.user = {}
        $rootScope.$watch('current_user', function(val) {
            if (val)
                scope.user = {
                	screen_name: $rootScope.current_user.screen_name,
                    name: $rootScope.current_user.name,
                    last_name: $rootScope.current_user.last_name,
                    university: $rootScope.current_user.university,
                    email: $rootScope.current_user.email,
                    link: $rootScope.current_user.link,
                    bio: $rootScope.current_user.bio
                }
                // console.log(scope.user)
        })
        $rootScope.$watch('current_lang', function(newval, oldval) {
                if (newval != oldval)
                    delete scope.user.errors
        });

        scope.update_account = function() {
                scope.sending = true;
                delete scope.user.errors
                User.update_account({}, {
                    user: scope.user
                }, function() {
                    scope.sending = false;
                    scope.show_settings = false;
                }, function(response) {
                    scope.sending = false;
                    scope.user.errors = response.data.errors
                })
        }
      }
    };
  }]);
