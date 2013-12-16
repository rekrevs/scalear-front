'use strict';

angular.module('scalearAngularApp')
  .controller('studentLecturesCtrl', ['$scope','Course','$stateParams','$rootScope', '$log', function ($scope, Course, $stateParams, $rootScope, $log) {

    var init = function()
    {
    	$scope.open_id="-1";
		$scope.open={};
		$scope.oneAtATime = true;
	
	    Course.getCourseware(
	    	{course_id: $stateParams.course_id}, function(data){
	    	 $scope.course= JSON.parse(data.course);
	    	 $scope.today = data.today;	
	    	 $log.debug($scope.course);
	    	});
	}
	
	init();
	
    $rootScope.$on("accordianReload", function(event, args) {
  		$log.debug("reloading accordian now..");
  		init();
  	});
    
    $scope.$on('accordianUpdate', function(event, message) {
		$log.debug("updating accordian now")
		$scope.open_id=message["g_id"];
		$scope.open[message.g_id]= true;
		$scope.highlight_item=message.type;
		$scope.highlight_id=message.id;
	});
    
  }]);
