'use strict';

angular.module('scalearAngularApp')
  .controller('PrivacyCtrl',['$scope','Page','$rootScope','$translate', function ($scope,Page,$rootScope,$translate) {
  	Page.setTitle('privacy.policy')
  	$rootScope.subheader_message = "ScalableLearning "+$translate("privacy.policy")
  }]);
