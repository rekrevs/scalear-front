/* istanbul ignore next */
'use strict';

angular.module('scalearAngularApp')
    .controller('UsersPasswordEditCtrl', ['$scope', 'User', '$state', '$stateParams', '$rootScope', 'Page', 'Token', function ($scope, User, $state, $stateParams, $rootScope, Page, Token) {
        Page.setTitle('account.password.resetting')
        $scope.user = {}

        $scope.user["access-token"] = $stateParams.token;
        $scope.user["uid"] = $stateParams.uid;
        $scope.user["client"] = $stateParams.client_id;
        
        $scope.change_password = function () {
            console.log($scope.user)
            console.log($stateParams)
            console.log($stateParams.client_id)
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
