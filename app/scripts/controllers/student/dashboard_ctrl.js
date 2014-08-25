'use strict';

angular.module('scalearAngularApp')
        .controller('dashboardCtrl', ['$scope', '$state', '$stateParams', 'Dashboard', 'NewsFeed','$window', 'Page', '$filter', '$timeout', '$rootScope', function($scope, $state, $stateParams, Dashboard, NewsFeed, $window, Page, $filter, $timeout, $rootScope) {
                $window.scrollTo(0, 0);
                Page.setTitle('dashboard');
                $rootScope.subheader_message = "What's New"
                var change_lang = function() {
                    if ($scope.eventSources) {
                        if($scope.myCalendar){
                            angular.element($scope.myCalendar.children()).remove();
                            var obj = ($scope.current_lang == "en") ? full_calendar_en() : full_calendar_sv();
                            obj.eventSources = $scope.eventSources;
                            $scope.myCalendar.fullCalendar(obj);
                        }
                    }
                }

                $scope.toggleLargeCalendar=function(){
                    $scope.large_calendar=!$scope.large_calendar
                     $timeout(function() {
                        $(window).resize()
                    })
                }

                var cal_ics_obj;
                var init = function() {
                    $scope.eventSources = [];
                    $scope.filtered_events = []
                    Dashboard.getDashboard({},
                    function(data) {
                        console.log(data)
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
                        // var allAnnouncements = [];
                        // allAnnouncements = allAnnouncements.concat.apply(allAnnouncements, JSON.parse(data.announcements));
                        //$scope.announcements = JSON.parse(data.announcements);
                        //console.log($scope.announcements);

                        data.events.forEach(function(event) {
                            if (event.firstItem) {
                                $scope.filtered_events.push(event)
                            }
                        })
                        $scope.calendar.events = $scope.filtered_events;
                        cal_ics_obj = $scope.filtered_events;
                        if($rootScope.current_user.roles[0].id == 2){
                            for (var element in $scope.calendar.events) {
                            //console.log(new Date($scope.calendar.events[element].start))
                                $scope.calendar.events[element].start = new Date($scope.calendar.events[element].start)
                                $scope.calendar.events[element].title += ' @' + $filter('date')($scope.calendar.events[element].start, 'h:mma')//' @'+scalear_utils.hour12($scope.calendar.events[element].start.getHours())
                                var fullTitle = $scope.calendar.events[element].courseName.name +" : "+ $scope.calendar.events[element].title ;
                                $scope.calendar.events[element].title = fullTitle;
                                
                                if ($scope.calendar.events[element].quizId)
                                    $scope.calendar.events[element].url = $state.href("course.module.courseware.quiz", {course_id: $scope.calendar.events[element].courseId, module_id: $scope.calendar.events[element].groupId, quiz_id: $scope.calendar.events[element].quizId})
                                else if ($scope.calendar.events[element].lectureId)
                                    $scope.calendar.events[element].url = $state.href("course.module.courseware.lecture", {course_id: $scope.calendar.events[element].courseId, module_id: $scope.calendar.events[element].groupId, lecture_id: $scope.calendar.events[element].lectureId})
                                else {
                                    if (!$scope.calendar.events[element].firstItem)
                                        $scope.calendar.events[element].url = $state.href("course.courseware", {course_id: $scope.calendar.events[element].courseId})
                                    else {
                                        if ($scope.calendar.events[element].firstItemType == "Lecture")
                                            $scope.calendar.events[element].url = $state.href("course.module.courseware.lecture", {course_id: $scope.calendar.events[element].courseId, module_id: $scope.calendar.events[element].groupId, lecture_id: $scope.calendar.events[element].firstItem.id})
                                        else
                                            $scope.calendar.events[element].url = $state.href("course.module.courseware.quiz", {course_id: $scope.calendar.events[element].courseId, module_id: $scope.calendar.events[element].groupId, quiz_id: $scope.calendar.events[element].firstItem.id})
                                    }
                                }
                            }
                        }
                        else{
                            console.log('this is the teacher side')
                            console.log($scope.calendar.events)
                            for (var element in $scope.calendar.events) {
                            //console.log(new Date($scope.calendar.events[element].start))
                                $scope.calendar.events[element].start = new Date($scope.calendar.events[element].start)
                                $scope.calendar.events[element].title += ' @' + $filter('date')($scope.calendar.events[element].start, 'h:mma')//' @'+scalear_utils.hour12($scope.calendar.events[element].start.getHours())
                                var fullTitle = $scope.calendar.events[element].courseName.name +" : "+ $scope.calendar.events[element].title ;
                                $scope.calendar.events[element].title = fullTitle;
                                $scope.calendar.events[element].url=$state.href("course.progress.module", {course_id: $scope.calendar.events[element].courseId, module_id: $scope.calendar.events[element].groupId})
                            }

                        }
                        $scope.eventSources.push($scope.calendar);
                        console.log($scope.eventSources)
                        $timeout(function() {
                            $(window).resize()
                        },100)
                    })
                }

                var getFeed = function(){
                    NewsFeed.index({}, function(data){
                    console.log('here is the data')
                    console.log(data)
                    $scope.events = []
                    // $scope.latest_events = data.latest_events
                    $scope.latest_announcements = data.latest_announcements
                    // $scope.latest_events.forEach(function(event){
                    //   event.timestamp = event.appearance_time;
                    //   $scope.events.push(event);
                    // })
                    $scope.latest_announcements.forEach(function(announcement){
                      announcement.timestamp = announcement.updated_at;
                      $scope.events.push(announcement);
                    })
                    // $scope.coming_up = data.coming_up
                    console.log('got these')
                    console.log($scope.events)
                  }, function(){
                    console.log('Couldn\'t get the data');
                  })
                }

            $scope.cal_export = function() {
                var ics_file = "BEGIN:VCALENDAR\n";
                ics_file += "VERSION:2.0\n";

                console.log(cal_ics_obj);


                for (var element in cal_ics_obj) {
                    ics_file += "BEGIN:VEVENT\n";
                    ics_file += "CLASS:PUBLIC\n";

                    var fullTitle = cal_ics_obj[element].title ;
                    fullTitle = fullTitle.split('due')[0];
                    ics_file += "DESCRIPTION:"+"Scalable Learning => "+fullTitle+"\n";

                    var d = new Date(cal_ics_obj[element].start);
                    var str = $.datepicker.formatDate('yymmdd'+"T", d);
                    ics_file += "DTSTART:"+ str+"T"+"000000"+"\n";
                    
                    // ics_file += "Due:"+str+"000000\n"
                    
                    ics_file += "SUMMARY;LANGUAGE=en-us:"+fullTitle+"\n"
                    
                    ics_file += "TRANSP:TRANSPARENT\n"
                    ics_file += "END:VEVENT\n"
                }

                ics_file += "END:VCALENDAR";

                var win = window.open('', '_blank');
                //win.document.open();
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
                
                doc += "<script> fireEvent(document.getElementById('download'),'click')</script>";
                win.document.write(doc);
                win.document.close();
               $timeout(function(){
                 win.close();
             },100)
            }

                $scope.$watch("current_lang", change_lang);
                getFeed();
                init();
                // prepare_cal_export();

            }]);