'use strict';

angular.module('scalearAngularApp')
    .controller('UsersEditCtrl', ['$rootScope', '$scope', 'User', '$state','$modal','Page',
        function($rootScope, $scope, User, $state, $modal,Page) {
            Page.setTitle('navigation.edit_account')
            $scope.user = {};

            $scope.$watch('current_user', function(val) {
                if (val)
                    $scope.user = $rootScope.current_user
            })

            $scope.update_account = function() {
                console.log('updating information')
                console.log
                $scope.sending = true;
                delete $rootScope.current_user.errors
                User.update_account({}, {
                    user: $rootScope.current_user
                }, function() {
                    $scope.sending = false;
                    //console.log("signed up");
                    $state.go("home");
                }, function(response) {
                    $scope.sending = false;
                    $rootScope.current_user.errors = response.data.errors
                    //console.log("sign up failed")
                })
            }


            $scope.open = function () {
                var modalInstance = $modal.open({
                    templateUrl: '/views/users/confirm_delete.html',
                    controller: "ConfirmDeleteCtrl"
                })

                modalInstance.result.then(function (enrollment_key) {
                        $state.go("login");
                    },
                    function () {
 //                       $log.info('Modal dismissed at: ' + new Date());
                    })
            }
            
            $scope.$watch('current_lang', function(newval, oldval) {
                if (newval != oldval)
                    delete $scope.user.errors
            });

        }
    ]);