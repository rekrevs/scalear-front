'use strict';

angular.module('scalearAngularApp')
  .controller('StudentCalendarCtrl', ['$scope','events','$state', function ($scope, events,$state) {
    
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

	
   	 for (var element in $scope.events.events){
   		if($scope.events.events[element].quizId!=null)
   			$scope.events.events[element].url= $state.href("course.lectures.quiz",{course_id: $scope.events.events[element].courseId, quiz_id:$scope.events.events[element].quizId})
 		else if($scope.events.events[element].lectureId!=null)
        	$scope.events.events[element].url= $state.href("course.lectures.lecture",{course_id: $scope.events.events[element].courseId, lecture_id:$scope.events.events[element].lectureId})
		else{
			if($scope.events.events[element].firstItemType==null)
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
