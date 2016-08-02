'use strict';

angular.module('scalearAngularApp')
  .controller('SaveAccountCtrl',['$scope','$modalInstance','User','$log','$window','$rootScope','$state', 'user_new','ErrorHandler',"$translate", "$interval",function ($scope, $modalInstance, User, $log, $window,$rootScope, $state, user_new,ErrorHandler,$translate,$interval) {

    $window.scrollTo(0, 0);
    $scope.user = user_new
    $scope.update_account = function(){
        $log.debug($scope.user);
        $scope.sending = true;
        delete $scope.user.errors
        $scope.user.first_day = $scope.user.first_day.id
        User.update_account({}, {
            user: $scope.user
        }, function(response) {
            $scope.sending = false;
            if($rootScope.current_user.intro_watched == false){
                $state.go('confirmed')
            }
            $scope.user.current_password = null;
            $modalInstance.close();
            if (response.password_confrimation){
                ErrorHandler.showMessage($translate("error_message.change_password_confirmation"), 'errorMessage', 4000, "success");
            }

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
