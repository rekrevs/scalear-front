'use strict';

angular.module('scalearAngularApp')
  .controller('SaveAccountCtrl', ['$scope', '$modalInstance', 'User', '$log', '$window', '$state', 'user_new', 'ErrorHandler', '$translate', 'UserSession','day_options', function($scope, $modalInstance, User, $log, $window, $state, user_new, ErrorHandler, $translate, UserSession, day_options) {

    $window.scrollTo(0, 0);
    $scope.user = user_new
    $scope.dayNamesOption = day_options
    // UserSession.getCurrentUser()
    //   .then(function(user) {
    //     $scope.current_user = user
    //   })

    $scope.update_account = function() {
      $scope.sending = true;
      delete $scope.user.errors
      $scope.user.first_day = $scope.user.first_day.id
      User.update_account({},$scope.user, function(response) {
        $modalInstance.close();
        if($scope.user.intro_watched == false) {
          $state.go('confirmed')
        }
        else{
          UserSession.allowRefetchOfUser()
          // $state.go("home")
          // $scope.user.first_day = {}
          $scope.user.first_day = $scope.dayNamesOption[$scope.user.first_day]
      }
        // $scope.sending = false;
        // $scope.user.current_password = null;
        // if(response.password_confirmation) {
        //   ErrorHandler.showMessage($translate.instant("error_message.change_password_confirmation"), 'errorMessage', 4000, "success");
        // }
      }, function(response) {
        $scope.sending = false;
        $scope.user.errors = response.data.errors
        $scope.user.first_day = $scope.dayNamesOption[$scope.user.first_day]
        $scope.user.current_password = null;
        if(!response.data.errors.current_password) {
          $modalInstance.close();
        }
      })
    }

    $scope.cancel = function() {
      $scope.user.current_password = null;
      $modalInstance.dismiss('cancel');
    }
  }]);
