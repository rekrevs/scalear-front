'use strict';

angular.module('scalearAngularApp')
  .directive('studentModuleDashboard', ['ErrorHandler','ScalearUtils','$filter','$translate','$state','$compile', '$timeout', function(ErrorHandler,ScalearUtils,$filter,$translate,$state,$compile, $timeout) {
    return {
      scope: {
        moduledata: '='
      },
      replace: true,
      templateUrl: "/views/student_module_dashboard.html",
      link: function(scope) {
        console.log(scope.moduledata)
        scope.moduledata.hour_min = ScalearUtils.toHourMin(scope.moduledata.duration)
        scope.moduledata.time_left_string = ScalearUtils.toHourMin(scope.moduledata.due_date)

        scope.subtitle = scope.moduledata.hour_min + " " +
          $translate.instant('time.hours') + ", " +
          scope.moduledata.quiz_count + " " +
          $translate.instant('global.quizzes') + ", " +
          scope.moduledata.survey_count + " " +
          $translate.instant('global.surveys') + ". " +
          $translate.instant('events.due') + " " +
          $filter('date')(new Date(scope.moduledata.due_date_string), 'dd-MMMM-yyyy') + " " +
          $translate.instant('global.at') + " " +
          $filter('date')(new Date(scope.moduledata.due_date_string), 'HH:mm')+ "."

        scope.remaining = 'Remaining : '+ ScalearUtils.toHourMin(scope.moduledata.remaining_duration) +" " + 
                          $translate.instant('time.hours')+", "+scope.moduledata.remaining_quiz+" " + $translate.instant('global.quizzes')+", "+
                          scope.moduledata.remaining_survey + " " + $translate.instant('global.surveys')+". "

        scope.group_width =   ( 1/ scope.moduledata['online_quiz_count'] ) * 100

        scope.trigger_tooltip = 0
        scope.quiz = {}
        scope.module_style ={}
        scope.completion_style ={}
        scope.quiz_completion_data_series = {
            group_never_tried:{
              name: " and  you did not answer this group question.",
              color:"#a4a9ad" //silver
            },
            group_survey_solved:{
              name: " and you solved this group survey.",
              color:"#355BB7" //blue 
            },
            group_not_checked:{
              name: " and your answer is not checked.",
              color:"#551a8b" //purble                
            },
            group_tried_not_correct:{
              name: " and your group answer was <span style='color:#E66726'> not correct.</spna>",
              color:"#E66726" //Orange: 
            },
            group_tried_correct_finally:{
              name: " and your group answer was<span style='color:#BADAA5'> correct </span> after a retry",
              color:"#BADAA5"//Pale Green: 
            } ,
            group_correct_first_try:{
              name: " and your group answer was <span style='color:#16A53F'> correct</span>.",
              color:"#16A53F"// Green
            },             
            self_never_tried:{
              name: "You did not answer this quiz.",
              group_name: "You did not answer this invdividual quiz,",
              color:"#a4a9ad" //silver
            },
            self_survey_solved:{
              name: "You did not answer this survey.",
              group_name: "You did not answer this invdividual survey,",
              color:"#355BB7" //blue 
            },
            self_not_checked:{
              name: "You have tried this quiz, but your answer did not been checked,",
              group_name: "You have tried this quiz, but your answer did not been checked.",
              color:"#551a8b" //purble                
            },
            self_tried_not_correct:{
              name:"You have tried this quiz, but have <span style='color:#E66726'> not gotten the answer correct.</span>",
              group_name: "Your individual answer was <span style='color:#E66726'> incorrect</span>,",
              color:"#E66726" //Orange: 
            },
            self_tried_correct_finally:{
              name:"You got the answer correct, but <span style='color:#BADAA5'>not on the first try</span>.",
              group_name: "Your individual answer was <span style='color:#BADAA5'>correct </span> after a retry,",
              color:"#BADAA5"//Pale Green: 
            } ,
            self_correct_first_try:{
              name:"You got the answer <span style='color:#16A53F'> correct </span> .",
              group_name: "Your individual answer was <span style='color:#16A53F'> correct</span>,",
              color:"#16A53F"// Green
            } 
        }
        
        scope.lectureTooltip =function(id,event,name){
          scope.module_style[id] ={
           "border":"3px solid #000000"
          }
          scope.completion_style[id] ={
           "border":"3px solid #000000"
          }

          if( !$('#tooltip_module').length ){
            var position = $('#module_'+id).position()
            var tooltip_element = "<div id='tooltip_module' style='border:1px solid #000000;position:absolute;background-color:#ffffff;left:"+position.left+"px;top:"+(position.top+175 )+"px'>"+name+"</div>"
            $("body").append(tooltip_element); 
          }
        }
        
        scope.lectureTooltipLeave =function(id){
          $('#tooltip_module').remove()
          scope.module_style[id] ={
           "border":'none'
          }
          scope.completion_style[id] ={
           "border":'1px solid #EFE7E7'
          }
        }

          scope.online_popover={}
          scope.online_quiz_name={}
          scope.content={}
          var online_quiz_index = 0
          scope.moduledata.module_completion.forEach(function(quiz_list) {
              if(quiz_list['type'] == 'lecture'){
                quiz_list['online_quizzes'].forEach(function(online_quiz){
                  scope.online_quiz_name[online_quiz.id] = online_quiz['quiz_name']
                  if(online_quiz['data'].length==2){
                    scope.content[online_quiz.id] = scope.quiz_completion_data_series[online_quiz['data'][0]].group_name +   scope.quiz_completion_data_series[online_quiz['data'][1]].name 
                  }
                  else{
                    scope.content[online_quiz.id] = scope.quiz_completion_data_series[ online_quiz['data'][0] ].name                     
                  }
                  scope.online_popover[online_quiz['id']]={
                    title:"<b ng-bind-html='online_quiz_name[online_quiz.id]'></b> ",
                    content:"<div ng-bind-html='content[online_quiz.id]'></div> "+
                            "<div class='right' style='bottom: 10px;right: 10px;'>"+
                            "<a class='button left tiny green module-review ' style='pointer-events: visible;margin-bottom: 0;margin-top: 10px;margin-bottom:10px' ng-click='goTo(moduledata.course_id, moduledata.id, online_quiz.lecture_id, online_quiz.time)' translate>dashboard.try_again</a></div>" ,
                    html:true,
                    trigger:'click',
                  }        
                  if ( online_quiz_index /  scope.moduledata['online_quiz_count']  > 0.5  ){
                    // placement: 'left'
                    scope.online_popover[online_quiz['id']]['placement'] = 'left'
                  }
                  online_quiz_index += 1
                })                
              }
          })

          scope.goTo = function(course_id, group_id, lecture_id,time) {
            console.log(course_id, group_id, lecture_id,time)

            // var url = "course.module.courseware.lecture"
            // params.lecture_id = event.lecture_id
          // var params = { course_id: course_id, module_id: group_id , lecture_id:lecture_id }
                      // event.url = $state.href(url, params, { absolute: true })
            $state.go("course.module.courseware.lecture", { course_id: course_id, module_id: group_id, lecture_id: lecture_id , time:time} , { time:time})
          } 

            // title:'<b ng-class="{\'green_notification\':explanation[answer.id][0]==true, \'red_notification\':explanation[answer.id][0]==false}">{{explanation[answer.id][0]==true?("lectures.correct"|translate) : ("lectures.incorrect"| translate)}}</b>',
          //   content:'<div >dfsdfds</div>',
          //   html:true,
          //   trigger:'click'
          // }        
        //   online_popover[online_quiz.id]
        // online_quiz['data'].length==2

      }
    };
  }]);
