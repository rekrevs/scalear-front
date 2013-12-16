'use strict';

angular.module('scalearAngularApp')
  .controller('StudentCalendarCtrl', ['$scope','events','$state','$window', function ($scope, events,$state, $window) {
    $window.scrollTo(0, 0);
    var change_lang = function()
    {
    	angular.element($scope.myCalendar.children()).remove();
    	var obj=($scope.current_lang=="en")?full_calendar_en():full_calendar_sv();
    	obj.eventSources=$scope.eventSources;
    	$scope.myCalendar.fullCalendar(obj);
    	
    }
	$scope.$watch("current_lang", change_lang);
	
	$scope.uiConfig = {
	  calendar:{
	        editable: false,
	        header:{
	          right: 'today prev,next',
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
