'use strict';

angular.module('scalearAngularApp')
  .directive('dashboardCalendar', ['ErrorHandler', 'ScalearUtils', '$filter', '$translate', '$state', '$compile', '$timeout', function(ErrorHandler, ScalearUtils, $filter, $translate, $state, $compile, $timeout) {
    return {
      scope: {
        moduledata: '='
      },
      replace: true,
      templateUrl: "/views/dashboard_calendar.html",
      link: function(scope) {
        scope.moduledata.hour_min = ScalearUtils.toHourMin(scope.moduledata.duration)
        scope.moduledata.time_left_string = ScalearUtils.toHourMin(scope.moduledata.due_date)

        scope.subtitle = scope.moduledata.hour_min + " " +
          $translate.instant('time.minutes') + ", " +
          scope.moduledata.quiz_count + " " +
          $translate.instant('global.quizzes') + ", " +
          scope.moduledata.survey_count + " " +
          $translate.instant('global.surveys') + ". " +
          $translate.instant('events.due') + " " +
          $filter('date')(new Date(scope.moduledata.due_date_string), 'dd-MMMM-yyyy') + " " +
          $translate.instant('global.at') + " " +
          $filter('date')(new Date(scope.moduledata.due_date_string), 'HH:mm')

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
            text: "more than 50%",
            color: "#BADAA5" //Pale Green:
          },
          less_than_50: {
            text: "less than 50%",
            color: "#F5C09E" //Pale Orange
          },
          not_watched: {
            text: "Not Started",
            color: "#a4a9ad" //silver
          }
        }
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

        var student_completion_data_series = []
        Object.keys(scope.moduledata.students_completion).forEach(function(student_key) {
          var bar = {
            name: student_completion_options[student_key].text,
            data: [scope.moduledata.students_completion[student_key]],
            color: student_completion_options[student_key].color
          }
          student_completion_data_series.push(bar)
        })

        ////////////////////  student_completion main pages
        scope.student_completion_chart_config = {
          options: {
            chart: {
              type: 'bar',
              margin: [0, 0, 20, 0]
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
                return {
                  x: tooltipX,
                  y: tooltipY
                };
              }
            }
          },
          size: {
            height: 100
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
            tickLength: 0
          },
          series: student_completion_data_series
        }

        var quiz_xaxis_categories = []
        Object.keys(scope.moduledata.online_quiz).forEach(function(quiz_data_list) {
          Object.keys(scope.moduledata.online_quiz[quiz_data_list]).forEach(function(quiz_data) {
            quiz_xaxis_categories.push('<b>' + scope.moduledata.online_quiz[quiz_data_list][quiz_data]['lecture_name'] + ": </b>" + scope.moduledata.online_quiz[quiz_data_list][quiz_data]['quiz_name'])
            Object.keys(scope.moduledata.online_quiz[quiz_data_list][quiz_data]['data']).forEach(function(quiz_bar) {
              if (quiz_bar == 'review_vote') {
                quiz_completion_data_series[quiz_bar].data.push(scope.moduledata.online_quiz[quiz_data_list][quiz_data]['data'][quiz_bar] * -1)
              } else {
                quiz_completion_data_series[quiz_bar].data.push(scope.moduledata.online_quiz[quiz_data_list][quiz_data]['data'][quiz_bar])
              }
            })
            if (scope.moduledata.online_quiz[quiz_data_list][quiz_data].type == 'quiz') {
              quiz_completion_data_series['survey_solved'].data.push(0)
            } else {
              quiz_completion_data_series['tried_not_correct'].data.push(0)
              quiz_completion_data_series['tried_correct_finally'].data.push(0)
              quiz_completion_data_series['correct_first_try'].data.push(0)
              quiz_completion_data_series['not_checked'].data.push(0)
            }
          })
        })

        ////////////////////  quiz and grades main pages
        scope.quiz_completion_chart_config = {
          options: {
            chart: {
              type: 'column',
              events: {
                load: function() {
                  this.myTooltip = new Highcharts.Tooltip(this, this.options.tooltip);
                },
                spacing: [0, 0, 0, 0],
                margin: [0, 0, 10, 0]
              }
            },
            plotOptions: {
              series: {
                stacking: 'normal',
              },
              column: {
                events: {
                  click: function(evt) {
                      evt.stopPropagation()
                      this.chart.myTooltip.refresh([evt.point], evt);
                      var that = this
                      $(document).click(function(){
                        that.chart.myTooltip.hide(100)
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
            }
          },
          size: {
            height: 220
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
            tickLength: 0
          },
          series: quiz_completion_data_series
        }

        scope.goTo = function(state, course_id, group_id, item_id) {
          $state.go(state, { course_id: course_id, module_id: group_id, item_id: item_id})
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
                height: (quiz_data.data['review_vote']>0)? 150 : 130
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
                name: "Never Tried",
                data: [quiz_data.data['never_tried']],
                color: "#a4a9ad" //silver
              }, {
                showInLegend: false,
                name: "Not Checked",
                data: [quiz_data.data['not_checked']],
                color: "#551a8b" //purble
              }, {
                showInLegend: false,
                name: "Tried, Not Correct",
                data: [quiz_data.data['tried_not_correct']],
                color: "#E66726" //Orange:
              }, {
                showInLegend: false,
                name: "Tried, Correct Finally",
                data: [quiz_data.data['tried_correct_finally']],
                color: "#BADAA5" //Pale Green:
              }, {
                showInLegend: false,
                name: "Correct First Try",
                data: [quiz_data.data['correct_first_try']],
                color: "#16A53F" // Green
              }, {
                showInLegend: false,
                name: "Voted For Review",
                data: [quiz_data.data['review_vote']*-1],
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
                  type: 'column' ,
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

          var tooltip_template = "<div style='width:460px; height:160px'>" +
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
              scope.goTo('course.module.progress', scope.moduledata.course_id, scope.moduledata.id, "vq_"+quiz_id)
            })
          })

          return $("#quiz_bar").html()
        }

      }
    };
  }]);
