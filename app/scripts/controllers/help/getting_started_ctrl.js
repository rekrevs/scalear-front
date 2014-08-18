'use strict';

angular.module('scalearAngularApp')
  .controller('GettingStartedCtrl', ['$scope', '$location', '$anchorScroll','$rootScope','Page', function ($scope, $location, $anchorScroll, $rootScope,Page) {
   
   	Page.setTitle('help.getting_started')
  	$rootScope.subheader_message = "Getting Started"
    $scope.scrollTo = function (id) {
    	$location.hash(id);
    	$anchorScroll();
    }
  }]);
