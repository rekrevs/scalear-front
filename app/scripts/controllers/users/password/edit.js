'use strict';

angular.module('scalearAngularApp')
  .controller('UsersPasswordEditCtrl',['$scope','User','$state','$stateParams', function ($scope, User, $state, $stateParams) {
    //console.log($location.search());
    //console.log($stateParams)
        //($location.search()).reset_password_token
    $scope.user={"reset_password_token": $stateParams.reset_password_token}
    //console.log($scope.user);
    $scope.change_password = function(){
        delete $scope.user.errors;
            User.change_password({},{user:$scope.user}, function(data){
                $state.go("home");
                console.log("success password reset");
            }, function(data){
                //$state.go("login");
                $scope.user.errors= data.data.errors;
                console.log("failure password reset");
            })
    }

        $scope.$watch('current_lang', function(newval, oldval){
            if(newval!=oldval)
                delete $scope.user.errors
        });
  }]);
