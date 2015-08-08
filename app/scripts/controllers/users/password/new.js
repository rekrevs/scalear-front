'use strict';

angular.module('scalearAngularApp')
  .controller('UsersPasswordNewCtrl',['$scope','User','$state','Page', function ($scope, User, $state,Page) {
    Page.setTitle('password_edit.new_password')
    $scope.user={}
    $scope.reset_password = function(){
            $scope.sending=true
            delete $scope.user.errors;
            User.reset_password({},{user:$scope.user}, function(){
                $scope.sending=false;
                $state.go("login");
            }, function(data){
                $scope.sending=false;
                $scope.user.errors=data.data.errors;
            })
    }
        $scope.$watch('current_lang', function(newval, oldval){
            if(newval!=oldval)
                delete $scope.user.errors
        });
  }]);
