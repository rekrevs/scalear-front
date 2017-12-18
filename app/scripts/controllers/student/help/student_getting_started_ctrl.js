/* istanbul ignore next */ 
'use strict';

angular.module('scalearAngularApp')
  .controller('StudentGettingStartedCtrl', ['$scope', '$location', '$anchorScroll','$rootScope','Page','scalear_api','$translate', function ($scope, $location, $anchorScroll, $rootScope,Page, scalear_api, $translate) {
   	Page.setTitle('help.getting_started')
  	$rootScope.subheader_message = $translate.instant('help.getting_started')
  	$scope.intro_url = scalear_api.student_welcom_video
    $scope.scroll=function(location){
      $('body').scrollToThis(0, {offsetTop: 0, duration: 0});
      $('body').scrollToThis('#'+location, {offsetTop: 95, duration: 0});
    }
  }]);
