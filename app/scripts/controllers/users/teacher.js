'use strict';

angular.module('scalearAngularApp')
  .controller('UsersTeacherCtrl',['$scope','User','$state', function ($scope, User, $state) {
    $scope.user={"role_ids":"1"}
    $scope.sign_up=function(){
       User.sign_up({},{user:$scope.user}, function(){
           console.log("signed up");
           $state.go("home");
       }, function(){
           console.log("sign up failed")
       })
    }

  }]);
