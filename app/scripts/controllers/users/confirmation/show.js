'use strict';

angular.module('scalearAngularApp')
  .controller('UsersConfirmationShowCtrl',['$scope','User','$state','$stateParams', function ($scope, User, $state, $stateParams) {
        $scope.user={}
        User.show_confirmation({confirmation_token: $stateParams.confirmation_token }, function(data){
                $state.go("login");
                console.log("success confirmation token");
            }, function(data){
                $scope.sending=false;
            //    $state.go("login");

                $scope.user.errors=data.data;
            console.log($scope.user)
            console.log("failure confirmation token");
            })

        $scope.$watch('current_lang', function(newval, oldval){
            if(newval!=oldval)
                delete $scope.user.errors
        });
  }]);
