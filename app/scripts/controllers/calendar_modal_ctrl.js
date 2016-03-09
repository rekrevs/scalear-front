'use strict';

angular.module('scalearAngularApp')
  .controller('CalendarModalCtrl',['$state','$stateParams','$scope','$modalInstance','Course','$window','$rootScope','$timeout', '$filter', '$compile', function ($state,$stateParams ,$scope, $modalInstance, Course, $window, $rootScope, $timeout, $filter, $compile) {


  	$scope.eventRender = function( event, element ) { 
         var tooltip_string = event.course_short_name+": "+event.item_title+"<br />Due at  "+$filter('date')(event.start, 'HH:mm')
        if(event.status==1)
            tooltip_string+="<br />Completed on time"
        else if(event.status==2)
            tooltip_string+="<br />Completed "+event.days+" days late"

        element.attr({'tooltip-html-unsafe': tooltip_string,'tooltip-append-to-body': true});
        $compile(element)($scope);
    };

    var init=function(){
        $scope.eventSources = [];
        $scope.filtered_events = []
        Course.getCalendarEvents(
            {course_id: $stateParams.course_id},
            function(data){
                $scope.uiConfig = {
	                calendar: {
	                    editable: false,
	                    header: {
	                        right: 'today prev,next',
	                        left: 'title'
	                    },
	                    eventRender: $scope.eventRender
	                }
	            };
                $scope.calendar = data;
                for (var element in $scope.calendar.events){
                    $scope.calendar.events[element].start = new Date($scope.calendar.events[element].start)
                    $scope.calendar.events[element].item_title = $scope.calendar.events[element].title.replace(" due", "");
					$scope.calendar.events[element].title =  $scope.calendar.events[element].course_short_name +": "+ $scope.calendar.events[element].item_title
                    if($rootScope.current_user.roles[0].id == 2){
	                    if ($scope.calendar.events[element].quiz_id)
	                        $scope.calendar.events[element].url = $state.href("course.module.courseware.quiz", {course_id: $scope.calendar.events[element].course_id, module_id: $scope.calendar.events[element].group_id, quiz_id: $scope.calendar.events[element].quiz_id})
	                    else if ($scope.calendar.events[element].lecture_id)
	                        $scope.calendar.events[element].url = $state.href("course.module.courseware.lecture", {course_id: $scope.calendar.events[element].course_id, module_id: $scope.calendar.events[element].group_id, lecture_id: $scope.calendar.events[element].lecture_id})
	                    else
	                        $scope.calendar.events[element].url = $state.href("course.module.courseware", {course_id: $scope.calendar.events[element].course_id, module_id: $scope.calendar.events[element].group_id})
	                }
	                else
	                    $scope.calendar.events[element].url=$state.href("course.module.progress", {course_id: $scope.calendar.events[element].course_id, module_id: $scope.calendar.events[element].group_id}) 
                }
                $scope.calendar.className = ["truncate"]
                $scope.eventSources.push($scope.calendar); 
                $timeout(function(){$(window).resize()})
            },
            function(){}
        )
    }

    init()

  }])
