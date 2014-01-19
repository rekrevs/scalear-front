'use strict';

angular.module('scalearAngularApp')
    .controller('UsersEditCtrl', ['$rootScope', '$scope', 'User', '$state',
        function($rootScope, $scope, User, $state) {

            $scope.user = {};

            $scope.$watch('current_user', function(val) {
                if (val)
                    $scope.user = {
                        name: $rootScope.current_user.name,
                        email: $rootScope.current_user.email
                    }
            })

            $scope.update_account = function() {
                delete $scope.user.errors
                User.update_account({}, {
                    user: $scope.user
                }, function() {
                    //console.log("signed up");
                    $state.go("home");
                }, function(response) {
                    $scope.user.errors = response.data.errors
                    //console.log("sign up failed")
                })
            }

            $scope.delete_account = function() {
                var confirm = window.confirm("Are you sure?");
                if (confirm) {
                    User.delete_account({}, {}, function() {
                        // //console.log("deleted ");
                        $state.go("login");
                        $rootScope.current_user = null;
                    }, function() {
                        //console.log("delete failed")
                    })
                }
            }
            $scope.$watch('current_lang', function(newval, oldval) {
                if (newval != oldval)
                    delete $scope.user.errors
            });

        }
    ]);