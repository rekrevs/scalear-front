'use strict';

angular.module('scalearAngularApp')
  .controller('studentCalendarCtrl', ['$scope','$state', '$stateParams', 'Course', '$window','Page', function ($scope,$state, $stateParams, Course, $window,Page) {
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
				
			   	 for (var element in $scope.calendar.events){
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
				$(window).resize()
			},
			function(){}
		)
	}
	
	$scope.$watch("current_lang", change_lang);
	init()
	  
  }]);
