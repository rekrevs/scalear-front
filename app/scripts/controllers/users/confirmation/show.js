'use strict';

angular.module('scalearAngularApp')
  .controller('UsersConfirmationShowCtrl',['$scope','User','$state','$stateParams', function ($scope, User, $state, $stateParams) {
            User.show_confirmation({confirmation_token: $stateParams.confirmation_token }, function(data){
                $state.go("login");
                console.log("success confirmation token");
            }, function(data){
                $scope.sending=false;
                $state.go("login");
                console.log("failure confirmation token");
            })
  }]);
