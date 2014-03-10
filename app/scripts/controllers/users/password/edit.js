'use strict';

angular.module('scalearAngularApp')
  .controller('UsersPasswordEditCtrl',['$scope','User','$state','$stateParams','$rootScope','Page', function ($scope, User, $state, $stateParams, $rootScope,Page) {
    Page.setTitle('Restting Password')
    $scope.user={"reset_password_token": $stateParams.reset_password_token}
    $scope.change_password = function(){
        delete $scope.user.errors;
            User.change_password({},{user:$scope.user}, function(data){
                $rootScope.$emit('$stateChangeStart', {name:'home'},{},{url:''})
            }, function(data){
                $scope.user.errors= data.data.errors;
            })
    }

        $scope.$watch('current_lang', function(newval, oldval){
            if(newval!=oldval)
                delete $scope.user.errors
        });
  }]);
