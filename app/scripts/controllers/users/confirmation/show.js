'use strict';

angular.module('scalearAngularApp')
  .controller('UsersConfirmationShowCtrl',['$scope','User','$state','$stateParams', '$timeout','$rootScope','UserSession','Page', function ($scope, User, $state, $stateParams, $timeout, $rootScope, UserSession,Page) {
        Page.setTitle('Verifying Account')
        $scope.user={}
        $scope.sending=true

        UserSession.getRole().then(function(result) {
        if(result==0)
        {
        User.show_confirmation({confirmation_token: $stateParams.confirmation_token }, function(data){

                $timeout(function(){
                   //$state.go("login",{},{reload:true})
                   $scope.sending=false;
                   $rootScope.$emit('$stateChangeStart', {name:'home'},{},{url:''})

                },2500)
                //console.log("success confirmation token");
            }, function(data){
                $scope.sending=false;
            //    $state.go("login");

                $scope.user.errors=data.data;
            //console.log($scope.user)
            //console.log("failure confirmation token");
            })
            }
        })

        $scope.$watch('current_lang', function(newval, oldval){
            if(newval!=oldval)
                delete $scope.user.errors
        });
  }]);
