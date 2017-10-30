/* istanbul ignore next */
'use strict';

angular.module('scalearAngularApp')
    .controller('UsersPasswordEditCtrl', ['$scope', 'User', '$state', '$stateParams', '$rootScope', 'Page', 'Token', function ($scope, User, $state, $stateParams, $rootScope, Page, Token) {
        Page.setTitle('account.password.resetting')
        $scope.user = {
            "access-token": $stateParams.token,
            "client": $stateParams.client_id,
            "uid": $stateParams.uid,
        }
        $scope.change_password = function () {
            Token.setToken($scope.user)
            delete $scope.user.errors;
            User.change_password({}, $scope.user,
                function (resp) {
                    console.log("success");
                    $state.go("dashboard");
                },
                function (data) {
                    $scope.user.errors = data.data.errors;
                })
        }

        $scope.$watch('current_lang', function (newval, oldval) {
            if (newval != oldval)
                delete $scope.user.errors
        });
    }]);
