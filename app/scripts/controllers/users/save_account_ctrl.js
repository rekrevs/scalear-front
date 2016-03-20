'use strict';

angular.module('scalearAngularApp')
  .controller('SaveAccountCtrl',['$scope','$modalInstance','User','$log','$window','$rootScope','$state', 'user_new', function ($scope, $modalInstance, User, $log, $window,$rootScope, $state, user_new) {

    $window.scrollTo(0, 0);
    $scope.user = user_new
    $scope.update_account = function(){
        $log.debug($scope.user);
        $scope.sending = true;
        delete $scope.user.errors
        User.update_account({}, {
            user: $scope.user
        }, function() {
            $scope.sending = false;
            $rootScope.show_alert = "";
            if($rootScope.current_user.intro_watched == false){
                $state.go('confirmed')
            }
            $scope.user.current_password = null;
            $modalInstance.close();
        }, function(response) {
            $scope.sending = false;
            $scope.user.errors = response.data.errors
            $scope.user.current_password = null;
            if(!response.data.errors.current_password){
                $modalInstance.close();
            }
        })
    }

    $scope.cancel = function(){
        $scope.user.current_password = null;
        $modalInstance.dismiss('cancel');
    }
}]);