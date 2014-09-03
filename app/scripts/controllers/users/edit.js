'use strict';

angular.module('scalearAngularApp')
    .controller('UsersEditCtrl', ['$rootScope', '$scope', 'User', '$state','$modal','Page',function($rootScope, $scope, User, $state, $modal,Page) {
    
    Page.setTitle('navigation.edit_account')
    $rootScope.subheader_message = "Account Information"
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
        var modalInstance = $modal.open({
            templateUrl: '/views/users/confirm_delete.html',
            controller: "ConfirmDeleteCtrl",
        })
    }

    $scope.open_require_password = function () {
        var modalInstance = $modal.open({
            templateUrl: '/views/users/update_account_info.html',
            controller: ModalInstanceCtrl,
            resolve: {
                user: function () {
                  return $scope.user;
                }
            }
        })
    }
}]);

var ModalInstanceCtrl = function ($scope, $rootScope, $state, $modalInstance, user, User) {

  $scope.user = user;
  console.log(user);

    $scope.update_account = function() {
            // console.log($scope.user);
            $scope.sending = true;
            delete $scope.user.errors
            User.update_account({}, {
                user: $scope.user
            }, function() {
                $scope.sending = false;
                $scope.show_settings = false;
                console.log('mena')
                console.log($rootScope.current_user.info_complete)
                if($rootScope.current_user.intro_watched == false){
                    $state.go('confirmed')
                }
                $modalInstance.close();
            }, function(response) {
                $scope.sending = false;
                $scope.user.errors = response.data.errors
                if(!response.data.errors.current_password){
                    $modalInstance.close();
                }
            })
    }
  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
