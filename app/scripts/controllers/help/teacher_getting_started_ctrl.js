'use strict';

angular.module('scalearAngularApp')
  .controller('TeacherGettingStartedCtrl', ['$scope', '$location', '$anchorScroll','$rootScope','Page', 'scalear_api', function ($scope, $location, $anchorScroll, $rootScope,Page, scalear_api) {
   	Page.setTitle('help.getting_started')
  	$rootScope.subheader_message = "Getting Started"
    $scope.scalear_api = scalear_api
    $scope.scroll=function(location){
      $('body').scrollToThis(0, {offsetTop: 0, duration: 0});
      $('body').scrollToThis('#'+location, {offsetTop: 95, duration: 0});
    }
    
  }]);
