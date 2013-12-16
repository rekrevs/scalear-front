'use strict';

angular.module('scalearAngularApp')
  .controller('teacherCalendarCtrl', ['$scope','$state', '$stateParams','Course', '$log','$window', function ($scope, $state, $stateParams, Course, $log, $window) {
    $log.debug("in calendar ctrl")

	$window.scrollTo(0, 0);
    var change = function(){
    	if($scope.myCalendar){
    		angular.element($scope.myCalendar.children()).remove();
	    	var options =($scope.current_lang=="en")? full_calendar_en(): full_calendar_sv()
	    	options.eventSources = $scope.eventSources
			$scope.myCalendar.fullCalendar(options);
    	}    	
    }

	var init =function(){
		Course.getCalendarEvents(
			{course_id: $stateParams.course_id},
			function(data){
				$scope.calendar = data;
				$scope.uiConfig = {
					calendar:{
						editable: false,
						header:{
							right: 'today prev,next'
						},
						eventDrop: $scope.alertOnDrop,
						eventResize: $scope.alertOnResize
					}
				};
				for (var element in $scope.calendar.events){
					$scope.calendar.events[element].url=$state.href("course.progress.module", {course_id: $scope.calendar.events[element].courseId, module_id: $scope.calendar.events[element].groupId})
				}
				$scope.eventSources = [$scope.calendar]
			},
			function(){}
		)
	}

    $scope.$watch("current_lang", change);
    
	init()
	  


  }]);
