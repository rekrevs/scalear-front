'use strict';

angular.module('scalearAngularApp')
  .directive('dashboardCalendar', ['ErrorHandler','ScalearUtils','$filter','$translate','$state','$compile', '$timeout', function(ErrorHandler,ScalearUtils,$filter,$translate,$state,$compile, $timeout) {
    return {
      scope: {
        moduledata: '='
      },
      replace: true,
      templateUrl: "/views/dashboard_calendar.html",
      link: function(scope) {
        console.log(scope.moduledata)
        scope.moduledata.hour_min = ScalearUtils.toHourMin(scope.moduledata.duration)
        scope.moduledata.time_left_string = ScalearUtils.toHourMin(scope.moduledata.due_date)
        scope.subtitle = scope.moduledata.hour_min +" " + $translate.instant('time.minutes')+", "+scope.moduledata.quiz_count+" " + $translate.instant('global.quizzes')+", "+
                        scope.moduledata.survey_count + " " + $translate.instant('global.surveys')+". "+$translate.instant('events.due')+" "+ $filter('date')(new Date(scope.moduledata.due_date_string), 'dd-MMMM-yyyy')+" "+$translate.instant('global.at')+" "+ $filter('date')(new Date(scope.moduledata.due_date_string), 'HH:mm')
        scope.student_completion_options ={
              on_time:{
                text:"On-time",
                color:"#16A53F"// Green
              } ,
              late:{
                text:"Late",
                color:"#E66726" //Orange: 
              } ,
              incomplete:{
                text:"Incomplete",
                color:"#a4a9ad" //silver
              },
              completed:{
                text: "Complete",
                color:"#16A53F"//Green: 
              },
              more_than_50:{
                text: "more than 50%",
                color: "#BADAA5" //Pale Green: 
              },
              less_than_50:{
                text: "less than 50%",
                color:"#F5C09E" //Pale Orange 
              },
              not_watched:{
                text: "Not Started",
                color:"#a4a9ad" //silver
              }
        }
        var quiz_completion_data_series ={
            never_tried:{
              name: "Never Tried",
              data: [] ,
              color:"#a4a9ad" //silver
            },
            survey_solved:{
              name: "Solved",
              data: [] ,
              color:"#355BB7" //blue 
            },
            not_checked:{
              name: "Not Checked",
              data: [] ,
              color:"#551a8b" //purble                
            },
            tried_not_correct:{
              name:"Tried, Not Correct",
              data: [] ,
              color:"#E66726" //Orange: 
            },
            tried_correct_finally:{
              name:"Tried, Correct Finally",
              data: [] ,
              color:"#BADAA5"//Pale Green: 
            } ,
            correct_first_try:{
              name:"Correct First Try",
              data: [] ,
              color:"#16A53F"// Green
            } ,
            review_vote:{
              name: "Voted For Review",
              data: [] ,
              color: "#ccc66c" //yellow: 
            }
        }


        var student_completion_data_series = []
        Object.keys(scope.moduledata.students_completion).forEach(function(student_key) {
          var bar = {
            name: scope.student_completion_options[student_key].text ,
            data: [ scope.moduledata.students_completion[student_key] ] ,
            color:  scope.student_completion_options[student_key].color
          }            
          student_completion_data_series.push(bar)
        })


////////////////////  student_completion main pages
        scope.student_completion_chart_config = {
          options:{
            chart: {
              type: 'bar'
            },
            plotOptions: {
              series: {
                stacking: 'normal'              }
            },
            legend: {
              reversed: true
            },
            tooltip: {
                formatter: function() {
                    return '<b style="color:'+this.series.color+'">' + this.series.name  + '</b> (' + this.y + ' of '+ scope.moduledata.students_count +')';
                },
                positioner: function(labelWidth, labelHeight, point) {
                    var tooltipX = ( (point.plotX - labelWidth)  + labelWidth) / 2 ;
                    var tooltipY = point.plotY + 30;
                    return {
                        x: tooltipX,
                        y: tooltipY
                    };
                }
            }
          },
          size: {
           height: 130
          },
          title: {text: null},
          xAxis: {
            categories: null,
            gridLineWidth: 0,
            labels:{enabled: false}
          },
          yAxis: {
            title: {text: null},
            gridLineWidth: 0,
            labels:{enabled: false}
          },
          series: student_completion_data_series
        }

        var quiz_xaxis_categories = []
        Object.keys(scope.moduledata.online_quiz).forEach(function(quiz_data_list) {
          Object.keys(scope.moduledata.online_quiz[quiz_data_list]).forEach(function(quiz_data) {
            quiz_xaxis_categories.push( '<b>'+scope.moduledata.online_quiz[quiz_data_list][quiz_data]['lecture_name'] +": </b>"+ scope.moduledata.online_quiz[quiz_data_list][quiz_data]['quiz_name'])
            Object.keys(scope.moduledata.online_quiz[quiz_data_list][quiz_data]['data']).forEach(function(quiz_bar){
              if (quiz_bar == 'review_vote'){
                quiz_completion_data_series[quiz_bar].data.push(scope.moduledata.online_quiz[quiz_data_list][quiz_data]['data'][quiz_bar] * -1)              
              }
              else{
                quiz_completion_data_series[quiz_bar].data.push(scope.moduledata.online_quiz[quiz_data_list][quiz_data]['data'][quiz_bar])              
              }
            })
            if(scope.moduledata.online_quiz[quiz_data_list][quiz_data].type == 'quiz'){
              quiz_completion_data_series['survey_solved'].data.push(0)              
            }
            else{
              quiz_completion_data_series['tried_not_correct'].data.push(0)              
              quiz_completion_data_series['tried_correct_finally'].data.push(0)              
              quiz_completion_data_series['correct_first_try'].data.push(0)              
              quiz_completion_data_series['not_checked'].data.push(0)              
            }
          })
        })


////////////////////  quiz and grades main pages
        scope.quiz_completion_chart_config = {
          options:{
            chart: {
              type: 'column',
              events : {
                 load: function() {
                    this.myTooltip = new Highcharts.Tooltip(this, this.options.tooltip);
                }
              }
            },
            plotOptions: {
              series: {
                stacking: 'normal',
              },
              column:{
                events: {
                  click: function(evt) {
                    this.chart.myTooltip.refresh([evt.point], evt);
                  },
                }
              }
            },
            legend: {reversed: true},
            tooltip: {
              shared: true ,
              useHTML: true,
              enabled: false,
              formatter: function() {
                  var quiz = scope.moduledata.online_quiz[this.points[0].point.index][Object.keys(scope.moduledata.online_quiz[this.points[0].point.index])[0]]
                  var quiz_type = quiz.type
                  var xaxis_categories = []
                  if( quiz_type  == 'quiz' ){
                  ////////////////////  Quiz bar tooltip 
                    scope.quiz_only_one_bar_config = {
                      options:{
                        chart: {type: 'column'},
                        plotOptions: {series: {stacking: 'normal',animation: false}},
                        legend: {reversed: true},
                      },
                      size: {
                        width: 125,
                        height: 200},
                      title: {text: null},
                      xAxis: {
                        categories: null,
                        gridLineWidth: 0,
                        labels:{
                          useHTML:true,
                          enabled: false
                        },
                        lineColor: 'transparent'

                      },
                      yAxis: {
                        // opposite:true,
                        title: {text: null},
                        gridLineWidth: 0,
                        plotLines: [{
                            color: 'black',
                            width: 1,
                            value: 0
                        }],
                        labels:{enabled: false}
                      },                      
                      series: [{
                          showInLegend: false,               
                          name: "Never Tried",
                          data: [quiz.data['never_tried']] ,
                          color:"#a4a9ad" //silver
                        },{
                          showInLegend: false,               
                          name: "Not Checked",
                          data: [quiz.data['not_checked']] ,
                          color:"#551a8b" //purble                
                        },{
                          showInLegend: false,               
                          name:"Tried, Not Correct",
                          data: [quiz.data['tried_not_correct']] ,
                          color:"#E66726" //Orange: 
                        },{
                          showInLegend: false,               
                          name:"Tried, Correct Finally",
                          data: [quiz.data['tried_correct_finally']] ,
                          color:"#BADAA5"//Pale Green: 
                        },{
                          showInLegend: false,               
                          name:"Correct First Try",
                          data: [quiz.data['correct_first_try']] ,
                          color:"#16A53F"// Green
                        },{
                          showInLegend: false,               
                          name: "Voted For Review",
                          data: [quiz.data['review_vote']] ,
                          color: "#ccc66c" //yellow: 
                        }

                      ]
                    }
                    scope.title =  this.x +"<br/>";
                    scope.left =  '';

                    // $.each(this.points, function(i, point) {
                    //     scope.left += '<br/>'+ Math.abs(point.y) +"  ("+point.percentage.toFixed(2)+'%)     '+'<span style="color:'+point.color+'">' + point.series.name +'</span>'
                    //     // ng-click="goTo('+scope.course.module.progress+' , '+moduledata.course_id+','+moduledata.id'+)"  ;
                    // });
                    scope.quiz_only_one_bar_config.series.forEach(function(quiz){
                      scope.left += '<br/>'+ quiz.data[0] +"  ("+( (quiz.data[0] / scope.moduledata.students_count )*100).toFixed(2)+'%)     '+'<span style="color:'+quiz.color+'">' + quiz.name +'</span>'
                    });                    
                  }
                  else{///// SURVEY TOOLTIP
                    scope.title =  this.x +"<br/>";
                    scope.left =  '';

                    var answer_data = []
                    var xaxis_categories = []
                    scope.left += '<br/>'+ this.points[0].y +"  ("+this.points[0].percentage.toFixed(2)+'%)     '+'<span >' + this.points[0].series.name +'</span>'


                    Object.keys(quiz.answer).forEach(function(answer) {
                      answer_data.push(quiz.answer[answer]) ;
                      xaxis_categories.push(answer)
                      scope.left += '<br/>'+ quiz.answer[answer] +"  ("+( (quiz.answer[answer] / scope.moduledata.students_count )*100).toFixed(2)+'%)     '+'<span >' + answer +'</span>'
                    });
                    ////////////////////  Survey bar tooltip 
                    scope.quiz_only_one_bar_config = {
                      options:{
                        chart: {type: 'column'},
                        plotOptions: {series: {stacking: 'normal',animation: false}},
                        legend: {reversed: true},
                      },
                      size: {
                        width: 125,
                        height: 200},
                      title: {text: null},
                      xAxis: {
                        categories: xaxis_categories,
                        gridLineWidth: 0,
                        labels:{
                          useHTML:true,
                          enabled: false
                        },
                        lineColor: 'transparent'

                      },
                      yAxis: {
                        // opposite:true,
                        title: {text: null},
                        gridLineWidth: 0,
                        plotLines: [{
                            color: 'black',
                            width: 1,
                            value: 0
                        }],
                        labels:{enabled: false}
                      },
                      series: [{
                        showInLegend: false,               
                        // name: "Never Tried",
                        data: answer_data, //[this.points[0].y] ,
                        color:"#355BB7" //silver
                      }]
                    }

                  }
                  var s = "<div ng-bind-html='title'></div><table><tr><td><highchart class='chart' config='quiz_only_one_bar_config' ></highchart></td><td><div ng-bind-html='left'></div><a class='button left small green module-review gotToQuizButton' style='pointer-events: visible;' translate>dashboard.review_select_inclass_material</a></td></tr></table>"
                  $("#quiz_bar").html(s)
                  $compile($("#quiz_bar"))(scope)
                  scope.$digest();

                  $timeout(function(){
                    $(".gotToQuizButton").click(function (argument) {
                      scope.goTo('course.module.progress',scope.moduledata.course_id,scope.moduledata.id)
                    })
                  })
                  
                  return $("#quiz_bar").html()//$compile(s)(scope)[0] ;
                // }
                // else{}
                },
            }
          },
          size: {
           height: 280
          },
          title: {text: null},
          xAxis: {
            categories: quiz_xaxis_categories,
            gridLineWidth: 0,
            labels:{enabled: false},
            lineColor: 'transparent'

          },
          yAxis: {
            title: {text: null},
            gridLineWidth: 0,
            plotLines: [{
                color: 'black',
                width: 1,
                value: 0
            }],
            labels:{enabled: false}
          },
          series: quiz_completion_data_series
        }

        scope.goTo=function(state , course_id , group_id){
                $state.go(state , { course_id: course_id , module_id: group_id })
        }


      }
    };
  }]);
