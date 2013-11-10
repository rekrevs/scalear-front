'use strict';

angular.module('scalearAngularApp')
  .controller('TeacherCalendarCtrl', ['$scope','events', function ($scope, events) {
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

   $scope.eventSources = [$scope.events];

	  


  }]);
