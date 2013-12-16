'use strict';

angular.module('scalearAngularApp')
  .controller('studentLecturesCtrl', ['$scope','Course','$stateParams','$rootScope','$window', function ($scope, Course, $stateParams, $rootScope, $window) {
	$window.scrollTo(0, 0);
    var init = function()
    {
    	$scope.open_id="-1";
		$scope.open={};
		$scope.oneAtATime = true;
	
	    Course.getCourseware(
	    	{course_id: $stateParams.course_id}, function(data){
	    	 $scope.course= JSON.parse(data.course);
	    	 $scope.today = data.today;	
	    	 console.log($scope.course);
	    	});
	}
	
	init();
	
    $rootScope.$on("accordianReload", function(event, args) {
  		console.log("reloading accordian now..");
  		init();
  	});
    
    $scope.$on('accordianUpdate', function(event, message) {
		console.log("updating accordian now")
		$scope.open_id=message["g_id"];
		$scope.open[message.g_id]= true;
		$scope.highlight_item=message.type;
		$scope.highlight_id=message.id;
	});
    
  }]);
