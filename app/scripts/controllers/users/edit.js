'use strict';

angular.module('scalearAngularApp')
  .controller('UsersEditCtrl',['$scope','User','$state', function ($scope, User, $state) {
    $scope.update_account=function(){
       User.update_account({},{user:$scope.user}, function(){
           console.log("signed up");
           $state.go("home");
       }, function(){
           console.log("sign up failed")
       })
    }

        $scope.delete_account=function(){
            if(confirm)
            {
            User.delete_account({},{}, function(){
                console.log("deleted ");
                $state.go("login");
            }, function(){
                console.log("delete failed")
            })
            }
        }

  }]);
