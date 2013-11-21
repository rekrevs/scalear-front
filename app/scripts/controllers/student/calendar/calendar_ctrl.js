'use strict';

angular.module('scalearAngularApp')
  .controller('StudentCalendarCtrl', ['$scope','events', function ($scope, events) {
    
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
	$scope.uiConfig = {
	  calendar:{
	        editable: false,
	        header:{
	          right: 'today prev,next',
	          // center: 'title',
	          // left: 'month, agendaWeek'
	          left: 'title'
	        },
	        eventDrop: $scope.alertOnDrop,
	        eventResize: $scope.alertOnResize
	    }
	  };
	console.log(events)
	$scope.events = events.data;
	$scope.announcements= JSON.parse(events.data.announcements);

	$scope.eventSources = [$scope.events];

	  
  }]);
