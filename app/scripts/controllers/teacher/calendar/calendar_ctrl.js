'use strict';

angular.module('scalearAngularApp')
  .controller('TeacherCalendarCtrl', ['$scope','events','$state','$window', function ($scope, events, $state, $window) {
    console.log("in calendar ctrl")
    $window.scrollTo(0, 0);

    var change = function(){
    	angular.element($scope.myCalendar.children()).remove();
    	var options =($scope.current_lang=="en")? full_calendar_en(): full_calendar_sv()
    	options.eventSources = $scope.eventSources
		$scope.myCalendar.fullCalendar(options);
    }

	var init =function(){
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

		console.log(events)

		$scope.events = events.data;
		for (var element in $scope.events.events){
			$scope.events.events[element].url=$state.href("course.progress.module", {course_id: $scope.events.events[element].courseId, module_id: $scope.events.events[element].groupId})
		}

		$scope.eventSources = [$scope.events];
	}

    $scope.$watch("current_lang", change);
    
	init()
	  


  }]);
