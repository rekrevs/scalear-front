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
	    $scope.shared_sceret = data.shared_sceret
	    $scope.consumer_key = data.consumer_key
	    $scope.lti_url_xml = data.lti_url_xml
      })

    $scope.generateNewLtiKeys = function() {
      Lti.generateNewLtiKeys({
      	type: 'user'
      })
      .$promise
      .then(function(data) {
	    $scope.consumer_key = data.consumer_key
	    $scope.shared_sceret = data.shared_sceret
      })
    }

    $scope.scroll=function(location){
      $('body').scrollToThis(0, {offsetTop: 0, duration: 0});
      $('body').scrollToThis('#'+location, {offsetTop: 95, duration: 0});
    }
    
  }]);
