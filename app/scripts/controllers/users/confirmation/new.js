'use strict';

angular.module('scalearAngularApp')
  .controller('UsersConfirmationNewCtrl',['$scope','User','$state','Page', function ($scope, User, $state,Page) {
        Page.setTitle('Request new confirmation token')
        $scope.user={}
        $scope.resend = function(){
            delete $scope.user.errors;
            $scope.sending=true
            User.resend_confirmation({},{user:$scope.user}, function(data){
                $scope.sending=false;
                $state.go("login");
                //console.log("success password reset");
            }, function(data){
                $scope.sending=false;
                $scope.user.errors=data.data.errors;
                //$state.go("login");
                //console.log("failure password reset");
            })
        }

        $scope.$watch('current_lang', function(newval, oldval){
            if(newval!=oldval)
                    delete $scope.user.errors
        });
  }]);
