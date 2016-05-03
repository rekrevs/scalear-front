'use strict';

angular.module('scalearAngularApp')
  .controller('SaveAccountCtrl',['$scope','$modalInstance','User','$log','$window','$rootScope','$state', 'user_new','ErrorHandler',"$translate", "$interval",function ($scope, $modalInstance, User, $log, $window,$rootScope, $state, user_new,ErrorHandler,$translate,$interval) {

    $window.scrollTo(0, 0);
    $scope.user = user_new
    $scope.update_account = function(){
        $log.debug($scope.user);
        $scope.sending = true;
        delete $scope.user.errors
        User.update_account({}, {
            user: $scope.user
        }, function(response) {
            $scope.sending = false;
            $rootScope.show_alert = "";
            if($rootScope.current_user.intro_watched == false){
                $state.go('confirmed')
            }
            $scope.user.current_password = null;
            $modalInstance.close();
            if (response.password_confrimation){
                $rootScope.show_alert = "success";
                ErrorHandler.showMessage($translate("error_message.change_password_confirmation"), 'errorMessage', 2000);
                $interval(function() {
                      $rootScope.show_alert = "";
                }, 4000, 1);                    
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