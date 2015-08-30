'use strict';

angular.module('scalearAngularApp')
.controller('dashboardCtrl', ['$scope', '$state', '$stateParams', 'Dashboard', 'NewsFeed', 'Page', '$timeout', '$rootScope','$compile','$translate','$filter', function($scope, $state, $stateParams, Dashboard, NewsFeed, Page, $timeout, $rootScope, $compile, $translate, $filter) {

    Page.setTitle('dashboard');
    Page.startTour();
    $rootScope.subheader_message = $translate("whats_new")
    
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

    $scope.eventRender = function( event, element ) { 
         var tooltip_string = event.course_short_name+": "+event.item_title+"<br />"+$translate('controller_msg.due')+" "+$translate('at')+" "+$filter('date')(event.start, 'HH:mm')
        if(event.status==1)
            tooltip_string+="<br />"+$translate("courses.completed_on_time")
        else if(event.status==2)
            tooltip_string+="<br />"+$translate("courses.completed")+" "+event.days+" "+$translate("controller_msg.days")+" "+$translate("controller_msg.late")

        element.attr({'tooltip-html-unsafe': tooltip_string,'tooltip-append-to-body': true});
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
        doc +=('<a id="download" style="display:none" href='+"'"+'data:Application/ics,'+encodeURIComponent(ics_file)+"'"+ 'Download = "calendar.ics">download</a>');
        doc += "<script> fireEvent(document.getElementById('download'),'click')</script>";
        win.document.write(doc);
        win.document.close();
        $timeout(function(){
            win.close();
        },100)
    }

    getAnnouncements();
    getCalendar();


}]);