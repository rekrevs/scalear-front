'use strict';

angular.module('scalearAngularApp')
  .controller('UsersConfirmationShowCtrl',['$scope','User','$state','$stateParams', '$timeout','$rootScope', function ($scope, User, $state, $stateParams, $timeout, $rootScope) {
        $scope.user={}
        User.show_confirmation({confirmation_token: $stateParams.confirmation_token }, function(data){
                $rootScope.logging_out = true;
                $timeout(function(){
                   //$state.go("login",{},{reload:true})
                   $rootScope.$emit('$stateChangeStart', {name:'home'},{},{url:''})
                   $rootScope.logging_out = false;
                },2500)
                //console.log("success confirmation token");
            }, function(data){
                $scope.sending=false;
            //    $state.go("login");

                $scope.user.errors=data.data;
            //console.log($scope.user)
            //console.log("failure confirmation token");
            })

        $scope.$watch('current_lang', function(newval, oldval){
            if(newval!=oldval)
                delete $scope.user.errors
        });
  }]);
