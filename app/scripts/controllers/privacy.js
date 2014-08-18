'use strict';

angular.module('scalearAngularApp')
  .controller('PrivacyCtrl',['$scope','Page','$rootScope', function ($scope,Page,$rootScope) {
  	Page.setTitle('privacy.policy')
  	$rootScope.subheader_message = "ScalableLearning Privacy Policy"
  }]);
