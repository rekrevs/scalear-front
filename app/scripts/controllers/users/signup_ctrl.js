'use strict';

angular.module('scalearAngularApp')
    .controller('UsersSignUpCtrl', ['$scope', 'User', '$state','Page', '$filter','$location','ngDialog', function($scope, User, $state, Page, $filter, $location, ngDialog){
        Page.setTitle('account.sign_up')

        var init=function(){
            console.log("ff",$state.params)
            $scope.user = {}
            $scope.saml_user={}
            angular.forEach($location.$$search, function(value, key) {
              this[key] = value.replace(/\+/g, ' ')
            }, $scope.saml_user)

            $scope.is_saml = $scope.saml_user.saml 
            $scope.user.email       = $scope.saml_user.mail      ||  $state.params.input1 || ""
            $scope.user.name        = $scope.saml_user.givenName || ""
            $scope.user.last_name   = $scope.saml_user.sn        || ""
            $scope.user.university  = $scope.saml_user.o         || ""
            $scope.user.password    = $state.params.input2 || ""
            
            console.log("user", $scope.user)
            console.log("saml user",$scope.saml_user)
        }

        init()

        $scope.setupScreenName=function(role_id){
            $scope.user.screen_name = $filter('anonymous')((Math.random()*10) + $scope.user.email, (role_id == 2? 'student' : 'teacher') )  
            $scope.user.role_ids = role_id
        }


        $scope.signUp=function(){
            console.log("hello world")
            console.log($scope.user)
            if($scope.is_saml){
                $scope.user.saml = $scope.is_saml
                User.samlSignup({},{
                    user: $scope.user,
                    role_id: $scope.user.role_ids
                },function(data){
                    console.log(data.user)
                    $state.go('confirmed');
                })
            }
            else{

                if(!$scope.user.password_confirmation){
                    $scope.user.password_confirmation = ' '
                }
                delete $scope.user.errors
                User.sign_up({}, {
                    user: $scope.user
                }, function() {
                    $state.go('thanks_for_registering',{type:$scope.user.role_ids-1, email : $scope.user.email}); //0 mean teacher, 1 means student
                }, function(response) {
                    $scope.user.errors = response.data.errors
                })

            }
            
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
