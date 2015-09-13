'use strict';

angular.module('scalearAngularApp')
    .controller('UsersEditCtrl', ['$rootScope', '$scope', 'User', '$state','$modal','Page','$translate',function($rootScope, $scope, User, $state, $modal,Page, $translate) {
    
    Page.setTitle('navigation.account_information')
    $rootScope.subheader_message = $translate('navigation.account_information')
    $scope.user = {}
    $rootScope.$watch('current_user', function(val) {
        if (val)
            $scope.user = {
                screen_name: $rootScope.current_user.screen_name,
                name: $rootScope.current_user.name,
                last_name: $rootScope.current_user.last_name,
                university: $rootScope.current_user.university,
                email: $rootScope.current_user.email,
                link: $rootScope.current_user.link,
                bio: $rootScope.current_user.bio
            }
    })

    $rootScope.$watch('current_lang', function(newval, oldval) {
        if (newval != oldval)
            delete $scope.user.errors
    });

    $scope.open = function () {
        $modal.open({
            templateUrl: '/views/users/confirm_delete.html',
            controller: "ConfirmDeleteCtrl"
        })
    }

    $scope.open_require_password = function () {
        $modal.open({
            templateUrl: '/views/users/update_account_info.html',
            controller: 'SaveAccountCtrl',
            resolve: {
                user_new: function () {
                  return $scope.user;
                }
            }
        })
    }
}]);
