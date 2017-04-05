'use strict';

angular.module('scalearAngularApp')
  .controller('LtiKeyGenerateCtrl', ['$scope', '$location', '$anchorScroll','$rootScope','Page', 'scalear_api','$translate','Lti', function ($scope, $location, $anchorScroll, $rootScope,Page, scalear_api, $translate, Lti) {
   	Page.setTitle('help.getting_started')
    $rootScope.subheader_message = $translate.instant('help.lti_help') 
    $scope.scalear_api = scalear_api


    Lti.getLtiCustomSharedKey(
    	{
    		type: 'user',
        })
      .$promise
      .then(function(data) {
      	console.log(data)
	    $scope.shared_key = data.shared_key
	    $scope.custom_key = data.custom_key
	    $scope.lti_url_xml = data.lti_url_xml
      })

    $scope.generateNewCustomKey = function() {
      Lti.generateNewCustomKey(
    	{type: 'user'})
      .$promise
      .then(function(data) {
	    $scope.custom_key = data.custom_key
      })
    }

    $scope.scroll=function(location){
      $('body').scrollToThis(0, {offsetTop: 0, duration: 0});
      $('body').scrollToThis('#'+location, {offsetTop: 95, duration: 0});
    }
    
  }]);
