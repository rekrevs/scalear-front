'use strict';

angular.module('scalearAngularApp')
  .controller('TeacherGettingStartedCtrl', ['$scope', '$location', '$anchorScroll','$rootScope','Page', 'scalear_api','$translate', function ($scope, $location, $anchorScroll, $rootScope,Page, scalear_api, $translate) {
   	Page.setTitle('help.getting_started')
  	$translate.instant('help.getting_started').then(function(translationId){ 
      $rootScope.subheader_message = translationId 
    }) 
    $scope.scalear_api = scalear_api
    $scope.scroll=function(location){
      $('body').scrollToThis(0, {offsetTop: 0, duration: 0});
      $('body').scrollToThis('#'+location, {offsetTop: 95, duration: 0});
    }
    
  }]);
