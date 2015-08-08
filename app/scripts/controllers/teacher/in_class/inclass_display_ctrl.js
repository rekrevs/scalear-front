'use strict';

angular.module('scalearAngularApp')
  .controller('inclassDisplayCtrl', ['$scope', '$window', function ($scope, $window) {
    
    $window.scrollTo(0, 0);
    $scope.$on('player ready',function(){
    	$scope.nextQuiz()
    })
}]);
