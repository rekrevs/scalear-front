'use strict';

angular.module('scalearAngularApp')
  .controller('studentLecturesCtrl', ['$scope','Course','$stateParams','$rootScope', '$log','$window','Page', function ($scope, Course, $stateParams, $rootScope, $log, $window,Page) {

	$window.scrollTo(0, 0);
	Page.setTitle('Lectures');
	
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
	    	 $scope.course.groups.forEach(function(module){
	    	 	var count = 0
	    	 	var items = module.quizzes.concat(module.lectures)
	    	 	items.forEach(function(item){
	    	 		if(item.is_done)
	    	 			count++
	    	 	})
    	 		module.is_done = (count == items.length) 
	    	 })
	    	});
	}
	
	init();
	
    $rootScope.$on("accordianReload", function(event, args) {
  		$log.debug("reloading accordian now..");
  		init();
  	});
    
    $scope.$on('accordianUpdate', function(event, message) {
		$log.debug("updating accordian now")
		$scope.open_id=message.g_id;
		$scope.open[message.g_id]= true;
		$scope.highlight_item=message.type;
		$scope.highlight_id=message.id;
	});
    
  }]);
