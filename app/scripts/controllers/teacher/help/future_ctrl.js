/* istanbul ignore next */ 
'use strict';

angular.module('scalearAngularApp')
  .controller('FutureCtrl', ['$scope', '$location', '$anchorScroll','$rootScope','Page', 'scalear_api','$translate', function ($scope, $location, $anchorScroll, $rootScope,Page, scalear_api, $translate) {
   	Page.setTitle('abc')
    $rootScope.subheader_message = $translate.instant('ScalableLearning Future') 
    $scope.scalear_api = scalear_api
    $scope.scroll=function(location){
      $('body').scrollToThis(0, {offsetTop: 0, duration: 0});
      $('body').scrollToThis('#'+location, {offsetTop: 95, duration: 0});
    }
    
  }]);
