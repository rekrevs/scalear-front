'use strict';

angular.module('scalearAngularApp')
  .controller('ThanksForRegisteringCtrl', ['$scope', 'Page','$state', function ($scope, Page, $state) {
  	Page.setTitle('Thanks for Registering')
  	$scope.show_for_student= $state.params.type
  }]);
