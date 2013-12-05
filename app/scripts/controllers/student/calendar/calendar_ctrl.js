'use strict';

angular.module('scalearAngularApp')
  .controller('StudentCalendarCtrl', ['$scope','events','$state', function ($scope, events,$state) {
    
    var change = function()
    {
    	console.log("in change");
    	console.log($scope.myCalendar);
    	//$scope.myCalendar2= angular.copy($scope.myCalendar);
    	angular.element($scope.myCalendar.children()).remove();
    	if($scope.current_lang=="en")
    		$scope.myCalendar.fullCalendar(full_calendar_en());
    	else
    		$scope.myCalendar.fullCalendar(full_calendar_sv());
    	
    }
	// var date = new Date();
	// var d = date.getDate();
	// var m = date.getMonth();
	// var y = date.getFullYear();
	$scope.$watch("current_lang", change);
	
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
	        eventResize: $scope.alertOnResize,
	    }
	  };
	console.log(events)
	$scope.events = events.data;
	$scope.announcements= JSON.parse(events.data.announcements);

	
   	 for (var element in $scope.events.events){
   		if($scope.events.events[element].quizId!=null)
   			$scope.events.events[element].url= $state.href("course.lectures.quiz",{course_id: $scope.events.events[element].courseId, quiz_id:$scope.events.events[element].quizId})
 		else if($scope.events.events[element].lectureId!=null)
        	$scope.events.events[element].url= $state.href("course.lectures.lecture",{course_id: $scope.events.events[element].courseId, lecture_id:$scope.events.events[element].lectureId})
		else{
			if($scope.events.events[element].firstItem==null)
				$scope.events.events[element].url= $state.href("course.lectures",{course_id: $scope.events.events[element].courseId})
			else{
				if($scope.events.events[element].firstItemType=="Lecture")
					$scope.events.events[element].url= $state.href("course.lectures.lecture",{course_id: $scope.events.events[element].courseId, lecture_id:$scope.events.events[element].firstItem.id})
				else
					$scope.events.events[element].url= $state.href("course.lectures.quiz",{course_id: $scope.events.events[element].courseId, quiz_id:$scope.events.events[element].firstItem.id})
				}
			}  
		}                                                                     
            
	  
console.log($scope.events)

	$scope.eventSources = [$scope.events];

	  
  }]);
