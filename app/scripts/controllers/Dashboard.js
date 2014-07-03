'use strict';

angular.module('scalearAngularApp')
        .controller('DashboardCtrl', ['$scope', '$state', '$stateParams', 'Dashboard', 'NewsFeed','$window', 'Page', '$filter', '$timeout', function($scope, $state, $stateParams, Dashboard, NewsFeed, $window, Page, $filter, $timeout) {
                $window.scrollTo(0, 0);
                Page.setTitle('head.calendar');
                var change_lang = function() {
                    if ($scope.eventSources) {
                        angular.element($scope.myCalendar.children()).remove();
                        var obj = ($scope.current_lang == "en") ? full_calendar_en() : full_calendar_sv();
                        obj.eventSources = $scope.eventSources;
                        $scope.myCalendar.fullCalendar(obj);
                    }
                }

                var init = function() {
                    $scope.eventSources = [];
                    $scope.filtered_events = []
                    Dashboard.getDashboard({},
                    function(data) {
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
                        $scope.calendar.events = $scope.filtered_events
                        for (var element in $scope.calendar.events) {
                            //console.log(new Date($scope.calendar.events[element].start))
                            $scope.calendar.events[element].start = new Date($scope.calendar.events[element].start)
                            $scope.calendar.events[element].title += ' @' + $filter('date')($scope.calendar.events[element].start, 'h:mma')//' @'+util.hour12($scope.calendar.events[element].start.getHours())
                            var fullTitle = $scope.calendar.events[element].courseName.name + $scope.calendar.events[element].title ;
                            $scope.calendar.events[element].title = fullTitle;
                            
                            if ($scope.calendar.events[element].quizId)
                                $scope.calendar.events[element].url = $state.href("course.courseware.module.quiz", {course_id: $scope.calendar.events[element].courseId, module_id: $scope.calendar.events[element].groupId, quiz_id: $scope.calendar.events[element].quizId})
                            else if ($scope.calendar.events[element].lectureId)
                                $scope.calendar.events[element].url = $state.href("course.courseware.module.lecture", {course_id: $scope.calendar.events[element].courseId, module_id: $scope.calendar.events[element].groupId, lecture_id: $scope.calendar.events[element].lectureId})
                            else {
                                if (!$scope.calendar.events[element].firstItem)
                                    $scope.calendar.events[element].url = $state.href("course.courseware", {course_id: $scope.calendar.events[element].courseId})
                                else {
                                    if ($scope.calendar.events[element].firstItemType == "Lecture")
                                        $scope.calendar.events[element].url = $state.href("course.courseware.module.lecture", {course_id: $scope.calendar.events[element].courseId, module_id: $scope.calendar.events[element].groupId, lecture_id: $scope.calendar.events[element].firstItem.id})
                                    else
                                        $scope.calendar.events[element].url = $state.href("course.courseware.module.quiz", {course_id: $scope.calendar.events[element].courseId, module_id: $scope.calendar.events[element].groupId, quiz_id: $scope.calendar.events[element].firstItem.id})
                                }
                            }
                        }
                        $scope.eventSources.push($scope.calendar);
                        console.log($scope.eventSources)
                        $timeout(function() {
                            $(window).resize()
                        })
                    },
                            function() {
                            })
                }

                var getFeed = function(){
                    NewsFeed.index({}, function(data){
                    $scope.events = []
                    $scope.latest_events = data.latest_events
                    $scope.latest_announcements = data.latest_announcements
                    $scope.latest_events.forEach(function(event){
                      event.timestamp = event.appearance_time;
                      $scope.events.push(event);
                    })
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

                $scope.$watch("current_lang", change_lang);
                getFeed();
                init();

            }]);