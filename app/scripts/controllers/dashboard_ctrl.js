'use strict';

angular.module('scalearAngularApp')
  .controller('dashboardCtrl', ['$scope', '$state', '$stateParams', 'Dashboard', 'NewsFeed', 'Page', '$timeout', '$rootScope', '$compile', '$translate', '$filter', '$location', 'Module', 'ErrorHandler', '$interval', 'Lecture', 'Quiz', 'UserSession', 'ScalearUtils', function($scope, $state, $stateParams, Dashboard, NewsFeed, Page, $timeout, $rootScope, $compile, $translate, $filter, $location, Module, ErrorHandler, $interval, Lecture, Quiz, UserSession, ScalearUtils) {

    Page.setTitle('navigation.dashboard');
    Page.startTour();
    $rootScope.subheader_message = $translate.instant("dashboard.whats_new")
    $scope.eventSources = [];
    $scope.module_summary_data = []
    var calendar_year_cache = []
    var current_user = null

    UserSession.getCurrentUser()
      .then(function(user) {
        current_user = user
        getCalendar()
        getAnnouncements();
        // getMonthData(getDateString())
      })

    $scope.toggleLargeCalendar = function() {
      $scope.large_calendar = !$scope.large_calendar
      $timeout(function() {
        resizeCalendar()
      })
    }

    $scope.preventDropDownHide = function(event) {
      event.preventDefault()
      event.stopPropagation()
    }

    function resizeCalendar() {
      angular.element('#studentCalendar').fullCalendar('render');
    }

    function getDateString(date, val) {
      var d = date? new Date(date) :  new Date()
      d.setMonth((d.getMonth() % 12) + (val || 0))
      return d.toLocaleString("en-us", { month: "long", year: "numeric" })
    }

    function eventRender(event, element) {
      $(".tooltip.tip-top").remove()
      element.attr({ 'tooltip-html-unsafe': event.tooltip_string, 'tooltip-append-to-body': true });
      $compile(element)($scope);
    };

    function calendarSetup() {
      $scope.uiConfig = {
        calendar: {
          header: {
            right: 'today prev,next',
            left: 'title'
          },
          eventRender: eventRender,
          eventDrop: eventDrop,
          firstDay: current_user.first_day
        }
      };
      $scope.uiConfig.calendar.editable = true

      angular.extend($scope.uiConfig.calendar, ($scope.current_lang == "en") ? full_calendar_en : full_calendar_sv)
    }

    function viewRender(view, element) {
       getMonthData(view.title)
    }

    function getMonthData(month_title) {
      var to_retrive = []
      var month_length = 3
      for(var i = -1; i < month_length - 1; i++) {
        var month = getDateString(month_title, i)
        if(calendar_year_cache.indexOf(month) == -1) {
          to_retrive.push(month)
          calendar_year_cache.push(month)
        }
      }
      if(to_retrive.length) {
        getCalendar(to_retrive)
      }
    }

    function eventDrop( event, delta, revertFunc, jsEvent, ui, view ) {
      var group = { "due_date": event.start }
      if(event.lecture_id) {
        Lecture.update({
            course_id: event.course_id,
            lecture_id: event.lecture_id
          }, {
            lecture: group
          },
          function(response) {
            responseSucces(response)
          },
          function(response) {
            responseFail(response, revertFunc, event,"Lecture")
          }
        );
      } else if(event.quiz_id) {
        Quiz.update({
            course_id: event.course_id,
            quiz_id: event.quiz_id
          }, {
            quiz: group
          },
          function(response) {
            responseSucces(response)
          },
          function(response) {
            responseFail(response, revertFunc, event,"Quiz")
          }
        );

      } else {
        Module.update({
            course_id: event.course_id,
            module_id: event.group_id
          }, {
            group: group
          },
          function(response) {
            responseSucces(response)
          },
          function(response) {
            responseFail(response, revertFunc, event,"Module")
          }
        );
      }
    }

    function responseSucces(response) {
      if(response.notice) {
        ErrorHandler.showMessage($translate.instant("error_message.due_date_changed"), 'errorMessage', 4000, "success");
      }
    }

    function responseFail(response, revertFunc, item,type) {
      revertFunc()
      if(response.data.errors[Object.keys(response.data.errors)[0]][0] == "must be before due time") {
        // var message = ScalearUtils.capitalize(Object.keys(response.data.errors)[0].replace("_", " ")) + "(" + response.data.appearance_time + ") " + response.data.errors[Object.keys(response.data.errors)[0]][0]
        // var message = "You cannot move the "+type+"'s due date before it's appearance date. To change the appearance date click on the module and choose edit."
        var message = $translate.instant("events.drag_due_date_error_part_1")+type+$translate.instant("events.drag_due_date_error_part_2")+type+$translate.instant("events.drag_due_date_error_part_3")
      } else {
        var message = Object.keys(response.data.errors)[0].replace("_", " ") + " " + response.data.errors[Object.keys(response.data.errors)[0]][0]
      }
      ErrorHandler.showMessage(message, 'errorMessage', 4000, "error");
    }

    function setupPopover(key) {
      $scope.calendar_url = $location.absUrl().replace("/#", "") + "/dynamic_url?key=" + key
      $scope.calendar_pop = {
        content: "<div ng-click='preventDropDownHide($event)'><div><b>Subscribe to Calendar:</b></div><div style='padding: 5px;word-wrap: break-word;'>{{calendar_url}}</div></div>",
        html: true,
        placement: 'right'
      }
    }

    function getCalendar() {
      Dashboard.getDashboard({}, function(data) {
        calendarSetup()

        getSummaryModule(data.module_summary_id_list);
        setupPopover(data.key)
        $scope.calendar = data;

        for(var element in $scope.calendar.events) {
          var event = $scope.calendar.events[element]
          event.start = new Date(event.start)
          event.item_title = event.title.replace(" due", "");
          event.title = event.course_short_name + ": " + event.item_title
          event.tooltip_string = event.title + "<br />" + $translate.instant('events.due') + " " + $translate.instant('global.at') + " " + $filter('date')(event.start, 'HH:mm')

          if(event.status == 1) {
            event.tooltip_string += "<br />" + $translate.instant("events.completed_on_time")
          } else if(event.status == 2) {
            event.tooltip_string += "<br />" + $translate.instant("events.completed") + " " + event.days + " " + $translate.instant("time.days") + " " + $translate.instant("events.late")
          }
          var params = { course_id: event.course_id, module_id: event.group_id }
          var url = "course.module"
          if(event.role == 2) {
            url += ".courseware"
            if(event.quiz_id) {
              url += ".quiz"
              params.quiz_id = event.quiz_id
            } else if(event.lecture_id) {
              url += ".lecture"
              params.lecture_id = event.lecture_id
            }
            event.editable = false
          } else {
            url = ".progress"
          }
          event.url = $state.href(url, params, { absolute: true })
        }
        $scope.calendar.className = ["truncate"]
        $scope.eventSources.push({events:$scope.calendar.events});
        $timeout(function() {
          resizeCalendar()
        }, 300)
      })
    }

    function getAnnouncements() {
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
      })
    }


    function getSummaryModule(module_summary_id_list){
      module_summary_id_list.forEach(function(module_summary_id){
        console.log(module_summary_id)
        $scope.course_id = module_summary_id[1]
        Module.getDashboardModule({
          module_id: module_summary_id[0],
          course_id: module_summary_id[1]
          },function(data){
            $scope.module_summary_data.push(data.module)
        }
        )
      })

    }

    $scope.exportCalendar = function() {
      var cal = ics();
      for(var element in $scope.calendar.events) {
        var description = $scope.calendar.events[element].tooltip_string.replace("<br />", " ") + " " + $scope.calendar.events[element].url;
        cal.addEvent($scope.calendar.events[element].title, description, 'Scalable-Learning', $scope.calendar.events[element].start, $scope.calendar.events[element].start);
      }
      cal.download("calendar");
    }

    $scope.createAnnouncement=function(){
      $state.go("course.announcements", { course_id: $scope.course_id, show: true})
    }

  }]);
