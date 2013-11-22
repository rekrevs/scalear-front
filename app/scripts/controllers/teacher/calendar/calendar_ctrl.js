'use strict';

angular.module('scalearAngularApp')
  .controller('TeacherCalendarCtrl', ['$scope','events','$state', function ($scope, events, $state) {
    console.log("in calendar ctrl")
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
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

	  


  }]);
