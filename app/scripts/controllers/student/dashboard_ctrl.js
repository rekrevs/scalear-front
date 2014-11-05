'use strict';

angular.module('scalearAngularApp')
.controller('dashboardCtrl', ['$scope', '$state', '$stateParams', 'Dashboard', 'NewsFeed','$window', 'Page', '$filter', '$timeout', '$rootScope', function($scope, $state, $stateParams, Dashboard, NewsFeed, $window, Page, $filter, $timeout, $rootScope) {
    $window.scrollTo(0, 0);
    Page.setTitle('dashboard');
    Page.startTour();
    $rootScope.subheader_message = "What's New"
    
    $scope.toggleLargeCalendar=function(){
        $scope.large_calendar=!$scope.large_calendar
        $timeout(function() {
            $(window).resize()
        })
    }

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
                    eventDrop: $scope.alertOnDrop,
                    eventResize: $scope.alertOnResize,
                }
            };
            $scope.calendar = data;
            for (var element in $scope.calendar.events) {
                $scope.calendar.events[element].start = new Date($scope.calendar.events[element].start)
                $scope.calendar.events[element].title = $scope.calendar.events[element].course_name +" : "+ $scope.calendar.events[element].title + ' @' + $filter('date')($scope.calendar.events[element].start, 'HH:mm');
               
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
            $scope.eventSources.push($scope.calendar);

            $timeout(function() {
                $(window).resize()
            },100)
        })
    }

    var getAnnouncements = function(){
        NewsFeed.index({}, function(data){
            $scope.events = []
            $scope.latest_announcements = data.latest_announcements
            $scope.latest_announcements.forEach(function(announcement){
                announcement.timestamp = announcement.updated_at;
                $scope.events.push(announcement);
            })
        }, function(){})
    }

    $scope.export_calendar = function() {
        var ics_file = "BEGIN:VCALENDAR\n";
        ics_file += "VERSION:2.0\n";
        for (var element in $scope.calendar.events) {
            ics_file += "BEGIN:VEVENT\n";
            ics_file += "CLASS:PUBLIC\n";
            var fullTitle = $scope.calendar.events[element].title ;
            fullTitle = fullTitle.split('due')[0];
            ics_file += "DESCRIPTION:"+"Scalable Learning => "+fullTitle+"\n";
            var d = new Date($scope.calendar.events[element].start);
            var str = $.datepicker.formatDate('yymmdd'+"T", d);
            ics_file += "DTSTART:"+ str+"T"+"000000"+"\n";
            ics_file += "SUMMARY;LANGUAGE=en-us:"+fullTitle+"\n"
            ics_file += "TRANSP:TRANSPARENT\n"
            ics_file += "END:VEVENT\n"
        }
        ics_file += "END:VCALENDAR";
        var win = window.open('', '_blank');
        if(win){ 
            win.focus();
        }
        else{
            //Broswer has blocked it
            alert('Please allow popups for Scalable Learning');
        }
        var doc = '<script>';
        doc +=  "function fireEvent(obj,evt){\n";
        doc +=  "var fireOnThis = obj;\n";
        doc +=  "if( document.createEvent ) {\n";
        doc +=  "var evObj = document.createEvent('MouseEvents');\n";
        doc +=  "evObj.initEvent( evt, true, false );\n";
        doc +=  "fireOnThis.dispatchEvent(evObj);\n";
        doc +=  "} else if( document.createEventObject ) {\n";
        doc +=  "fireOnThis.fireEvent('on'+evt);\n";
        doc +=  "}\n}";
        doc += '</script>'
        doc +=('<a id="download" href='+"'"+'data:Application/ics,'+encodeURIComponent(ics_file)+"'"+ 'Download = "calendar.ics">download</a>');
        doc += "<script> fireEvent(document.getElementBy_id('download'),'click')</script>";
        win.document.write(doc);
        win.document.close();
        $timeout(function(){
            win.close();
        },100)
    }

    getAnnouncements();
    getCalendar();


}]);