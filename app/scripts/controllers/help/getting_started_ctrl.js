'use strict';

angular.module('scalearAngularApp')
  .controller('GettingStartedCtrl', ['$scope', '$location', '$anchorScroll' ,function ($scope, $location, $anchorScroll) {
    $scope.scrollTo = function (id) {
    	$location.hash(id);
    	$anchorScroll();
    }
  }]);
