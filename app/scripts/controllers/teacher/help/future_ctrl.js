/* istanbul ignore next */ 
'use strict';

angular.module('scalearAngularApp')
  .controller('FutureCtrl', ['$scope', '$location', '$anchorScroll','$rootScope','Page', 'scalear_api','$translate', function ($scope, $location, $anchorScroll, $rootScope,Page, scalear_api, $translate) {
    $rootScope.subheader_message = $translate.instant('ScalableLearning Future') 
  }]);
