'use strict';

angular.module('scalearAngularApp')
    .controller('UsersTeacherCtrl', ['$scope', 'User', '$state','Page','$log', function($scope, User, $state, Page, $log) {
            $state.go('signup')
            // Page.setTitle('account.sign_up')
            // $scope.user = {
            //     "role_ids": "1"
            // }
            // $scope.$watch('user.name', function(){
            //     if($scope.user.name && $scope.user.last_name){
            //         $scope.user.screen_name =   $scope.user.name.charAt(0).toUpperCase()+$scope.user.name.slice(1).toLowerCase()+' '+$scope.user.last_name.charAt(0).toUpperCase()+' Teacher';
            //     }
            // })
            // $scope.$watch('user.last_name', function(){
            //     if($scope.user.name && $scope.user.last_name){
            //         $scope.user.screen_name =   $scope.user.name.charAt(0).toUpperCase()+$scope.user.name.slice(1).toLowerCase()+' '+$scope.user.last_name.charAt(0).toUpperCase()+' Teacher';
            //     }
            // })
            // $scope.sign_up = function() {
            //     $log.debug('came here')
            //     $scope.sending = true;
            //     $scope.final_user = angular.copy($scope.user)
            //     if(!$scope.final_user.password_confirmation){
            //         $scope.final_user.password_confirmation = ' '
            //     }
            //     delete $scope.final_user.errors
            //     User.sign_up({}, {
            //         user: $scope.final_user
            //     }, function() {
            //         $scope.sending = false;
            //         $state.go('thanks_for_registering',{type:0});
            //     }, function(response) {
            //         $scope.user.errors = response.data.errors
            //         $scope.sending = false;
            //     })
            // }

            // $scope.$watch('current_lang', function(newval, oldval) {
            //     if (newval != oldval)
            //         delete $scope.user.errors
            // });
        }
    ]);
