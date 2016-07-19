'use strict';

angular.module('scalearAngularApp')
  .controller('dashboardCtrl', ['$scope', '$state', '$stateParams', 'Dashboard', 'NewsFeed', 'Page', '$timeout', '$rootScope', '$compile', '$translate', '$filter', '$location', 'Module', 'ErrorHandler', '$interval', function($scope, $state, $stateParams, Dashboard, NewsFeed, Page, $timeout, $rootScope, $compile, $translate, $filter, $location, Module, ErrorHandler, $interval) {

    Page.setTitle('navigation.dashboard');
    Page.startTour();
    $rootScope.subheader_message = $translate("dashboard.whats_new")
    $scope.eventSources = [];
    $scope.filtered_events = [];
    $scope.calendar_year = []

    $scope.toggleLargeCalendar = function() {
      $scope.large_calendar = !$scope.large_calendar
      $timeout(function() {
        resizeCalendar()
      })
    }
    var changeLang = function() {
      if($scope.eventSources && $scope.myCalendar) {
        angular.element($scope.myCalendar.children()).remove();
        var obj = ($scope.current_lang == "en") ? full_calendar_en : full_calendar_sv;
        obj.eventSources = $scope.eventSources;
        $scope.myCalendar.fullCalendar(obj);
      }
    }

    $scope.addUrl=function(event){

      event.preventDefault()
      event.stopPropagation()

    }

    var resizeCalendar = function() {
      angular.element('#studentCalendar').fullCalendar('render');
    }

    $scope.eventRender = function(event, element) {
      $(".tooltip.tip-top").remove()
      element.attr({ 'tooltip-html-unsafe': event.tooltip_string, 'tooltip-append-to-body': true });
      $compile(element)($scope);
    };


    var getCalendar = function(year) {
      Dashboard.getDashboard({year:year}, function(data) {
        
      $scope.calendar_url = {
          content: "Calendar URL:\n"+$location.absUrl().replace("/#","")+"/dynamic_url?key="+data.key ,
          html: true,
          placement: 'right'
      }
        $scope.uiConfig = {
          calendar: {
            header: {
              right: 'today prev,next',
              left: 'title'
            },
            eventRender: $scope.eventRender
          }
        };
        if($rootScope.current_user.roles[0].id != 2) {
          $scope.uiConfig.calendar.editable = true
        }
        angular.extend($scope.uiConfig.calendar, ($scope.current_lang == "en") ? full_calendar_en : full_calendar_sv)
        $scope.calendar = data;
        for(var element in $scope.calendar.events) {
          $scope.calendar.events[element].start = new Date($scope.calendar.events[element].start)
            // $scope.calendar.events[element].title = $scope.calendar.events[element].course_short_name +" : "+ $scope.calendar.events[element].title + ' @' + $filter('date')($scope.calendar.events[element].start, 'HH:mm');
          $scope.calendar.events[element].item_title = $scope.calendar.events[element].title.replace(" due", "");
          // $filter('date')($scope.calendar.events[element].start, 'HH:mm')+'-'+
          $scope.calendar.events[element].title = $scope.calendar.events[element].course_short_name + ": " + $scope.calendar.events[element].item_title

          $scope.calendar.events[element].tooltip_string = $scope.calendar.events[element].title + "<br />" + $translate('events.due') + " " + $translate('global.at') + " " + $filter('date')($scope.calendar.events[element].start, 'HH:mm')
          if($scope.calendar.events[element].status == 1)
            $scope.calendar.events[element].tooltip_string += "<br />" + $translate("events.completed_on_time")
          else if($scope.calendar.events[element].status == 2)
            $scope.calendar.events[element].tooltip_string += "<br />" + $translate("events.completed") + " " + $scope.calendar.events[element].days + " " + $translate("time.days") + " " + $translate("events.late")
          if($rootScope.current_user.roles[0].id == 2) {
            if($scope.calendar.events[element].quiz_id)
              $scope.calendar.events[element].url = $state.href("course.module.courseware.quiz", { course_id: $scope.calendar.events[element].course_id, module_id: $scope.calendar.events[element].group_id, quiz_id: $scope.calendar.events[element].quiz_id }, { absolute: true })
            else if($scope.calendar.events[element].lecture_id)
              $scope.calendar.events[element].url = $state.href("course.module.courseware.lecture", { course_id: $scope.calendar.events[element].course_id, module_id: $scope.calendar.events[element].group_id, lecture_id: $scope.calendar.events[element].lecture_id }, { absolute: true })
            else
              $scope.calendar.events[element].url = $state.href("course.module.courseware", { course_id: $scope.calendar.events[element].course_id, module_id: $scope.calendar.events[element].group_id }, { absolute: true })
          } else
            $scope.calendar.events[element].url = $state.href("course.module.progress", { course_id: $scope.calendar.events[element].course_id, module_id: $scope.calendar.events[element].group_id }, { absolute: true })

        }
        $scope.calendar.className = ["truncate"]
        $scope.uiConfig.calendar.eventDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
          var group = { "due_date": event.start }
          Module.update({
              course_id: event.course_id,
              module_id: event.group_id
            }, {
              group: group
            },
            function(response) {
              if(response.notice) {
                $rootScope.show_alert = "success";
                ErrorHandler.showMessage($translate("error_message.due_date_changed"), 'errorMessage', 2000);
                $interval(function() {
                  $rootScope.show_alert = "";
                }, 4000, 1);
              }
            },
            function(response) {
              revertFunc()
              console.log(response)
                // if (response.notice){
              $rootScope.show_alert = "error";
              ErrorHandler.showMessage(response.data.errors.appearance_time[0], 'errorMessage', 2000);
              $interval(function() {
                $rootScope.show_alert = "";
              }, 4000, 1);
              // }
            }
          );
        }

        $scope.uiConfig.calendar.viewRender = function(view,element){
          if (!($scope.calendar_year.indexOf(view.title.split(" ")[1]) >= 0) ){
            $scope.calendar_year.push(view.title.split(" ")[1].toString())
            getCalendar(view.title.split(" ")[1])
          }
        } 

        $scope.uiConfig.calendar.firstDay = $rootScope.current_user.first_day;
        $scope.eventSources.push($scope.calendar);
        $timeout(function() {
          // changeLang()
          resizeCalendar()
        }, 300)
      })
    }


    var getAnnouncements = function() {
      NewsFeed.index({}, function(data) {
        $scope.events = []
        $scope.latest_announcements = data.latest_announcements
        $scope.latest_announcements.forEach(function(announcement) {
          announcement.timestamp = announcement.updated_at;
          $scope.events.push(announcement);
          $timeout(function() {
            resizeCalendar()
          }, 300)
        })
      }, function() {})
    }

    $scope.exportCalendar = function() {
      var cal = ics();
      for(var element in $scope.calendar.events) {
        var description = $scope.calendar.events[element].tooltip_string.replace("<br />", " ") + " " + $scope.calendar.events[element].url;
        cal.addEvent($scope.calendar.events[element].title, description, 'Scalable-Learning', $scope.calendar.events[element].start, $scope.calendar.events[element].start);
      }
      cal.download("calendar");
    }

    getAnnouncements();
    var year = new Date().getFullYear()
    getCalendar(year);
    $scope.calendar_year.push(year.toString())


  }]);
