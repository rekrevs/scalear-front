'use strict';

angular.module('scalearAngularApp')
    .controller('UsersSamlCtrl', ['$scope', 'User', '$state','Page', '$filter','$location','ngDialog', function($scope, User, $state, Page, $filter, $location, ngDialog){
        Page.setTitle('account.sign_up')
        
        $scope.saml_user={}
        angular.forEach($location.$$search, function(value, key) {
          this[key] = value.replace(/\+/g, ' ')
        }, $scope.saml_user)
        console.log($scope.saml_user)

        $scope.next=function(role_id){
            var user = {}
            user.email = $scope.saml_user.mail
            user.name = $scope.saml_user.givenName
            user.last_name = $scope.saml_user.sn
            user.university = $scope.saml_user.o
            user.screen_name = $filter('anonymous')((Math.random()*10) + user.email, (role_id == 2? 'student' : 'teacher') )  
            console.log($scope.user)
            signup(user, role_id)
        }


        var signup=function(user, role_id){
            User.samlSignup({},{
                user: user,
                role_id: role_id
            },function(data){
                console.log(data.user)
                $state.go('confirmed');
            })
        }
        
        // $scope.$watch('user.email', function(){
        //     $scope.user.screen_name = $filter('anonymous')((Math.random()*10) + $scope.user.email, 'student')  
        // })
        // $scope.sign_up = function() {
        //     $scope.sending = true;
        //     $scope.final_user = angular.copy($scope.user)
        //     if(!$scope.final_user.password_confirmation){
        //         $scope.final_user.password_confirmation = ' '
        //     }
        //     delete $scope.final_user.errors
        //     User.sign_up({}, {
        //         user: $scope.final_user
        //     }, function() {
        //         $scope.sending = false;
        //         $state.go('thanks_for_registering',{type:1});
        //     }, function(response) {
        //         $scope.user.errors = response.data.errors
        //         $scope.sending = false;
        //     })
        // }

        // $scope.$watch('current_lang', function(newval, oldval) {
        //     if (newval != oldval)
        //         delete $scope.user.errors
        // });
    }
]);