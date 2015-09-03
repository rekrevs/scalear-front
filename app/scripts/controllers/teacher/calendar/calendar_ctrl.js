'use strict';

angular.module('scalearAngularApp')
  .controller('teacherCalendarCtrl', ['$scope','$state', '$stateParams','Course', '$log','$window','Page','scalear_utils', function ($scope, $state, $stateParams, Course, $log, $window,Page, scalear_utils) {
    $log.debug("in calendar ctrl")

	$window.scrollTo(0, 0);
	Page.setTitle('navigation.calendar')
    var change_lang = function(){
    	if($scope.eventSources){
    		angular.element($scope.myCalendar.children()).remove();
	    	var options =($scope.current_lang=="en")? full_calendar_en: full_calendar_sv
	    	options.eventSources = $scope.eventSources
			$scope.myCalendar.fullCalendar(options);
    	}    	
    }

	var init =function(){
		$scope.eventSources = [];
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
					$scope.calendar.events[element].start = new Date($scope.calendar.events[element].start)
			   		$scope.calendar.events[element].title +=  ' @'+scalear_utils.hour12($scope.calendar.events[element].start.getHours())
					$scope.calendar.events[element].url=$state.href("course.progress.module", {course_id: $scope.calendar.events[element].courseId, module_id: $scope.calendar.events[element].groupId})
				}
				$scope.eventSources.push($scope.calendar)
			},
			function(){}
		)
	}

    $scope.$watch("current_lang", change_lang);
    
	init()
	  


  }]);
