'use strict';

angular.module('scalearAngularApp')
  .directive('teacherModuleSummary', ['ScalearUtils', '$filter', '$translate', '$state', function(ScalearUtils, $filter, $translate, $state) {
    return {
      scope: {
        moduledata: '='
      },
      replace: true,
      templateUrl: "/views/teacher/progress/teacher_module_summary.html",
      link: function(scope, elem) {
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

        var student_completion_options = {
          on_time: {
            text: "On-time",
            color: "#16A53F" // Green
          },
          late: {
            text: "Late",
            color: "#E66726" //Orange:
          },
          incomplete: {
            text: "Incomplete",
            color: "#a4a9ad" //silver
          },
          completed: {
            text: "Complete",
            color: "#16A53F" //Green:
          },
          more_than_50: {
            text: "More than 50%",
            color: "#BADAA5" //Pale Green:
          },
          less_than_50: {
            text: "Less than 50%",
            color: "#F5C09E" //Pale Orange
          },
          not_watched: {
            text: "Not Started",
            color: "#a4a9ad" //silver
          }
        }

        var student_completion_data_series = []
        Object.keys(scope.moduledata.students_completion).forEach(function(student_key) {
          var bar = {
            name: student_completion_options[student_key].text,
            data: [scope.moduledata.students_completion[student_key]],
            color: student_completion_options[student_key].color
          }
          student_completion_data_series.push(bar)
        })

        scope.student_completion_chart_config = {
          options: {
            chart: {
              type: 'bar',
              margin: [0, 0, 10, 0],
              spacing: [0, 0, 0, 0]
            },
            plotOptions: {
              series: {
                stacking: 'normal'
              }
            },
            legend: {
              enabled: false
            },
            tooltip: {
              formatter: function() {
                return '<b style="color:' + this.series.color + '">' + this.series.name + '</b> (' + this.y + ' of ' + scope.moduledata.students_count + ')';
              },
              positioner: function(labelWidth, labelHeight, point) {
                var bar_start = point.plotX - point.h
                var bar_end = point.plotX
                var mid_point = bar_start + (bar_end - bar_start) / 2
                var offset = labelWidth / 2

                var tooltipX = mid_point - offset
                var tooltipY = point.plotY + 20;

                if (tooltipX < 0) {
                  tooltipX = 0
                }
                return {
                  x: tooltipX,
                  y: tooltipY
                };
              }
            }
          },
          size: {
            height: 100,
            width: elem.width()
          },
          title: { text: null },
          xAxis: {
            categories: null,
            gridLineWidth: 0,
            labels: { enabled: false },
            lineWidth: 0,
            minorGridLineWidth: 0,
            lineColor: 'transparent',
            minorTickLength: 0,
            tickLength: 0
          },
          yAxis: {
            title: { text: null },
            gridLineWidth: 0,
            labels: { enabled: false },
            lineWidth: 0,
            minorGridLineWidth: 0,
            lineColor: 'transparent',
            minorTickLength: 0,
            tickLength: 0,
            min: 0,
            max: scope.moduledata.students_count
          },
          series: student_completion_data_series
        }

        scope.goTo = function(state, course_id, group_id, item_id) {
          $state.go(state, { course_id: course_id, module_id: group_id, item_id: item_id })
        }

      }
    };
  }])
  .directive('teacherOnlineQuizSummary', ['$state', '$compile', '$timeout', function($state, $compile, $timeout) {
    return {
      scope: {
        moduledata: '='
      },
      replace: true,
      templateUrl: "/views/teacher/progress/teacher_online_quiz_summary.html",
      link: function(scope, elem) {
        var quiz_completion_data_series = {
          never_tried: {
            name: "Never Tried",
            data: [],
            color: "#a4a9ad" //silver
          },
          survey_solved: {
            name: "Solved",
            data: [],
            color: "#355BB7" //blue
          },
          not_checked: {
            name: "Not Checked",
            data: [],
            color: "#551a8b" //purble
          },
          tried_not_correct: {
            name: "Tried, Not Correct",
            data: [],
            color: "#E66726" //Orange:
          },
          tried_correct_finally: {
            name: "Tried, Correct Finally",
            data: [],
            color: "#BADAA5" //Pale Green:
          },
          correct_first_try: {
            name: "Correct First Try",
            data: [],
            color: "#16A53F" // Green
          },
          review_vote: {
            name: "Voted For Review",
            data: [],
            color: "#f5c343" //yellow:
          }
        }

        var quiz_xaxis_categories = []
        scope.moduledata.online_quiz.forEach(function(video_quiz) {
          Object.keys(video_quiz).forEach(function(id) {
            quiz_xaxis_categories.push('<b>' + video_quiz[id]['lecture_name'] + ": </b>" + video_quiz[id]['quiz_name'])
            Object.keys(video_quiz[id]['data']).forEach(function(quiz_bar) {
              if (quiz_bar == 'review_vote') {
                scope.review_vote_exist = (video_quiz[id]['data'][quiz_bar] > 0)
                quiz_completion_data_series[quiz_bar].data.push(video_quiz[id]['data'][quiz_bar] * -1)
              } else {
                quiz_completion_data_series[quiz_bar].data.push(video_quiz[id]['data'][quiz_bar])
              }
            })
            if (video_quiz[id].type == 'quiz') {
              quiz_completion_data_series['survey_solved'].data.push(0)
            } else {
              quiz_completion_data_series['tried_not_correct'].data.push(0)
              quiz_completion_data_series['tried_correct_finally'].data.push(0)
              quiz_completion_data_series['correct_first_try'].data.push(0)
              quiz_completion_data_series['not_checked'].data.push(0)
            }
          })
        })

        scope.quiz_completion_chart_config = {
          options: {
            chart: {
              type: 'column',
              events: {
                load: function() {
                  this.quiz_tooltip = new Highcharts.Tooltip(this, this.options.tooltip);
                },
              },
              margin: (scope.review_vote_exist) ? [10, 0, 10, 0] : [0, 0, 30, 0]
            },
            plotOptions: {
              series: {
                stacking: 'normal',
              },
              column: {
                pointWidth: 20,
                events: {
                  click: function(evt) {
                    evt.stopPropagation()
                    this.chart.quiz_tooltip.refresh([evt.point], evt);
                    var that = this
                    $(document).click(function() {
                      that.chart.quiz_tooltip.hide(100)
                      $(document).off('click');
                    })
                  },
                }
              }
            },
            legend: { enabled: false },
            tooltip: {
              shared: true,
              useHTML: true,
              enabled: false,
              backgroundColor: "white",
              formatter: quizTooltipFormatter,
              positioner: function(labelWidth, labelHeight, point) {
                var tooltipX = point.plotX - (labelWidth / 2)
                var tooltipY = (scope.review_vote_exist) ? 110 : 100
                if (tooltipX < 0) {
                  tooltipX = 0
                }
                return {
                  x: tooltipX,
                  y: tooltipY
                }
              }
            }
          },
          size: {
            height: (scope.review_vote_exist) ? 165 : 125
          },
          title: { text: null },
          xAxis: {
            categories: quiz_xaxis_categories,
            gridLineWidth: 0,
            labels: { enabled: false },
            lineColor: 'transparent',
            labels: { enabled: false },
            lineWidth: 0,
            minorGridLineWidth: 0,
            lineColor: 'transparent',
            minorTickLength: 0,
            tickLength: 0

          },
          yAxis: {
            title: { text: null },
            gridLineWidth: 0,
            plotLines: [{
              color: 'black',
              width: 1,
              value: 0
            }],
            labels: { enabled: false },
            lineWidth: 0,
            minorGridLineWidth: 0,
            lineColor: 'transparent',
            minorTickLength: 0,
            tickLength: 0,
            max: scope.moduledata.students_count
          },
          series: quiz_completion_data_series
        }

        function quizTooltipFormatter() {
          var quiz = scope.moduledata.online_quiz[this.points[0].point.index]
          var quiz_id = Object.keys(quiz)[0]
          var quiz_data = quiz[quiz_id]
          var quiz_type = quiz_data.type
          var xaxis_categories = []
          if (quiz_type == 'quiz') { ////////////////////  Quiz bar tooltip
            scope.quiz_only_one_bar_config = {
              options: {
                chart: {
                  type: 'column',
                  spacing: [0, 0, 0, 0],
                  margin: [0, 0, 1, 0]
                },
                plotOptions: { series: { stacking: 'normal', animation: false } },
                legend: { reversed: true },
              },
              size: {
                width: 70,
                height: (quiz_data.data['review_vote'] > 0) ? 150 : 130
              },
              title: { text: null },
              xAxis: {
                categories: null,
                gridLineWidth: 0,
                labels: {
                  useHTML: true,
                  enabled: false
                },
                lineColor: 'transparent'
              },
              yAxis: {
                title: { text: null },
                gridLineWidth: 0,
                plotLines: [{
                  color: 'black',
                  width: 1,
                  value: 0
                }],
                labels: { enabled: false }
              },
              series: [{
                showInLegend: false,
                name: "Never tried",
                data: [quiz_data.data['never_tried']],
                color: "#a4a9ad" //silver
              }, {
                showInLegend: false,
                name: "Not Checked",
                data: [quiz_data.data['not_checked']],
                color: "#551a8b" //purble
              }, {
                showInLegend: false,
                name: "Tried, not correct",
                data: [quiz_data.data['tried_not_correct']],
                color: "#E66726" //Orange:
              }, {
                showInLegend: false,
                name: "Correct, finally",
                data: [quiz_data.data['tried_correct_finally']],
                color: "#BADAA5" //Pale Green:
              }, {
                showInLegend: false,
                name: "Correct, first time",
                data: [quiz_data.data['correct_first_try']],
                color: "#16A53F" // Green
              }, {
                showInLegend: false,
                name: "Voted For Review",
                data: [quiz_data.data['review_vote'] * -1],
                color: "#f5c343" //yellow:
              }]
            }
            scope.title = this.x;
            scope.left = '';


            scope.quiz_only_one_bar_config.series.forEach(function(quiz) {
              var count = Math.abs(quiz.data[0])
              scope.left += '<div>' + count + "  (" + ((count / scope.moduledata.students_count) * 100).toFixed(2) + '%)     ' + '<span style="color:' + quiz.color + '">' + quiz.name + '</span></div>'
            });
          } else { ///// SURVEY TOOLTIP
            scope.title = this.x;
            scope.left = '';

            var answer_data = []
            var xaxis_categories = []
            scope.left += '<br/>' + this.points[0].y + "  (" + this.points[0].percentage.toFixed(2) + '%)     ' + '<span >' + this.points[0].series.name + '</span>'

            Object.keys(quiz_data.answer).forEach(function(answer) {
              answer_data.push(quiz_data.answer[answer]);
              xaxis_categories.push(answer)
              scope.left += '<br/>' + quiz_data.answer[answer] + "  (" + ((quiz_data.answer[answer] / scope.moduledata.students_count) * 100).toFixed(2) + '%)     ' + '<span >' + answer + '</span>'
            });

            ////////////////////  Survey bar tooltip
            scope.quiz_only_one_bar_config = {
              options: {
                chart: {
                  type: 'column',
                  spacing: [0, 0, 0, 0],
                  margin: [0, 0, 1, 0]
                },
                plotOptions: { series: { stacking: 'normal', animation: false } },
                legend: { reversed: true },
              },
              size: {
                width: 150,
                height: 130
              },
              title: { text: null },
              xAxis: {
                categories: xaxis_categories,
                gridLineWidth: 0,
                labels: {
                  useHTML: true,
                  enabled: false
                },
                lineColor: 'transparent'
              },
              yAxis: {
                title: { text: null },
                gridLineWidth: 0,
                plotLines: [{
                  color: 'black',
                  width: 1,
                  value: 0
                }],
                labels: { enabled: false }
              },
              series: [{
                showInLegend: false,
                data: answer_data,
                color: "#355BB7" //silver
              }]
            }
          }

          var tooltip_template = "<div style='width:460px; height:100%'>" +
            "<div ng-bind-html='title'></div>" +
            "<table><tr><td style='padding-top: 0px;padding-bottom: 0;'>" +
            "<highchart class='chart' config='quiz_only_one_bar_config' ></highchart>" +
            "</td><td>" +
            "<div ng-bind-html='left' style='font-size:12px'></div>" +
            "</td><td>" +
            "</td></tr></table>" +
            "<div style='bottom: 10px;position: absolute;right: 10px;'><a class='button left tiny green module-review gotToQuizButton' style='pointer-events: visible;margin-bottom: 0;margin-top: 10px;' translate>dashboard.review_quiz</a></div>" +
            "</div>"

          $("#quiz_bar").html(tooltip_template)
          $compile($("#quiz_bar"))(scope)
          scope.$digest();

          $timeout(function() {
            $(".gotToQuizButton").click(function() {
              scope.goTo('course.module.progress', scope.moduledata.course_id, scope.moduledata.id, "vq_" + quiz_id)
            })
          })

          return $("#quiz_bar").html()
        }

        scope.goTo = function(state, course_id, group_id, item_id) {
          $state.go(state, { course_id: course_id, module_id: group_id, item_id: item_id })
        }
      }
    }
  }])
  .directive('teacherDiscussionSummary', ['$state', function($state) {
    return {
      scope: {
        moduledata: '='
      },
      replace: true,
      templateUrl: "/views/teacher/progress/teacher_dashboard_summary.html",
      link: function(scope, elem) {
        scope.goTo = function(state, course_id, group_id, item_id) {
          $state.go(state, { course_id: course_id, module_id: group_id, item_id: item_id })
        }
      }
    }
  }])
  .directive('studentModuleSummary', ['ScalearUtils', '$filter', '$translate', '$state', function(ScalearUtils, $filter, $translate, $state) {
    return {
      scope: {
        moduledata: '='
      },
      replace: true,
      templateUrl: "/views/student/progress/student_module_summary.html",
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

        if (scope.moduledata.first_lecture == -1) {
          scope.continue_button = null
        } else if (scope.moduledata.module_done == -1 && scope.moduledata.last_viewed > -1) {
          scope.continue_button = "Continue watching"
          scope.next_lecture = scope.moduledata.last_viewed
        } else if (scope.moduledata.module_done >= 0 && scope.moduledata.first_lecture != -1) {
          scope.continue_button = "Watch again"
          scope.next_lecture = scope.moduledata.first_lecture
        } else if (scope.moduledata.module_done == -1 && scope.moduledata.last_viewed == -1) {
          scope.continue_button = "Start watching"
          scope.next_lecture = scope.moduledata.first_lecture
        }

        scope.goTo = function(course_id, group_id, lecture_id, time) {
          $state.go("course.module.courseware.lecture", { course_id: course_id, module_id: group_id, lecture_id: lecture_id, time: time }, { time: time })
        }
      }
    }
  }])
  .directive('studentOnlineQuizSummary', ['ScalearUtils', '$translate', '$state', function(ScalearUtils, $translate, $state) {
    return {
      scope: {
        moduledata: '='
      },
      replace: true,
      templateUrl: "/views/student/progress/student_online_quiz_summary.html",
      link: function(scope) {
        scope.remaining = 'Remaining: ' + ScalearUtils.toHourMin(scope.moduledata.remaining_duration) + " " +
          $translate.instant('time.hours') + ", " + scope.moduledata.remaining_quiz + " " + $translate.instant('global.quizzes') + ", " +
          scope.moduledata.remaining_survey + " " + $translate.instant('global.surveys') + ". "

        scope.group_width = (1 / scope.moduledata['online_quiz_count']) * 100

        scope.item_style = {}
        scope.completion_style = {}
        scope.quiz_bar_style = {}
        scope.online_quiz_color = {}
        scope.online_quiz_group_color = {}

        scope.quiz_completion_data_series = {
          group_never_tried: {
            name: " and you did not answer this group question.",
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
            name: " and your group answer was <span style='color:#E66726'>not correct</spna>.",
            color: "#E66726" //Orange:
          },
          group_tried_correct_finally: {
            name: " and your group answer was <span style='color:#BADAA5'>correct</span> after a retry",
            color: "#BADAA5" //Pale Green:
          },
          group_correct_first_try: {
            name: " and your group answer was <span style='color:#16A53F'>correct</span>.",
            color: "#16A53F" // Green
          },
          self_never_tried: {
            name: "You did not answer this quiz.",
            group_name: "You did not answer this individual quiz,",
            color: "#a4a9ad" //silver
          },
          self_survey_solved: {
            name: "You <span style='color:#355BB7'>answered this survey</span>.",
            group_name: "You answered this individual survey,",
            color: "#355BB7" //blue
          },
          self_not_checked: {
            name: "You have tried this quiz, but your answer did not been checked,",
            group_name: "You have tried this quiz, but your answer did not been checked.",
            color: "#551a8b" //purble
          },
          self_tried_not_correct: {
            name: "You have tried this quiz, but have <span style='color:#E66726'>not gotten the answer correct</span>.",
            group_name: "Your individual answer was <span style='color:#E66726'>incorrect</span>,",
            color: "#E66726" //Orange:
          },
          self_tried_correct_finally: {
            name: "You got the answer correct, but <span style='color:#BADAA5'>not on the first try</span>.",
            group_name: "Your individual answer was <span style='color:#BADAA5'>correct</span> after a retry,",
            color: "#BADAA5" //Pale Green:
          },
          self_correct_first_try: {
            name: "You got the answer <span style='color:#16A53F'>correct</span>.",
            group_name: "Your individual answer was <span style='color:#16A53F'>correct</span>,",
            color: "#16A53F" // Green
          },
          not_done: {
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
          var item_position = item_el.offset()
          scope.item_tooltip_style = {
            left: item_position.left,
            top: item_position.top + item_el.height()
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
              if (scope.moduledata.module_done == -1) {
                scope.online_quiz_color[online_quiz.id] = {
                  "backgroundColor": scope.quiz_completion_data_series["not_done"].color
                }
                scope.online_quiz_group_color[online_quiz.id] = {
                  "backgroundColor": scope.quiz_completion_data_series["not_done"].color
                }
                scope.content[online_quiz.id] = scope.quiz_completion_data_series["not_done"].name
              } else if (online_quiz['data'].length == 2) {
                scope.online_quiz_color[online_quiz.id] = {
                  "backgroundColor": scope.quiz_completion_data_series[online_quiz['data'][0]].color
                }
                scope.online_quiz_group_color[online_quiz.id] = {
                  "backgroundColor": scope.quiz_completion_data_series[online_quiz['data'][1]].color
                }
                scope.content[online_quiz.id] = scope.quiz_completion_data_series[online_quiz['data'][0]].group_name + scope.quiz_completion_data_series[online_quiz['data'][1]].name
              } else {
                scope.online_quiz_color[online_quiz.id] = {
                  "backgroundColor": scope.quiz_completion_data_series[online_quiz['data'][0]].color
                }
                scope.content[online_quiz.id] = scope.quiz_completion_data_series[online_quiz['data'][0]].name
              }
              scope.online_popover[online_quiz['id']] = {
                title: "<b ng-bind-html='online_quiz_name[online_quiz.id]'></b> ",
                content: "<div ng-bind-html='content[online_quiz.id]' style='margin-bottom: 10px;'></div> " +
                  "<div class='right' style='bottom: 10px;right: 10px;'>" +
                  "<a ng-hide='moduledata.module_done == -1' class='button left tiny green module-review ' style='pointer-events: visible;margin-bottom: 0;margin-top: 10px;margin-bottom:10px' ng-click='goTo(moduledata.course_id, moduledata.id, online_quiz.lecture_id, online_quiz.time)' translate>dashboard.try_again</a>"+
                  "</div>",
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
  }])
  .directive('studentDiscussionSummary', ['$state', function($state) {
    return {
      scope: {
        moduledata: '='
      },
      replace: true,
      templateUrl: "/views/student/progress/student_discussion_summary.html",
      link: function(scope) {
        scope.goTo = function(course_id, group_id, lecture_id, time) {
          $state.go("course.module.courseware.lecture", { course_id: course_id, module_id: group_id, lecture_id: lecture_id, time: time }, { time: time })
        }
      }
    }
  }])
