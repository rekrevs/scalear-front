'use strict';

angular.module('scalearAngularApp')
  .controller('LoginCtrl',['$state','$scope','$rootScope', 'scalear_api','$location','$log', '$translate', 'User', 'Page', function ($state, $scope, $rootScope,scalear_api, $location, $log, $translate, User, Page) {
   $scope.user={}
   Page.setTitle('navigation.login')
   $scope.login = function(){
    $scope.sending = true;
        User.sign_in({},{"user":$scope.user}, function(data){
          $scope.sending = false;
            //console.log("signed_in");
            $rootScope.iscollapsed = true;
            $state.go("dashboard");
        },function(){
          $scope.sending = false;
            //console.log("failed")
        });

       $scope.singleModel = 1;
   }
   
  }]);
