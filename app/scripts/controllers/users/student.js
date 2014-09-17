'use strict';

angular.module('scalearAngularApp')
    .controller('UsersStudentCtrl', ['$scope', 'User', '$state','Page',
        function($scope, User, $state, Page) {
            Page.setTitle('sign_up')
            $scope.user = {
                "role_ids": "2"
            }
            $scope.sign_up = function() {
                $scope.sending = true;
                $scope.final_user = angular.copy($scope.user)
                if(!$scope.final_user.password_confirmation){
                    $scope.final_user.password_confirmation = ' '
                }
                delete $scope.final_user.errors
                User.sign_up({}, {
                    user: $scope.final_user
                }, function() {
                    $scope.sending = false;
                    //console.log("signed up");
                    // $state.go("home");
                    $state.go('thanks_for_registering',{type:1});
                }, function(response) {
                    $scope.user.errors = response.data.errors
                    $scope.sending = false;
                    //console.log($scope.user)
                    //console.log("sign up failed")
                })
            }

            $scope.$watch('current_lang', function(newval, oldval) {
                if (newval != oldval)
                    delete $scope.user.errors
            });
        }
    ]);