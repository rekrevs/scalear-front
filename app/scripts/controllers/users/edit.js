'use strict';

angular.module('scalearAngularApp')
  .controller('UsersEditCtrl',['$scope','User','$state', '$rootScope', function ($scope, User, $state, $rootScope) {

    var init = function(){
          User.getCurrentUser({}, function(data){
            $scope.user = data.user;
            console.log('insideeeeeeeeeeee');
            console.log($scope.user);
          }, function(){
            console.log('faaaaaaaaailed');
          })
        }

        init();

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

        
        console.log('barraaaa');
            console.log($scope.user);


  }]);
