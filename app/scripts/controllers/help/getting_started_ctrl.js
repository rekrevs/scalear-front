'use strict';

angular.module('scalearAngularApp')
  .controller('GettingStartedCtrl', ['$scope', '$location', '$anchorScroll' ,function ($scope, $location, $anchorScroll) {
    $scope.scrollTo = function (id) {
    	console.log('came here')
    	$location.hash(id);
    	$anchorScroll();
    }
  }]);
