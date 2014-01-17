'use strict';

angular.module('scalearAngularApp')
  .controller('LoginCtrl',['$state','$scope','scalear_api','$location','$log', '$translate', 'User', function ($state, $scope, scalear_api, $location, $log, $translate, User) {
   $scope.user={}

   $scope.login = function(){
        User.sign_in({},{"user":$scope.user}, function(data){
            console.log("signed_in");
            $state.go("home");
        },function(){
            console.log("failed")
        });

       $scope.singleModel = 1;
   }
   
  }]);
