'use strict';

angular.module('scalearAngularApp')
  .controller('ForgotPasswordConfirmationCtrl', ['$scope', 'Page','$state', function ($scope, Page, $state) {
  	Page.setTitle('Reset Password')
  	$scope.user_email = $state.params.email
  }]);
