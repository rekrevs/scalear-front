'use strict';

angular.module('scalearAngularApp')
  .controller('studentCalendarCtrl', ['$scope','$state', '$stateParams', 'Course', '$window','Page', '$filter', function ($scope,$state, $stateParams, Course, $window,Page, $filter) {
     $window.scrollTo(0, 0);
     Page.setTitle('head.calendar');
    var change_lang = function(){
    	if($scope.eventSources){
	    	angular.element($scope.myCalendar.children()).remove();
	    	var obj=($scope.current_lang=="en")?full_calendar_en():full_calendar_sv();
	    	obj.eventSources=$scope.eventSources;
	    	$scope.myCalendar.fullCalendar(obj);   
    	}
    }

	var init=function(){
	    $scope.eventSources = [];
	    $scope.filtered_events = []
		Course.getCalendarEvents(
			{course_id: $stateParams.course_id},
			function(data){
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
				$scope.calendar = data;
				$scope.announcements= JSON.parse(data.announcements);
				data.events.forEach(function(event){
					if(event.firstItem){
						$scope.filtered_events.push(event)
					}
			  	})
			  	$scope.calendar.events = $scope.filtered_events
			   	for (var element in $scope.calendar.events){
			   		console.log(new Date($scope.calendar.events[element].start))
			   		$scope.calendar.events[element].start = new Date($scope.calendar.events[element].start)
			   		$scope.calendar.events[element].title +=  ' @'+$filter('date')($scope.calendar.events[element].start, 'h:mma')//' @'+util.hour12($scope.calendar.events[element].start.getHours())
			   		if($scope.calendar.events[element].quizId)
			   			$scope.calendar.events[element].url= $state.href("course.lectures.module.quiz",{course_id: $scope.calendar.events[element].courseId, module_id:$scope.calendar.events[element].groupId ,quiz_id:$scope.calendar.events[element].quizId})
			 		else if($scope.calendar.events[element].lectureId)
			        	$scope.calendar.events[element].url= $state.href("course.lectures.module.lecture",{course_id: $scope.calendar.events[element].courseId, module_id:$scope.calendar.events[element].groupId, lecture_id:$scope.calendar.events[element].lectureId})
					else{
						if(!$scope.calendar.events[element].firstItem)
							$scope.calendar.events[element].url= $state.href("course.lectures",{course_id: $scope.calendar.events[element].courseId})
						else{
							if($scope.calendar.events[element].firstItemType=="Lecture")
								$scope.calendar.events[element].url= $state.href("course.lectures.module.lecture",{course_id: $scope.calendar.events[element].courseId, module_id:$scope.calendar.events[element].groupId, lecture_id:$scope.calendar.events[element].firstItem.id})
							else
								$scope.calendar.events[element].url= $state.href("course.lectures.module.quiz",{course_id: $scope.calendar.events[element].courseId,module_id:$scope.calendar.events[element].groupId, quiz_id:$scope.calendar.events[element].firstItem.id})
						}
					}  
				}
				$scope.eventSources.push($scope.calendar); 
				console.log($scope.eventSources)
				$(window).resize()
			},
			function(){}
		)
	}
	
	$scope.$watch("current_lang", change_lang);
	init()
	  
  }]);
