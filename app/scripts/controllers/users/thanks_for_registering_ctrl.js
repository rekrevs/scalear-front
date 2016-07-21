'use strict';

angular.module('scalearAngularApp')
  .controller('ThanksForRegisteringCtrl', ['$scope', 'Page','$state', function ($scope, Page, $state) {
  	Page.setTitle('Thanks for Registering')
  	$scope.user_email = $state.params.email
  }]);
