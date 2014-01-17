'use strict';

angular.module('scalearAngularApp')
  .controller('UsersPasswordNewCtrl',['$scope','User','$state', function ($scope, User, $state) {
    $scope.user={}
    $scope.reset_password = function(){
            $scope.sending=true
            delete $scope.user.errors;
            User.reset_password({},{user:$scope.user}, function(data){
                $scope.sending=false;
                $state.go("login");
                console.log("success password reset");
            }, function(data){
                $scope.sending=false;
                $scope.user.errors=data.data.errors;
                //$state.go("login");
                console.log("failure password reset");
            })
    }
        $scope.$watch('current_lang', function(newval, oldval){
            if(newval!=oldval)
                delete $scope.user.errors
        });
  }]);
