'use strict';

angular.module('scalearAngularApp')
  .directive('studentModuleSummary', ['ErrorHandler', 'ScalearUtils', '$filter', '$translate', '$state', '$compile', '$timeout', function(ErrorHandler, ScalearUtils, $filter, $translate, $state, $compile, $timeout) {
    return {
      scope: {
        moduledata: '='
      },
      replace: true,
      templateUrl: "/views/student_module_dashboard.html",
      link: function(scope) {
        console.log(scope.moduledata)
        scope.moduledata.hour_min = ScalearUtils.toHourMin(scope.moduledata.duration)
        scope.moduledata.time_left_string = ScalearUtils.toHourMin(scope.moduledata.due_date).split(":")[0]

        scope.subtitle = scope.moduledata.hour_min + " " +
          $translate.instant('time.hours') + ", " +
          scope.moduledata.quiz_count + " " +
          $translate.instant('global.quizzes') + ", " +
          scope.moduledata.survey_count + " " +
          $translate.instant('global.surveys') + ". " +
          $translate.instant('events.due') + " " +
          $filter('date')(new Date(scope.moduledata.due_date_string), 'dd-MMMM-yyyy') + " " +
          $translate.instant('global.at') + " " +
          $filter('date')(new Date(scope.moduledata.due_date_string), 'HH:mm') + "."

        scope.remaining = 'Remaining: ' + ScalearUtils.toHourMin(scope.moduledata.remaining_duration) + " " +
          $translate.instant('time.hours') + ", " + scope.moduledata.remaining_quiz + " " + $translate.instant('global.quizzes') + ", " +
          scope.moduledata.remaining_survey + " " + $translate.instant('global.surveys') + ". "

        if (scope.moduledata.first_lecture == -1) {
          scope.continue_button = null
        } else if (scope.moduledata.remaining_duration > 0 && scope.moduledata.remaining_duration < scope.moduledata.duration) {
          scope.continue_button = "Continue watching"
          scope.next_lecture = scope.moduledata.last_viewed
        } else if (scope.moduledata.remaining_duration == 0 && scope.moduledata.first_lecture != -1) {
          scope.continue_button = "Watch again"
          scope.next_lecture = scope.moduledata.first_lecture
        } else {
          scope.continue_button = "Start watching"
          scope.next_lecture = scope.moduledata.first_lecture
        }

        scope.group_width = (1 / scope.moduledata['online_quiz_count']) * 100

        scope.trigger_tooltip = 0
        scope.quiz = {}
        scope.item_style = {}
        scope.completion_style = {}
        scope.quiz_bar_style = {}
        scope.online_quiz_color = {}
        scope.online_quiz_group_color = {}
        scope.quiz_completion_data_series = {
          group_never_tried: {
            name: " and  you did not answer this group question.",
            color: "#a4a9ad" //silver
          },
          group_survey_solved: {
            name: " and you solved this group survey.",
            color: "#355BB7" //blue
          },
          group_not_checked: {
            name: " and your answer is not checked.",
            color: "#551a8b" //purble
          },
          group_tried_not_correct: {
            name: " and your group answer was <span style='color:#E66726'> not correct.</spna>",
            color: "#E66726" //Orange:
          },
          group_tried_correct_finally: {
            name: " and your group answer was<span style='color:#BADAA5'> correct </span> after a retry",
            color: "#BADAA5" //Pale Green:
          },
          group_correct_first_try: {
            name: " and your group answer was <span style='color:#16A53F'> correct</span>.",
            color: "#16A53F" // Green
          },
          self_never_tried: {
            name: "You did not answer this quiz.",
            group_name: "You did not answer this invdividual quiz,",
            color: "#a4a9ad" //silver
          },
          self_survey_solved: {
            name: "You did not answer this survey.",
            group_name: "You did not answer this invdividual survey,",
            color: "#355BB7" //blue
          },
          self_not_checked: {
            name: "You have tried this quiz, but your answer did not been checked,",
            group_name: "You have tried this quiz, but your answer did not been checked.",
            color: "#551a8b" //purble
          },
          self_tried_not_correct: {
            name: "You have tried this quiz, but have <span style='color:#E66726'> not gotten the answer correct.</span>",
            group_name: "Your individual answer was <span style='color:#E66726'> incorrect</span>,",
            color: "#E66726" //Orange:
          },
          self_tried_correct_finally: {
            name: "You got the answer correct, but <span style='color:#BADAA5'>not on the first try</span>.",
            group_name: "Your individual answer was <span style='color:#BADAA5'>correct </span> after a retry,",
            color: "#BADAA5" //Pale Green:
          },
          self_correct_first_try: {
            name: "You got the answer <span style='color:#16A53F'> correct </span> .",
            group_name: "Your individual answer was <span style='color:#16A53F'> correct</span>,",
            color: "#16A53F" // Green
          },
          not_done:{
            name: "Complete the module to see the results",
            color: "#a4a9ad" // Green
          }
        }

        scope.quiz_completion_bar = { "width": scope.moduledata['online_quiz_count'] * 5 }
        if (scope.quiz_completion_bar["width"] > 100) {
          scope.quiz_completion_bar["width"] = 100
        }
        scope.quiz_completion_bar["width"] += "%"

        scope.lectureTooltip = function(event, item) {
          scope.item_style[item.id]["border"] = "2px solid #000000"
          scope.completion_style[item.id]["border"] = "2px solid #000000"
          var item_el = $("#item_" + item.id)
          var item_position = item_el.position()
          scope.item_tooltip_style = {
            left: item_position.left,
            top: item_position.top + item_el.height() + 20
          }
          scope.item_tooltip_content = item.item_name
        }

        scope.lectureTooltipLeave = function(id) {
          scope.completion_style[id]["border"] = "1px solid #EFE7E7"
          scope.item_style[id]["border"] = 'none'
          scope.item_tooltip_content = null
        }

        scope.online_popover = {}
        scope.online_quiz_name = {}
        scope.content = {}
        var online_quiz_index = 0

        scope.moduledata.module_completion.forEach(function(item) {
          scope.completion_style[item.id] = {
            "width": item['duration'] + "%",
            "background": "linear-gradient(to right, #16A53F " + item['percent_finished'] + "%, #a4a9ad 0%)"
          }
          scope.item_style[item.id] = {}
          scope.quiz_bar_style[item.id] = {}

          if (item['type'] == 'lecture') {
            scope.item_style[item.id]["width"] = scope.group_width * item['online_quizzes'].length + "%"
            scope.quiz_bar_style[item.id]["width"] = 100 / item['online_quizzes'].length + "%"

            item['online_quizzes'].forEach(function(online_quiz) {

              scope.online_quiz_name[online_quiz.id] = online_quiz['quiz_name']
              if(scope.moduledata.module_done == -1){
                scope.online_quiz_color[online_quiz.id]= {
                  "backgroundColor": scope.quiz_completion_data_series["not_done"].color
                }
                scope.content[online_quiz.id] = scope.quiz_completion_data_series["not_done"].name
              }
              else if (online_quiz['data'].length == 2) {
                scope.online_quiz_color[online_quiz.id]= {
                  "backgroundColor": scope.quiz_completion_data_series[online_quiz['data'][0]].color
                }
                scope.online_quiz_group_color[online_quiz.id]= {
                  "backgroundColor": scope.quiz_completion_data_series[online_quiz['data'][1]].color
                }
                scope.content[online_quiz.id] = scope.quiz_completion_data_series[online_quiz['data'][0]].group_name + scope.quiz_completion_data_series[online_quiz['data'][1]].name
              } else {
                scope.online_quiz_color[online_quiz.id]= {
                  "backgroundColor": scope.quiz_completion_data_series[online_quiz['data'][0]].color
                }
                scope.content[online_quiz.id] = scope.quiz_completion_data_series[online_quiz['data'][0]].name
              }
              scope.online_popover[online_quiz['id']] = {
                title: "<b ng-bind-html='online_quiz_name[online_quiz.id]'></b> ",
                content: "<div ng-bind-html='content[online_quiz.id]'></div> " +
                  "<div class='right' style='bottom: 10px;right: 10px;'>" +
                  "<a ng-hide='moduledata.module_done == -1' class='button left tiny green module-review ' style='pointer-events: visible;margin-bottom: 0;margin-top: 10px;margin-bottom:10px' ng-click='goTo(moduledata.course_id, moduledata.id, online_quiz.lecture_id, online_quiz.time)' translate>dashboard.try_again</a></div>",
                html: true,
                trigger: 'click',
              }
              if (online_quiz_index / scope.moduledata['online_quiz_count'] > 0.5) {
                scope.online_popover[online_quiz['id']]['placement'] = 'left'
              }
              online_quiz_index += 1
            })
          }
        })

        scope.goTo = function(course_id, group_id, lecture_id, time) {
          $state.go("course.module.courseware.lecture", { course_id: course_id, module_id: group_id, lecture_id: lecture_id, time: time }, { time: time })
        }

      }
    };
  }]);
