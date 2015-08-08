'use strict';

angular.module('scalearAngularApp')
    .controller('UsersStudentCtrl', ['$scope', 'User', '$state','Page', '$filter',
        function($scope, User, $state, Page, $filter) {
            Page.setTitle('sign_up')
            $scope.user = {
                "role_ids": "2"
            }
            $scope.$watch('user.email', function(){
                // if($scope.user.email){
                    $scope.user.screen_name = $filter('anonymous')((Math.random()*10) + $scope.user.email, 'student')  
                // }
            })
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
                    //$log.debug("signed up");
                    // $state.go("home");
                    $state.go('thanks_for_registering',{type:1});
                }, function(response) {
                    $scope.user.errors = response.data.errors
                    $scope.sending = false;
                    //$log.debug($scope.user)
                    //$log.debug("sign up failed")
                })
            }

            $scope.$watch('current_lang', function(newval, oldval) {
                if (newval != oldval)
                    delete $scope.user.errors
            });
        }
    ]);