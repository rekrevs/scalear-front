'use strict';

angular.module('scalearAngularApp')
  .controller('LoginCtrl',['$state','$scope','scalear_api','$location','$log', '$translate', 'User', function ($state, $scope, scalear_api, $location, $log, $translate, User) {
   $scope.user={}

   $scope.login = function(){
    $scope.sending = true;
        User.sign_in({},{"user":$scope.user}, function(data){
          $scope.sending = false;
            console.log("signed_in");
            $state.go("home");
        },function(){
          $scope.sending = false;
            console.log("failed")
        });

       $scope.singleModel = 1;
   }
   
  }]);
