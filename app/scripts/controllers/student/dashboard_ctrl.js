'use strict';

angular.module('scalearAngularApp')
.controller('dashboardCtrl', ['$scope', '$state', '$stateParams', 'Dashboard', 'NewsFeed', 'Page', '$timeout', '$rootScope','$compile','$translate','$filter','$location', function($scope, $state, $stateParams, Dashboard, NewsFeed, Page, $timeout, $rootScope, $compile, $translate, $filter, $location) {

    Page.setTitle('navigation.dashboard');
    Page.startTour();
    $rootScope.subheader_message = $translate("dashboard.whats_new")
    
    $scope.toggleLargeCalendar=function(){
        $scope.large_calendar=!$scope.large_calendar
        $timeout(function() {
            resizeCalendar()
        })
    }
    var changeLang = function() {
        if ($scope.eventSources && $scope.myCalendar) {
            angular.element($scope.myCalendar.children()).remove();
            var obj = ($scope.current_lang == "en") ? full_calendar_en : full_calendar_sv;
            obj.eventSources = $scope.eventSources;
            $scope.myCalendar.fullCalendar(obj);
        }
    }

    var resizeCalendar=function(){
        angular.element('#studentCalendar').fullCalendar('render');
    }

    $scope.eventRender = function(event, element){ 
        element.attr({'tooltip-html-unsafe': event.tooltip_string,'tooltip-append-to-body': true});
        $compile(element)($scope);
    };


    var getCalendar = function() {
        $scope.eventSources = [];
        $scope.filtered_events = []

        Dashboard.getDashboard({},function(data) {
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
            for (var element in $scope.calendar.events) {
                $scope.calendar.events[element].start = new Date($scope.calendar.events[element].start)
                // $scope.calendar.events[element].title = $scope.calendar.events[element].course_short_name +" : "+ $scope.calendar.events[element].title + ' @' + $filter('date')($scope.calendar.events[element].start, 'HH:mm');
                $scope.calendar.events[element].item_title = $scope.calendar.events[element].title.replace(" due", "");
                // $filter('date')($scope.calendar.events[element].start, 'HH:mm')+'-'+
                $scope.calendar.events[element].title =  $scope.calendar.events[element].course_short_name +": "+ $scope.calendar.events[element].item_title
                $scope.calendar.events[element].tooltip_string = $scope.calendar.events[element].title+"<br />"+$translate('events.due')+" "+$translate('global.at')+" "+$filter('date')($scope.calendar.events[element].start, 'HH:mm')
                if($scope.calendar.events[element].status==1)
                    $scope.calendar.events[element].tooltip_string+="<br />"+$translate("events.completed_on_time")
                else if($scope.calendar.events[element].status==2)
                    $scope.calendar.events[element].tooltip_string+="<br />"+$translate("events.completed")+" "+$scope.calendar.events[element].days+" "+$translate("time.days")+" "+$translate("events.late")
                if($rootScope.current_user.roles[0].id == 2){
                    if ($scope.calendar.events[element].quiz_id)
                        $scope.calendar.events[element].url = $state.href("course.module.courseware.quiz", {course_id: $scope.calendar.events[element].course_id, module_id: $scope.calendar.events[element].group_id, quiz_id: $scope.calendar.events[element].quiz_id},{absolute:true})
                    else if ($scope.calendar.events[element].lecture_id)
                        $scope.calendar.events[element].url = $state.href("course.module.courseware.lecture", {course_id: $scope.calendar.events[element].course_id, module_id: $scope.calendar.events[element].group_id, lecture_id: $scope.calendar.events[element].lecture_id},{absolute:true})
                    else
                        $scope.calendar.events[element].url = $state.href("course.module.courseware", {course_id: $scope.calendar.events[element].course_id, module_id: $scope.calendar.events[element].group_id},{absolute:true})
                }
                else
                    $scope.calendar.events[element].url=$state.href("course.module.progress", {course_id: $scope.calendar.events[element].course_id, module_id: $scope.calendar.events[element].group_id},{absolute:true})
                
            }
            $scope.calendar.className = ["truncate"]

            $scope.eventSources.push($scope.calendar);
            $timeout(function() {
                changeLang()
                resizeCalendar()
            },300)
        })
    }

    
    var getAnnouncements = function(){
        NewsFeed.index({}, function(data){
            $scope.events = []
            $scope.latest_announcements = data.latest_announcements
            $scope.latest_announcements.forEach(function(announcement){
                announcement.timestamp = announcement.updated_at;
                $scope.events.push(announcement);
                $timeout(function() {
                    resizeCalendar()
                },300)
            })
        }, function(){})
    }

    $scope.export_calendar = function() {
        var cal = ics();
        for (var element in $scope.calendar.events){
            var description= $scope.calendar.events[element].tooltip_string.replace("<br />", " ")+" "+$scope.calendar.events[element].url;
            cal.addEvent($scope.calendar.events[element].title, description, 'Scalable-Learning', $scope.calendar.events[element].start, $scope.calendar.events[element].start);
        }            
        cal.download("calendar");
    }

    getAnnouncements();
    getCalendar();


}]);