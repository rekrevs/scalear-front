'use strict';

angular.module('scalearAngularApp')
  .controller('ConfirmDeleteCtrl', ['$scope', '$modalInstance', 'User', '$log', '$window', '$rootScope', '$state', 'user_new','UserSession', function($scope, $modalInstance, User, $log, $window, $rootScope, $state, user_new, UserSession) {

    $window.scrollTo(0, 0);
    $scope.form = {}
    $scope.user = user_new
    $scope.deleteAccount = function() {
      if($scope.user.saml || $scope.form.key.$valid) {
        $scope.form.processing = true;
        UserSession.deleteUser($scope.user.pass)
          .then(function() {
            $scope.form.processing = false;
            $modalInstance.close();
            $state.go('login')
          })
          .catch(function(response) {
            $scope.form.processing = false;
            $scope.form.server_error = response.data.errors.join();
          })
      } else{
        $scope.form.submitted = true
      }
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

  }]);
