'use strict';

angular.module('scalearAngularApp')
  .controller('LoginCtrl',['$state','$scope','scalear_api','$location','$log', '$translate', 'User','Page', function ($state, $scope, scalear_api, $location, $log, $translate, User,Page) {
   $scope.user={}
   Page.setTitle('Login')
   $scope.login = function(){
    $scope.sending = true;
        User.sign_in({},{"user":$scope.user}, function(data){
          $scope.sending = false;
            //console.log("signed_in");
            $state.go("home");
        },function(){
          $scope.sending = false;
            //console.log("failed")
        });

       $scope.singleModel = 1;
   }
   
  }]);
