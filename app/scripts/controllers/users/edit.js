'use strict';

angular.module('scalearAngularApp')
  .controller('UsersEditCtrl',['$scope','User','$state', '$rootScope', function ($scope, User, $state, $rootScope) {
    $scope.update_account=function(){
       User.update_account({},{user:$scope.user}, function(){
           console.log("signed up");
           $state.go("home");
       }, function(){
           console.log("sign up failed")
       })
    }

        $scope.delete_account=function(){
          var confirm = window.confirm("Are you sure?");
            if(confirm)
            {
            User.delete_account({},{}, function(){
                // console.log("deleted ");
                $state.go("login");
                $rootScope.current_user = null;
            }, function(){
                console.log("delete failed")
            })
            }
        }

  }]);
