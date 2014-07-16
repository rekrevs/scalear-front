'use strict';

angular.module('scalearAngularApp')
    .controller('studentCourseInformationCtrl', ['$scope', '$stateParams', 'Course', '$window','Page', '$filter', '$state', '$timeout',
        function($scope, $stateParams, Course, $window, Page, $filter, $state, $timeout) {

            Page.setTitle('head.information');
            $window.scrollTo(0, 0);
            $scope.init = function(){
                Course.show({
                    course_id: $stateParams.course_id
                    },
                    function(data) {
                        $scope.course = data.course;
                        $scope.teachers = data.teachers;
                        $scope.short_url = $scope.shorten($scope.course.discussion_link, 20)
                    },
                    function() {}
                )
            }

            $scope.goToContent=function(){
                var params = {'module_id': $scope.last_viewed.module}    
                params[$scope.last_viewed.item.class_name+'_id'] = $scope.last_viewed.item.id
                $state.go('course.module.courseware.'+$scope.last_viewed.item.class_name, params)
            }

            $scope.url_with_protocol = function(url) {
                if (url)
                    return url.match(/^http/) ? url : 'http://' + url;
                else
                    return url;
            }
            $scope.shorten = function(url, l){
                var l = typeof(l) != "undefined" ? l : 50;
                var chunk_l = (l/2);
                var url = url.replace("http://","").replace("https://","");

                if(url.length <= l){ return url; }

                var start_chunk = shortString(url, chunk_l, false);
                var end_chunk = shortString(url, chunk_l, true);
                return start_chunk + ".." + end_chunk;
            }
            var shortString = function(s, l, reverse){
                var stop_chars = [' ','/', '&'];
                var acceptable_shortness = l * 0.80; // When to start looking for stop characters
                var reverse = typeof(reverse) != "undefined" ? reverse : false;
                var s = reverse ? s.split("").reverse().join("") : s;
                var short_s = "";

                for(var i=0; i < l-1; i++){
                    short_s += s[i];
                    if(i >= acceptable_shortness && stop_chars.indexOf(s[i]) >= 0){
                        break;
                    }
                }
                if(reverse){ return short_s.split("").reverse().join(""); }
                return short_s;
            }
            $scope.init_calendar_announcements=function(){
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
                                $scope.calendar.events[element].url= $state.href("course.module.courseware.quiz",{course_id: $scope.calendar.events[element].courseId, module_id:$scope.calendar.events[element].groupId ,quiz_id:$scope.calendar.events[element].quizId})
                            else if($scope.calendar.events[element].lectureId)
                                $scope.calendar.events[element].url= $state.href("course.module.courseware.lecture",{course_id: $scope.calendar.events[element].courseId, module_id:$scope.calendar.events[element].groupId, lecture_id:$scope.calendar.events[element].lectureId})
                            else{
                                if(!$scope.calendar.events[element].firstItem)
                                    $scope.calendar.events[element].url= $state.href("course.courseware",{course_id: $scope.calendar.events[element].courseId})
                                else{
                                    if($scope.calendar.events[element].firstItemType=="Lecture")
                                        $scope.calendar.events[element].url= $state.href("course.module.courseware.lecture",{course_id: $scope.calendar.events[element].courseId, module_id:$scope.calendar.events[element].groupId, lecture_id:$scope.calendar.events[element].firstItem.id})
                                    else
                                        $scope.calendar.events[element].url= $state.href("course.module.courseware.quiz",{course_id: $scope.calendar.events[element].courseId,module_id:$scope.calendar.events[element].groupId, quiz_id:$scope.calendar.events[element].firstItem.id})
                                }
                            }  
                        }
                        $scope.eventSources.push($scope.calendar); 
                        console.log($scope.eventSources)
                        $timeout(function(){$(window).resize()})
                    },
                    function(){}
                )
            }

            $scope.init();
            $scope.init_calendar_announcements();

        }
    ]);