'use strict';

angular.module('scalearAngularApp')
  .controller('UsersConfirmationNewCtrl',['$scope','User','$state', function ($scope, User, $state) {
        $scope.user={}
        $scope.resend = function(){
            $scope.sending=true
            User.resend_confirmation({},{user:$scope.user}, function(data){
                $scope.sending=false;
                $state.go("login");
                console.log("success password reset");
            }, function(data){
                $scope.sending=false;
                $state.go("login");
                console.log("failure password reset");
            })
        }
  }]);
