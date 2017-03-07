'use strict';

angular.module('scalearAngularApp')
  .directive('teacherModuleSummary', ['ScalearUtils', '$filter', '$translate', '$state','CourseEditor', function(ScalearUtils, $filter, $translate, $state,CourseEditor) {
    return {
      scope: {
        moduledata: '='
      },
      replace: true,
      templateUrl: "/views/teacher/progress/teacher_module_summary.html",
      link: function(scope, elem) {
        var unwatch = scope.$watch("moduledata.duration",function(val){
          if(val){
            scope.moduledata.hour_min = ScalearUtils.toHourMin(scope.moduledata.duration)
            scope.moduledata.time_left_string = ScalearUtils.toHourMin(scope.moduledata.due_date).split(":")[0]
            scope.moduledata.due_date_enabled = !CourseEditor.isDueDateDisabled(scope.moduledata.due_date_string)
            // console.log(scope.moduledata.due_date_enabled)
            scope.subtitle = scope.moduledata.hour_min + " " +
              $translate.instant('time.hours') + ", " +
              scope.moduledata.quiz_count + " " +
              $translate.instant('global.quizzes') + ", " +
              scope.moduledata.survey_count + " " +
              $translate.instant('global.surveys') + ". "

            if(scope.moduledata.due_date_enabled){
              scope.subtitle +=  $translate.instant('events.due') + " " +
              $filter('date')(new Date(scope.moduledata.due_date_string), 'dd-MMMM-yyyy') + " " +
              $translate.instant('global.at') + " " +
              $filter('date')(new Date(scope.moduledata.due_date_string), 'HH:mm') + "."
            }
            else{
              scope.subtitle += $translate.instant('global.no') + " " + $translate.instant('editor.details.due_date')
            }

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
                color: "#1bca4d" //Pale Green:
              },
              less_than_50: {
                text: "Less than 50%",
                color: "#F5C09E" //Pale Orange
              },
              not_watched: {
                text: "Not Started",
                color: "#a4a9ad" //silver
              },
              completed_late: {
                text: "Late",
                color: "#1bca4d" //Pale Green:
              },
              more_than_80: {
                text: "More than 80%",
                color: "#E66726" //Orange
              },
              between_50_80: {
                text: "Between 50% & 80%",
                color: "#800000" //dark Orange
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
                  margin: [0, 0, 0, 0],
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
                    var tooltipY = point.plotY + 10;

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
                height: 50
                // width: elem.width()
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

            unwatch()
          }
        })

        scope.goTo = function(state, course_id, group_id, item_id) {
          $state.go(state, { course_id: course_id, module_id: group_id, item_id: item_id })
        }

      }
    };
  }])
  .directive('teacherOnlineQuizSummary', ['$state', '$compile', '$timeout','$rootScope', function($state, $compile, $timeout, $rootScope) {
    return {
      scope: {
        moduledata: '='
      },
      replace: true,
      templateUrl: "/views/teacher/progress/teacher_online_quiz_summary.html",
      link: function(scope, elem) {
        scope.width_online_quiz = 100


        var quiz_completion_data_series = {
          never_tried: {
            name: "Never tried",
            data: [],
            color: "#a4a9ad" //silver
          },
          survey_solved: {
            name: "Solved",
            data: [],
            color: "#355BB7" //blue
          },
          not_checked: {
            name: "Not checked",
            data: [],
            color: "#551a8b" //purble
          },
          not_correct_many_tries: {
            name: "Incorrect (final try)",
            data: [],
            color: "#E66726" //Orange:
          },
          not_correct_first_try: {
            name: "Incorrect (first try)",
            data: [],
            color: "#ED9467" //Orange:
          },
          tried_correct_finally: {
            name: "Correct (final try)",
            data: [],
            color: "#1bca4d" //Pale Green:
          },
          correct_first_try: {
            name: "Correct (first try)",
            data: [],
            color: "#16A53F" // Green
          },
          review_vote: {
            name: "Voted for review",
            data: [],
            color: "#f5c343" //yellow:
          }
        }

        var quiz_xaxis_categories = []

        var unwatch = scope.$watch("moduledata.online_quiz",function(val){
          if(val){
            if (scope.moduledata.online_quiz.length < 20){
              scope.width_online_quiz = scope.moduledata.online_quiz.length * 5
            }

            scope.moduledata.online_quiz.forEach(function(video_quiz) {
              Object.keys(video_quiz).forEach(function(id) {
                quiz_xaxis_categories.push('<b>' + video_quiz[id]['lecture_name'] + ": </b>" + video_quiz[id]['quiz_name'])
                Object.keys(video_quiz[id]['data']).forEach(function(quiz_bar) {
                  if (quiz_bar == 'review_vote') {
                    scope.review_vote_exist = scope.review_vote_exist || (video_quiz[id]['data'][quiz_bar] > 0)
                    quiz_completion_data_series[quiz_bar].data.push(video_quiz[id]['data'][quiz_bar] * -1)
                  }
                  else if ( video_quiz[id]['data'][quiz_bar] == 'null') {
                    quiz_completion_data_series[quiz_bar].data.push(null)
                  }
                  else {
                    if (video_quiz[id]['inclass']) {
                     quiz_completion_data_series[quiz_bar].data.push( { y: video_quiz[id]['data'][quiz_bar] , borderColor:'black' , borderWidth:1 } )
                    }
                    else{
                      quiz_completion_data_series[quiz_bar].data.push( {y:video_quiz[id]['data'][quiz_bar]} )
                    }
                  }
                })
                if (video_quiz[id].type == 'quiz') {
                  quiz_completion_data_series['survey_solved'].data.push(null)
                } else {
                  quiz_completion_data_series['not_correct_many_tries'].data.push(null)
                  quiz_completion_data_series['not_correct_first_try'].data.push(null)
                  quiz_completion_data_series['tried_correct_finally'].data.push(null)
                  quiz_completion_data_series['correct_first_try'].data.push(null)
                  quiz_completion_data_series['not_checked'].data.push(null)
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
                  margin: scope.review_vote_exist? [0, 0, 0, 0] : [0, 0, 30, 0]
                },
                plotOptions: {
                  series: {
                    stacking: 'normal',
                    // states: {
                    //     hover: {
                    //         enabled: false
                    //     }
                    // }                    
                  },
                  column: {
                    // states:{
                      // hover: {
                        // borderColor: "#ffffff"
                      // }
                    // },
                    pointWidth: 20,
                    borderWidth: 0 ,
                    // allowPointSelect: true,
                    events: {
                      click: function(evt) {
                        evt.stopPropagation()
                        this.chart.quiz_tooltip.refresh([evt.point], evt);

                        var that = this
                        $(document).click(function() {
                          that.chart.quiz_tooltip.hide(0)
                          $(document).off('click');
                        })

                        scope.$on("hide_tooltip",function(){
                          that.chart.quiz_tooltip.hide(0)
                        })

                      }
                    }
                  }
                },
                legend: { enabled: false },
                tooltip: {
                  borderColor: '#000000',
                  shared: true,
                  useHTML: true,
                  enabled: true,
                  backgroundColor: "white",
                  formatter: quizTooltipFormatter,
                  positioner: function(labelWidth, labelHeight, point) {
                    var tooltipX = point.plotX - (labelWidth / 2)
                    var tooltipY =  100
                    if (tooltipX < 0) {
                      tooltipX = 0
                    }
                    if($('#teacher_completion').width() < point.plotX+(labelWidth)){
                      tooltipX = $('#teacher_completion').width() - (labelWidth *1.025)
                    }
                    return {
                      x: tooltipX,
                      y: tooltipY
                    }
                  }
                }
              },
              size: {
                height:  125
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
            unwatch()
          }
        })

        function quizTooltipFormatter() {
          var quiz_only_one_bar_config = {}
          var quiz = scope.moduledata.online_quiz[this.points[0].point.index]
          var quiz_id = Object.keys(quiz)[0]
          var quiz_data = quiz[quiz_id]
          var quiz_type = quiz_data.type
          var xaxis_categories = []

          if(scope.title && scope.title.indexOf(this.x) !== -1){
            $timeout(function (argument) {
              $(".gotToQuizButton").click(function() {
              scope.goTo('course.module.progress', scope.moduledata.course_id, scope.moduledata.id, "vq_" + quiz_id)
            })
            $(".gotToQuizButtonReview").click(function() {
              $rootScope.$broadcast("scroll_to_item_summary", "vq_" + quiz_id)
            })
            })
            return $("#quiz_bar").html()
          }
          scope.$emit("hide_tooltip")
          scope.title = this.x;
          if(quiz_data['inclass']){
            scope.title = "<b>In-Class Question: </b>" + this.x;
          }
          if(quiz_data['distance_peer']){
            scope.title = "<b>Distance-Peer Question: </b>" +this.x;
          }
          scope.left = '';
          if (quiz_type == 'quiz') { ////////////////////  Quiz bar tooltip

            quiz_only_one_bar_config = {
              chart: {
                renderTo: null,
                type: 'column',
                spacing: [0, 0, 0, 0],
                margin: [0, 0, 1, 0],
                width: 70,
                height: (quiz_data.data['review_vote'] > 0) ? 150 : 130
              },
              plotOptions: {
                series: { stacking: 'normal', animation: false }, 
                column: {borderWidth: 0 ,},
             },
              legend: { reversed: true },
              title: { text: null },
              credits: {enabled: false},
              xAxis: {
                categories: null,
                gridLineWidth: 0,
                labels: {
                  useHTML: true,
                  enabled: false
                },
                lineColor: 'transparent',
                // labels: { enabled: false },
                lineWidth: 0,
                minorGridLineWidth: 0,
                // lineColor: 'transparent',
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
                labels: { enabled: false }
              },
              series: [{
                showInLegend: false,
                name: "Never tried",
                data: [quiz_data.data['never_tried']],
                color: "#a4a9ad" //silver
              }, {
                showInLegend: false,
                name: "Not checked",
                data: [quiz_data.data['not_checked']],
                color: "#551a8b" //purble
              }, {
                showInLegend: false,
                name: "Incorrect (final try)",
                data: [quiz_data.data['not_correct_many_tries']],
                color: "#E66726" //Orange:
              }, {
                showInLegend: false,
                name: "Incorrect (first try)",
                data: [quiz_data.data['not_correct_first_try']],
                color: "#ED9467" //Orange:
              }, {
                showInLegend: false,
                name: "Correct (final try)",
                data: [quiz_data.data['tried_correct_finally']],
                color: "#1bca4d" //Pale Green:
              }, {
                showInLegend: false,
                name: "Correct (first try)",
                data: [quiz_data.data['correct_first_try']],
                color: "#16A53F" // Green
              }, {
                showInLegend: false,
                name: "Voted for review",
                data: [quiz_data.data['review_vote'] * -1],
                color: "#f5c343" //yellow:
              }]
            }

            scope.left += "<div style='margin-bottom: 26px;'> "
            quiz_only_one_bar_config.series.forEach(function(quiz) {
              var count = Math.abs(quiz.data[0])
              if (quiz.data[0] != "null"){
                if(quiz.name == 'Voted for review'){
                  scope.left += '</div><div><b>' + count + "  (" + Math.round((count / scope.moduledata.students_count) * 100) + '%)     ' + '<span style="color:' + quiz.color + '">' + quiz.name + '</span></b></div>'
                }
                else{
                  scope.left += '<div><b>' + count + "  (" + Math.round((count / scope.moduledata.students_count) * 100) + '%)     ' + '<span style="color:' + quiz.color + '">' + quiz.name + '</span></b></div>'
                }

              }
            });

            var tooltip_template = "<div class='dashboard' style='width:460px; height:100%'>" +
              "<div ng-bind-html='title' class='row collapse'></div>" +
              "<div class='row collapse' style='width:420px; height:100%'>"+
                  "<div class='small-2 columns no-padding'>" +
                    "<div id='custom_chart' ></div>" +
                  "</div>" +
                  "<div style='padding-top: 40px;' class='small-10 columns'>" +
                    "<div ng-bind-html='left' style='font-size:12px'>" +
                      // "<div  >" +
                    "</div>" +
                  "</div>" +
                "</div>" +
              "<div ng-show='moduledata.review_page_trigger' style='bottom: 0px;position: absolute;right: 10px;'><a class='button left tiny green module-review gotToQuizButtonReview' style='pointer-events: visible;margin-bottom: 0;margin-top: 10px; color:white;' translate>dashboard.review_quiz</a></div>" +
              "<div ng-hide='moduledata.review_page_trigger' style='bottom: 0px;position: absolute;right: 10px;'><a class='button left tiny green module-review gotToQuizButton' style='pointer-events: visible;margin-bottom: 0;margin-top: 10px;' translate>dashboard.review_quiz</a></div>" +
              "</div>"

          } else { ///// SURVEY TOOLTIP
            // scope.title = this.x;
            // scope.left = '';

            var answer_data = []
            var xaxis_categories = []
            scope.left += '<br/><b>' + this.points[0].y + "  (" + Math.round(this.points[0].percentage) + '%)     ' + '<span >' + this.points[0].series.name + '</span></b>'

            Object.keys(quiz_data.answer).forEach(function(answer) {
              answer_data.push(quiz_data.answer[answer]);
              xaxis_categories.push(answer)
              scope.left += '<br/><b>' + quiz_data.answer[answer] + "  (" + Math.round((quiz_data.answer[answer] / scope.moduledata.students_count) * 100)+ '%)     ' + '<span >' + answer + '</span></b>'
            });

            ////////////////////  Survey bar tooltip
            quiz_only_one_bar_config = {
              chart: {
                type: 'column',
                spacing: [0, 0, 0, 0],
                margin: [0, 0, 1, 0],
                width: 150,
                height: 130
              },
              plotOptions: { series: { stacking: 'normal', animation: false } },
              legend: { reversed: true },
              title: { text: null },
              credits: {enabled: false},
              xAxis: {
                categories: xaxis_categories,
                gridLineWidth: 0,
                labels: {
                  useHTML: true,
                  enabled: false
                },
                lineColor: 'transparent',
                lineWidth: 0,
                minorGridLineWidth: 0,
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
                labels: { enabled: false }
              },
              series: [{
                showInLegend: false,
                data: answer_data,
                color: "#355BB7" //silver
              }]
            }

            var tooltip_template = "<div class='dashboard' style='width:500px; height:100%; min-height:164px'>" +
              "<div ng-bind-html='title' class='row collapse'></div>" +
              "<div class='row collapse' style='width:400px; height:100%'>"+
                  "<div class='small-5 columns no-padding'>" +
                    "<div id='custom_chart' ></div>" +
                  "</div>" +
                  "<div style='padding-top: 40px;' class='small-7 columns'>" +
                    "<div ng-bind-html='left' style='font-size:12px'>" +
                      // "<div  >" +
                    "</div>" +
                  "</div>" +
                "</div>" +
              "</div>" +
              // "<div class='row collapse'>"+
              "<div ng-show='moduledata.review_page_trigger' style='bottom: 0px;position: absolute;right: 10px;'><a class='button left tiny green module-review gotToQuizButtonReview' style='pointer-events: visible;margin-bottom: 0;margin-top: 10px; color:white' translate>dashboard.review_quiz</a></div>" +
              "<div ng-hide='moduledata.review_page_trigger' style='bottom: 0px;position: absolute;right: 10px;'><a class='button left tiny green module-review gotToQuizButton' style='pointer-events: visible;margin-bottom: 0;margin-top: 10px;' translate>dashboard.review_quiz</a>"+
              // "</div>" +
              "</div>"            
          }

          $("#quiz_bar").html(tooltip_template)
          $compile($("#quiz_bar"))(scope)
          scope.$digest();

          $timeout(function() {
            quiz_only_one_bar_config.chart.renderTo = $("#quiz_bar #custom_chart")[0]
            Highcharts.chart(quiz_only_one_bar_config)

            $(".gotToQuizButton").click(function() {
              scope.goTo('course.module.progress', scope.moduledata.course_id, scope.moduledata.id, "vq_" + quiz_id)
            })
            $(".gotToQuizButtonReview").click(function() {
              $rootScope.$broadcast("scroll_to_item_summary", "vq_" + quiz_id)
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
      templateUrl: "/views/teacher/progress/teacher_discussion_summary.html",
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

        var unwatch = scope.$watch("moduledata.due_date_string",function(val){
          if(val){
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

            unwatch()
          }
        })

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

        scope.online_quiz_color = {}
        scope.online_quiz_group_color = {}
        var complete_the_video = "(Please complete this video)"
        scope.quiz_completion_data_series = {
          group_never_tried: {
            name: "Your <b>group</b> answer is shown on top.",
            color: "#a4a9ad" //silver
          },
          group_survey_solved: {
            name: "You solved group survey.",
            color: "#355BB7" //blue
          },
          group_not_checked: {
            name: "Your <b>group</b> answer is not checked.",
            color: "#551a8b" //purble
          },
          group_tried_not_correct_first: {
            name: "Your <b>group</b> answer was <span style='color:#ED9467'>incorrect</span>, you tried once.",
            color: "#ED9467" //Orange:
          },
          group_tried_not_correct_finally: {
            name: "Your <b>group</b> answer was <span style='color:#E66726'>incorrect</span>, you tried more than once.",
            color: "#E66726" //Orange:
          },
          group_tried_correct_finally: {
            name: " Your <b>group</b> answer was <span style='color:#1bca4d'>correct</span> but not on the first try.",
            color: "#1bca4d" //Pale Green:
          },
          group_correct_first_try: {
            name: " Your <b>group</b> answer was <span style='color:#16A53F'>correct</span> on the first try .",
            color: "#16A53F" // Green
          },
          self_never_tried: {
            name: "You did not answer this quiz.",
            group_name: "Your <b>individual</b> answer is shown below.",
            color: "#a4a9ad" //silver
          },
          self_survey_solved: {
            name: "You <span style='color:#355BB7'>answered this survey</span>.",
            group_name: "You answered <b>individual<b/> survey,",
            color: "#355BB7" //blue
          },
          self_not_checked: {
            name: "You have tried this quiz, but your answer has not been checked by the teacher.",
            group_name: "You have tried this quiz, but your <b>invdividual</b> answer has not been checked by the teacher.",
            color: "#551a8b" //purble
          },
          self_tried_not_correct_first: {
            name: "You have tried this quiz once, but have <span style='color:#ED9467'>not gotten the answer correct</span>.",
            group_name: "Your <b>individual</b> answer was <span style='color:#ED9467'>incorrect</span>, you tried once.",
            color: "#ED9467" //Orange:
          },
          self_tried_not_correct_finally: {
            name: "You have tried this quiz more than once, but have <span style='color:#E66726'>not gotten the answer correct</span>.",
            group_name: "Your <b>individual</b> answer was <span style='color:#E66726'>incorrect</span>, you tried only once.",
            color: "#E66726" //Orange:
          },
          self_tried_correct_finally: {
            name: "You got the answer correct, but <span style='color:#1bca4d'> not on the first try.</span>.",
            group_name: "Your <b>individual</b> answer was <span style='color:#1bca4d'>correct</span> but not on the first try,",
            color: "#1bca4d" //Pale Green:
          },
          self_correct_first_try: {
            name: "You got the answer <span style='color:#16A53F'>correct</span> on the first try.",
            group_name: "Your <b>individual</b> answer was <span style='color:#16A53F'>correct</span> on the first try,",
            color: "#16A53F" // Green
          }
        }

        var unwatch = scope.$watch("moduledata.remaining_duration", function(val){
          if(val != null){
            scope.remaining = 'Remaining: ' + ScalearUtils.toHourMin(scope.moduledata.remaining_duration) + " " +
              $translate.instant('time.hours') + ", " + scope.moduledata.remaining_quiz + " " + $translate.instant('global.quizzes') + ", " +
              scope.moduledata.remaining_survey + " " + $translate.instant('global.surveys') + ". "

            scope.group_width = (1 / scope.moduledata['online_quiz_count']) * 100

            scope.quiz_completion_bar = { "width": scope.moduledata['online_quiz_count'] * 5 }
            if (scope.quiz_completion_bar["width"] > 100) {
              scope.quiz_completion_bar["width"] = 100
            }
            scope.quiz_completion_bar["width"] += "%"

            scope.online_popover = {}
            scope.online_quiz_name = {}
            scope.content = {}
            var online_quiz_index = 0

            scope.moduledata.module_completion.forEach(function(item) {
              item.completion_style = {
                "position": "relative",
                "width": item['duration'] + "%",
                "background": "linear-gradient(to right, #16A53F " + item['percent_finished'] + "%, #a4a9ad 0%)"
              }
              item.item_style = {}
              item.quiz_bar_style = {}

              if (item.type == 'lecture') {
                item.item_style["width"] = scope.group_width * item['online_quizzes'].length + "%"
                item.quiz_bar_style["width"] = 100 / item['online_quizzes'].length + "%"

                item['online_quizzes'].forEach(function(online_quiz) {
                  scope.online_quiz_name[online_quiz.id] = "<b>"+item.item_name+ "</b>: "+ online_quiz['quiz_name']
                  if( online_quiz['required']  &&  ( online_quiz['data'][0] ==  'self_never_tried' ) ){
                    scope.online_quiz_name[online_quiz.id] = complete_the_video
                  }
                  if(online_quiz['inclass']){
                    scope.online_quiz_name[online_quiz.id] = "<b>"+item.item_name+ "</b>: <b>In-Class Question: </b>" + scope.online_quiz_name[online_quiz.id]
                  }
                  if(online_quiz['distance_peer']){
                    scope.online_quiz_name[online_quiz.id] = "<b>"+item.item_name+ "</b>: <b>Distance-Peer Question: </b>" + scope.online_quiz_name[online_quiz.id]
                  }

                  if (online_quiz['data'].length == 2) {
                    scope.online_quiz_color[online_quiz.id] = {
                      "backgroundColor": scope.quiz_completion_data_series[online_quiz['data'][0]].color
                    }
                    scope.online_quiz_group_color[online_quiz.id] = {
                      "backgroundColor": scope.quiz_completion_data_series[online_quiz['data'][1]].color
                    }
                    scope.content[online_quiz.id] ={}
                    scope.content[online_quiz.id] ={}
                    scope.content[online_quiz.id][0] = scope.quiz_completion_data_series[online_quiz['data'][0]].group_name
                    scope.content[online_quiz.id][1] = scope.quiz_completion_data_series[online_quiz['data'][1]].name

                  } else {
                    // console.log(scope.quiz_completion_data_series[online_quiz['data'][0]])
                    // console.log(online_quiz['data'][0])
                    scope.online_quiz_color[online_quiz.id] = {
                      "backgroundColor": scope.quiz_completion_data_series[online_quiz['data'][0]].color
                    }
                    scope.content[online_quiz.id] = scope.quiz_completion_data_series[online_quiz['data'][0]].name
                  }
                  scope.retry_quiz = 'Click to re-try this quiz.'
                  scope.online_popover[online_quiz['id']] = {
                    title: "<span style='font-size:12px;' ng-bind-html='online_quiz_name[online_quiz.id]' ></span> ",
                    content: "<div ng-bind-html='content[online_quiz.id]' style='margin-bottom: 10px;font-size:12px;'></div><div ng-if=\"quiz_completion_data_series[online_quiz['data'][0]].color != '#a4a9ad' \">Click to re-try this quiz.</div> " ,
                      // "<div class='right' style='bottom: 10px;right: 10px;'>" +
                      // "<a class='button left tiny green module-review ' style='pointer-events: visible;margin-bottom: 0;margin-top: 10px;margin-bottom:10px' ng-click='goTo(moduledata.course_id, moduledata.id, online_quiz.lecture_id, online_quiz.time)' translate>dashboard.try_again</a>"+
                      // "</div>",
                    html: true,
                    trigger: 'hover',
                    placement: 'bottom',
                    container: '#student_popover'
                  }
                  if( online_quiz['data'].length == 2 ){
                    scope.online_popover[online_quiz['id']].content =
                    "<div class='row collapse' style='height: 135px;width: 100%;'>" +
                      "<div style='height: 45px;width: 100%;' >"+
                        "<div style='width: 10%;margin-right: 10px;float: left;' ng-style='online_quiz_group_color[online_quiz.id]'  class='quiz-inner-bar'></div>"+
                        "<div  ng-bind-html='content[online_quiz.id][1]' style='font-size:12px;'></div>"+
                      "</div>"+
                      "<div style='height: 45px;width: 100%;margin-top: 2px'>"+
                        "<div style='width: 10%;margin-right: 10px;float: left;' ng-style='online_quiz_color[online_quiz.id]'  class='quiz-inner-bar'></div>"+
                        "<div  ng-bind-html='content[online_quiz.id][0]' style='font-size:12px;'></div>"+
                      "</div><div>Click to re-try this quiz.</div>"+
                      // "<div class='right' style='bottom: 10px;right: 10px;'>" +
                      //   "<a class='button left tiny green module-review ' style='pointer-events: visible;margin-bottom: 0;margin-top: 10px;margin-bottom:10px' ng-click='goTo(moduledata.course_id, moduledata.id, online_quiz.lecture_id, online_quiz.time)' translate>dashboard.try_again</a>"+
                      // "</div>"+
                    "</div>"
                  }
                  // console.log(( online_quiz_index  * (1.0 / scope.moduledata['online_quiz_count']) )  )
                  // if ( ( online_quiz_index  * (1.0 / scope.moduledata['online_quiz_count']) )  < 0.4) {
                  //   scope.online_popover[online_quiz['id']]['placement'] = 'right'
                  // }
                  online_quiz_index += 1
                })
              }
            })
            unwatch()
          }
        })

        scope.lectureTooltip = function(item) {
          item.item_style["border"] = "2px solid #000000"
          item.completion_style["border"] = "2px solid #000000"
          item.show_tooltip=true
        }

        scope.lectureTooltipLeave = function(item) {
          item.completion_style["border"] = "1px solid #EFE7E7"
          item.item_style["border"] = 'none'
          item.show_tooltip=false
        }



        scope.goTo = function(state , course_id, group_id, lecture_id, time , online_quiz) {
          if ( !(online_quiz['required']  &&  ( online_quiz['data'][0] ==  'self_never_tried')) ) {
            $state.go(state , { course_id: course_id, module_id: group_id, lecture_id: lecture_id, time: time }, { time: time })
          }
        }

        scope.goToLectureQuiz = function(course_id, group_id, id, type) {
          if(type == 'lecture'){
            $state.go("course.module.courseware.lecture", { course_id: course_id, module_id: group_id, lecture_id: id})
          }
          else{
            $state.go("course.module.courseware.quiz", { course_id: course_id, module_id: group_id, quiz_id: id})
          }
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
