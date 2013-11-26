'use strict';

angular.module('scalearAngularApp')
  .controller('inclassModuleCtrl', ['$scope','$modal','$window',function ($scope, $modal, $window) {

  	$scope.open = function () {
  		angular.element("body").css("overflow","hidden");
  		var win = angular.element($window)
  		win.scrollTop("0px")
  		var modalInstance = $modal.open({
  			templateUrl: 'views/teacher/in_class/display_quizzes.html',
  			windowClass: 'whiteboard',
  			controller: 'displayQuizzesCtrl'
  		});
  	};
  }]);
