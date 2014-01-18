'use strict';

angular.module('scalearAngularApp')
    .controller('UsersTeacherCtrl', ['$scope', 'User', '$state',
        function($scope, User, $state) {
            $scope.user = {
                "role_ids": "1"
            }
            $scope.sign_up = function() {
                $scope.sending = true;
                delete $scope.user.errors
                User.sign_up({}, {
                    user: $scope.user
                }, function() {
                    $scope.sending = false;
                    //console.log("signed up");
                    $state.go("home");
                }, function(response) {
                    $scope.user.errors = response.data.errors
                    $scope.sending = false;
                    //console.log("sign up failed")
                })
            }

            $scope.$watch('current_lang', function(newval, oldval) {
                if (newval != oldval)
                    delete $scope.user.errors
            });
        }
    ]);