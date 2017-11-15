/* istanbul ignore next */ 
'use strict';

angular.module('scalearAngularApp')
  .controller('UsersConfirmationNewCtrl',['$scope','User','$state','Page', function ($scope, User, $state,Page) {
        Page.setTitle('account.resend_confirmation')
        $scope.user={}
        $scope.resend = function(){
            delete $scope.user.errors;
            $scope.sending=true
            User.resend_confirmation({},{email: $scope.user.email}, function(){
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
