'use strict';

angular.module('scalearAngularApp')
    .controller('UsersEditCtrl', ['$rootScope', '$scope', 'User', '$state','$modal','Page',
        function($rootScope, $scope, User, $state, $modal,Page) {
            Page.setTitle('Edit Account')
            $scope.user = {};

            $scope.$watch('current_user', function(val) {
                if (val)
                    $scope.user = {
                        name: $rootScope.current_user.name,
                        email: $rootScope.current_user.email
                    }
            })

            $scope.update_account = function() {
                $scope.sending = true;
                delete $scope.user.errors
                User.update_account({}, {
                    user: $scope.user
                }, function() {
                    $scope.sending = false;
                    //console.log("signed up");
                    $state.go("home");
                }, function(response) {
                    $scope.sending = false;
                    $scope.user.errors = response.data.errors
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