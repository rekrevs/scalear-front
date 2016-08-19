'use strict';

angular.module('scalearAngularApp')
  .controller('UsersPasswordNewCtrl', ['$scope', 'User', '$state', 'Page','ngDialog', function($scope, User, $state, Page, ngDialog) {
    Page.setTitle('account.password.new_password')
    $scope.user = {}
    $scope.reset_password = function() {
      $scope.sending = true
      delete $scope.user.errors;
      User.reset_password({}, { user: $scope.user }, function() {
        $scope.sending = false;
        $state.go('forgot_password_confirmation',{email : $scope.user.email});
      }, function(response) {
        $scope.sending = false;
        if (response.data.saml) {
          ngDialog.open({
            template: 'passwordDialog',
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            showClose: false,
            preCloseCallback: function(value) {
              $state.go("login");
            }
          });
        } else
          $scope.user.errors = response.data.errors;
      })
    }
    $scope.$watch('current_lang', function(newval, oldval) {
      if (newval != oldval)
        delete $scope.user.errors
    });
  }]);
