'use strict';

angular.module('scalearAngularApp')
.directive("notification", ['$translate', '$log', function($translate, $log) {
  return {
    restrict:"E",
    scope:{
      message:'=',
      submessage:'=',
      middleMessage:'='
    },
    templateUrl: '/views/student/lectures/notification.html',
    link: function(scope, element, attrs) {
      scope.correct_notify=$translate.instant("lectures.correct")
      scope.incorrect_notify=$translate.instant("lectures.incorrect")
    }
  };
}]).directive("reviewInclass", ['$translate', '$log', function($translate, $log) {
  return {
    restrict:"E",
    scope:{
      vote:'&',
      close:'&',
      retry:'&'
    },
    templateUrl: '/views/student/lectures/review_inclass.html',
    link: function(scope, element, attrs) {}
  };
}]).directive("checkAnswer",['$log', function($log) {
  return {
    restrict:"E",
    replace: true,
    scope:{
      action:"&"
    },
  	template: '<button type="button" class="tiny success button with-small-padding no-margin" ng-click="action()">{{"lectures.button.check_answer" | translate}}</button>',
  	link: function(scope, element, attrs) {}
  }
}]).directive('studentAnswerForm', ['Lecture','$stateParams','$log',function(Lecture, $stateParams, $log){
	return {
		scope: {
			quiz:"=",
			studentAnswers:"=",
			submitted: "=",
			explanation:"="
		},
		restrict: 'E',
		template: "<ng-form name='qform'><div style='text-align:left;margin:10px;'>"+
							"<label style='font-size: 15px;padding-bottom: 10px;' ng-bind-html='quiz.question'>:</label>"+
							"<div class='answer_div'><div class='answer_div_before'>{{quiz.question_type.toUpperCase() == 'FREE TEXT QUESTION'? 'lectures.answer' : 'lectures.choices' | translate}}</div>"+
								"<student-html-answer />"+
							"</div>"+
					"</div></ng-form>",
		link: function(scope, iElm, iAttrs, controller) {
      scope.studentAnswers = scope.studentAnswers || {}
    }
	};
}]).directive('studentHtmlAnswer',['$log',function($log){
	return {
	 	restrict: 'E',
	 	template: "<div ng-switch on='quiz.question_type.toUpperCase()' >"+
					"<div ng-switch-when='MCQ' ><student-html-mcq  ng-repeat='answer in quiz.online_answers' /></div>"+
					"<div ng-switch-when='OCQ' ><student-html-ocq  ng-repeat='answer in quiz.online_answers' /></div>"+
          "<div ng-switch-when='FREE TEXT QUESTION'><student-html-free /></div>"+
					"<ul  ng-switch-when='DRAG' class='drag-sort sortable' ui-sortable ng-model='studentAnswers[quiz.id]'>"+
						"<student-html-drag ng-repeat='answer in studentAnswers[quiz.id]' />"+
					"</ul>"+
				"</div>",
		link:function(scope){

			scope.updateValues= function(){
				scope.values=0
				if( (scope.quiz.quiz_type=="html" || scope.quiz.quiz_type=="html_survey") && scope.quiz.question_type=="OCQ"){
          if(typeof(scope.studentAnswers[scope.quiz.id])=="string")
						scope.values+=1
				}
				else{
  				for(var element in scope.studentAnswers[scope.quiz.id]){
  					if(scope.studentAnswers[scope.quiz.id][element]==true){
  						scope.values+=1
  					}
  				}
				}
			}
			scope.$watch('quiz.question', function(){
				scope.updateValues();
			})
		}
	};
}]).directive('studentHtmlMcq',['$translate','$log',function($translate, $log){
	return{
		restrict:'E',
		template:"<ng-form name='aform' >"+
					"<input atleastone ng-model='studentAnswers[quiz.id][answer.id]' name='mcq_{{quiz.id}}' type='checkbox' ng-change='updateValues({{quiz.id}})' pop-over='mypop' />"+
					"<p style='display:inline;margin-left:10px' ng-bind-html='answer.answer'></p><br/><span class='errormessage' ng-show='submitted && aform.$error.atleastone' translate='lectures.messages.please_choose_one_answer'></span><br/>"+
				"</ng-form>",
		link:function(scope){
			scope.$watch('explanation[answer.id]', function(newval){
				if(scope.explanation && scope.explanation[scope.answer.id]){
					scope.mypop={
						title:'<b ng-class="{\'green_notification\':explanation[answer.id][0]==true, \'red_notification\':explanation[answer.id][0]==false}">{{explanation[answer.id][0]==true?("lectures.correct"|translate) : ("lectures.incorrect"| translate)}}</b>',
						content:'<div ng-bind-html="explanation[answer.id][1]"></div>',
						html:true,
            // placement:"up",
						trigger:'hover',
            instant_show:'mouseover'
					}
				}
			})
      scope.$on("$destroy", function() {
        scope.explanation[scope.answer.id] = null
      });
    }
	}
}]).directive('studentHtmlOcq',['$translate','$log',function($translate, $log){
	return {
		restrict:'E',
		template:"<ng-form name='aform'>"+
					"<input atleastone ng-model='studentAnswers[quiz.id]' value='{{answer.id}}'  name='ocq_{{quiz.id}}' type='radio' ng-change='updateValues({{quiz.id}})' pop-over='mypop'/>"+
					"<p style='display:inline;margin-left:10px' ng-bind-html='answer.answer'></p><br/><span class='errormessage' ng-show='submitted && aform.$error.atleastone' translate='lectures.messages.please_choose_one_answer'></span><br/>"+

				"</ng-form>",
		link: function(scope){

			scope.$watch('explanation[answer.id]', function(newval){
				if(scope.explanation && scope.explanation[scope.answer.id])
				{
					$log.debug("exp changed!!!")
					scope.mypop={
						title:'<b ng-class="{\'green_notification\':explanation[answer.id][0]==true, \'red_notification\':explanation[answer.id][0]==false}">{{explanation[answer.id][0]==true?("lectures.correct"|translate) : ("lectures.incorrect"| translate)}}</b>',
						content:'<div ng-bind-html="explanation[answer.id][1]"></div>',
						html:true,
						trigger:'hover',
            instant_show : "mouseover"
					}
				}
			})
      scope.$on("$destroy", function() {
        scope.explanation[scope.answer.id] = null
      });
			// if(scope.answer.correct){
			// 	scope.radioChange(scope.answer);
			// }

			// scope.getName= function(){
			// 	return "ocq"+scope.index+scope.$index
			// }
		}
	}

}]).directive('studentHtmlDrag',function(){
  return {
    restrict:'E',
    replace:true,
    templateUrl: '/views/student/lectures/html_drag.html',
    link: function(scope){

      scope.$watch('explanation[quiz.id]', function(newval){
        if(scope.explanation && scope.explanation[scope.quiz.id])
        {
          scope.mypop={
            content:'<div ng-bind-html="explanation[quiz.id][answer]"></div>',
            html:true,
            trigger:'hover',
            container: 'body'
          }
        }
      })
      scope.$on("$destroy", function() {
        scope.explanation[scope.quiz.id] = null
      });
  }
}
}).directive('studentHtmlFree',['$translate','$log','$timeout',function($translate, $log, $timeout){
  return{
    restrict:'E',
    template: "<ng-form name='aform'>"+
              "<textarea ng-click='studentHtmlFreeInputClick($event)' ng-model='studentAnswers[quiz.id]' style='width:500px;height:100px;' required></textarea>"+
              "<span class='errormessage' ng-show='submitted && aform.$error.required' translate='error_message.required'></span><br/>"+
              "</ng-form>"+
              "<div ng-bind-html='explanation[quiz.id]'></div>",
    link:function(scope ,element){
      scope.$on("$destroy", function() {
        scope.explanation[scope.quiz.id] = null
      });

      scope.studentHtmlFreeInputClick = function(e){ 
        $timeout(function(){ 
           angular.element(element).find("textarea").focus()
           e.stopPropagation() 
        })     
      }       

    }
  }
}]).directive("studentAnswerVideo",['$log',function($log){
  return {
    restrict:"E",
    scope:{
      quiz:"=",
      data:"=",
      explanation:"=",
      studentAnswers:"="
    },
    template: "<div ng-switch on='quiz.question_type.toUpperCase()'>"+
                "<div ng-switch-when='MCQ'><student-answer /></div>"+
                "<div ng-switch-when='OCQ'><student-answer /></div>"+
                "<div ng-switch-when='DRAG'><student-drag /></div>"+
                "<div ng-switch-when='FREE TEXT QUESTION'><student-free-text /></div>"+
              "</div>"
  }
}]).directive('studentAnswer', ['$rootScope', '$translate','$log','$timeout', function($rootScope, $translate, $log,$timeout){
  return {
    replace:true,
    restrict: 'E',
    templateUrl: "/views/student/lectures/answer.html",
    link: function(scope, element, attrs, controller) {
      var setup=function(){
        scope.explanation_pop ={}
        var type= scope.quiz.question_type =="MCQ"? "checkbox" :"radio"
        element.attr('type',type)
      }
      scope.radioChange=function(corr_ans){
        if(scope.quiz.question_type == "OCQ"){
          $log.debug("radioChange")
          scope.quiz.online_answers.forEach(function(ans){
            ans.selected=false
          })
          corr_ans.selected=true
        }
      }

      scope.$watch('explanation[data.id]', function(newval){
        if(scope.explanation && scope.explanation[scope.data.id]){
          if(scope.explanation[scope.data.id][0]){
            scope.title_class = "green_notification"
            scope.exp_title = 'lectures.correct'
            scope.show_sub_title = scope.quiz.question_type =="MCQ"
          }
          else{
            scope.title_class = "red_notification"
            scope.exp_title = 'lectures.incorrect'
          }
          scope.explanation_pop={
            title:"<b ng-class='title_class'>{{(exp_title|translate)}}</b><h6 class='subheader no-margin' style='font-size:12px' ng-show='show_sub_title' translate>lectures.other_correct_answers</h6>",
            content:"<div ng-bind-html='explanation[data.id][1]'></div>",
            html:true,
            trigger:$rootScope.is_mobile? 'click' : 'hover',
            placement:(scope.data.xcoor > 0.5)? "left":"right",
            instant_show: "mouseover"
          }
          $timeout(function(){
            if(scope.explanation[scope.data.id][0]){
              element.siblings().css('z-index',10000)
            }
          },300)
        }
      })
      scope.$on("$destroy", function() {
         scope.explanation && (scope.explanation[scope.data.id] = null)
      });
      setup()
    }
  };
}]).directive('studentDrag',['$rootScope','$translate','$log', function($rootScope, $translate, $log){
  return {
    restrict:'E',
    templateUrl: '/views/student/lectures/answer_drag.html',
    link:function(scope,elem){
      var setup=function(){
      	var drag_elem = angular.element('#'+scope.data.id)
  		  destroyPopover(drag_elem)
      	scope.explanation_pop={}
      	scope.explanation[scope.data.id] = null
      }

      scope.formatDrag=function(event, ui){
        var drag_elem = angular.element(ui.helper[0])
        reverseSize(drag_elem)
      }

      scope.convertPositionToPercent=function (event, ui) {
        var drag_elem = angular.element(ui.helper[0])
        var ontop = angular.element('.ontop');
        var left = drag_elem.position().left
        var top  = drag_elem.position().top
        drag_elem.css({
          'left':(left/ontop.width())*100 + '%',
          'top': (top/ontop.height())*100 + '%'
        })
      }

      scope.adjustDrag=function(event, ui){
        var drag_elem = angular.element(ui.helper[0])
        var ontop = angular.element('.ontop');
        var left= event.pageX - ontop.offset().left
        var top = event.pageY - ontop.offset().top

        if((event.pageX - drag_elem.width())< ontop.offset().left){
        	ui.position.left = 0}
        else if(left> ontop.width())
        	 ui.position.left = ontop.width() -  drag_elem.width()
      	else
      		ui.position.left = left - drag_elem.width()/2

        if((event.pageY - drag_elem.height())< ontop.offset().top)
          	ui.position.top  = 0
        else if(top > ontop.height())
          	ui.position.top  = ontop.height() - drag_elem.height()
      	else
          	ui.position.top  = top - drag_elem.height()
      }

      scope.formatDropped=function(event, ui){
         if(!scope.studentAnswers[scope.quiz.id][scope.data.id])
            ui.draggable.css('background-color', 'lightblue')
          else
            ui.draggable.css('background-color', 'orange')
      }

      scope.setDropped=function(event, ui){
        if(!scope.studentAnswers[scope.quiz.id][scope.data.id]){
          ui.draggable.css('background-color', 'lightblue')
          ui.draggable.css('width', (scope.data.width*100)+'%')
          ui.draggable.css('height', (scope.data.height*100)+'%')

          ui.draggable.css('word-wrap', 'break-word')
          ui.draggable.css('overflow', 'hidden')
          var ontop_w = angular.element('#ontop').width();
          var ontop_h = angular.element('#ontop').height();
          var ui_w = ((scope.data.width)*ontop_w)
          var ui_h = ((scope.data.height)*ontop_h)

          var text_ratio = (ui_h*ui_w)/(ui.draggable.text().length)
          text_ratio = Math.min(Math.sqrt(text_ratio), 15)

          ui.draggable.css('font-size', text_ratio +'px')

          ui.draggable.css('left', (scope.data.xcoor*100)+'%')
          ui.draggable.css('top', (scope.data.ycoor*100)+'%')
          ui.draggable.addClass('dropped')
          scope.studentAnswers[scope.quiz.id][scope.data.id]=ui.draggable.html()
          ui.draggable.attr('id', scope.data.id)
          scope.$apply()
        }
        else{
          var drag_elem = angular.element('#'+scope.data.id)
          reverseSize(drag_elem)
          reversePosition(drag_elem)
          clear(drag_elem)
          scope.setDropped(event, ui)
        }
      }

       scope.clearDropped=function(event, ui){
       	destroyPopover(ui.draggable)
        clear(ui.draggable)
        ui.draggable.css('font-size', '15px')
      }

      var clear=function(draggable){
        if(draggable.attr('id')==scope.data.id){
          scope.studentAnswers[scope.quiz.id][scope.data.id]=''
          scope.$apply()
        }
        draggable.css('background-color', '')
        draggable.attr('id', '')
      }

      var reverseSize=function(draggable){
        draggable.removeClass('dropped')
        draggable.width('')
        draggable.height('')
      }

      var reversePosition=function(draggable){
        draggable.css('left', (scope.data.sub_xcoor*100)+'%')
        draggable.css('top', (scope.data.sub_ycoor*100)+'%')
      }

      var destroyPopover=function(draggable){
      	 if(scope.explanation_pop)
          	draggable.popover("destroy")
      }

      scope.$watch('explanation[data.id]', function(newval){
        if(scope.explanation && scope.explanation[scope.data.id]){
          scope.selected_id= angular.element(elem.children()[1]).attr('id')
          var ontop=angular.element('.ontop');
          scope.explanation_pop={
            title:"<b ng-class='{green_notification: explanation[selected_id][0], red_notification: !explanation[selected_id][0]}'>{{explanation[selected_id][0]?('lectures.correct'|translate):('lectures.incorrect'|translate)}}</b>",
            content:"<div ng-bind-html='explanation[selected_id][1]'></div>",
            html:true,
            trigger:$rootScope.is_mobile? 'click' : 'hover',
            placement:angular.element(elem.children()[1]).position().left > (ontop.width()/2)? "left":"right"
          }
          var bg_color = scope.explanation[scope.data.id][0]? "darkseagreen": "orangered"
          angular.element('#'+scope.data.id).css('background-color', bg_color)
        }
      })
      scope.$on("$destroy", function() {
        scope.explanation[scope.data.id] = null
      });

  	  setup()

    }
  }
}]).directive('studentFreeText',['$rootScope','$translate','$log', '$timeout', function($rootScope, $translate, $log, $timeout){
  return {
    restrict:'E',
    template: '<textarea ng-click="freeTextInputClick($event)" placeholder="Write your answer here..." pop-over="explanation_pop" ng-model="studentAnswers[quiz.id]" ng-style="{left: (data.xcoor*100)+\'%\', top: (data.ycoor*100)+\'%\', width:(data.width*100)+\'%\', height:(data.height*100)+\'%\'}"  style="resize:none;position:absolute;font-size: 14px;"></textarea>',
    link:function(scope,elem){
      var setup=function(){
        scope.explanation_pop={}
        scope.explanation[scope.data.id] = null
      }

      scope.$watch('explanation[quiz.id]', function(newval){
        if(scope.explanation  && scope.explanation[scope.quiz.id]){
          scope.explanation_pop={
            title:"<b ng-class='title_class'>{{(exp_title|translate)}}</b><h6 class='subheader no-margin' style='font-size:12px' ng-show='show_sub_title' translate>lectures.other_correct_answers</h6>",
            content:"<div ng-bind-html='explanation[quiz.id]'></div>",
            html:true,
            trigger:$rootScope.is_mobile? 'click' : 'hover',
            placement:(scope.data.xcoor > 0.5)? "left":"right",
            container: 'body'
          }
        }
      })

      scope.freeTextInputClick = function(e){
        $timeout(function(){
            angular.element(elem).find("textarea").focus()
            e.stopPropagation()
        })    
      }

      scope.$on("$destroy", function() {
        scope.explanation[scope.quiz.id] = null
      });
      setup()
    }
  }
}]).directive('studentTimeline', ['$timeout', 'ContentNavigator','TimelineFilter',function($timeout, ContentNavigator,TimelineFilter) {
  return {
    replace: true,
    restrict:"E",
    scope:{
      timeline:'=',
      items:'=',
      lecture:'=current',
      seek:'&',
      open_timeline:'=open',
      totalduration: '='
    },
    templateUrl:'/views/student/lectures/student_timeline.html',
    link: function(scope, element, attrs) {
      scope.ContentNavigator= ContentNavigator
      scope.$watch('open_timeline',function(status){
        if(status){
            $timeout(function(){
                scope.delayed_timeline_open = true
            },300)
          }
          else
            scope.delayed_timeline_open = status
      })

      scope.checkEmpty= function(item){
        return  item.type!=''
      }

      scope.filterType= function(item){
        return TimelineFilter.get(item.type)
      }
    }
  }
}]).directive('confusedTimeline',['Lecture','$filter', function(Lecture,$filter){
  return{
    restrict:"A",
    scope:{
      data:'&',
      seek:'&'
    },
    templateUrl:'/views/student/lectures/confused_timeline.html',
    link:function(scope, element, attrs){
      scope.item = scope.data()
      scope.formattedTime = $filter('format','hh:mm:ss')(scope.item.time)
      scope.deleteConfused = function(confused){
        Lecture.deleteConfused(
        {
          course_id: confused.data.course_id,
          lecture_id: confused.data.lecture_id,
          confused_id: confused.data.id
        },
        function(response){
          scope.$emit('remove_from_timeline', confused)
        });
      }
    }
  }
}]).directive('quizTimeline',['OnlineQuiz','$filter','$rootScope','$translate','$log', function(OnlineQuiz,$filter, $rootScope, $translate,$log){
  return{
    restrict:"A",
    scope:{
      data:'&',
      seek:'&'
    },
    templateUrl: '/views/student/lectures/quiz_timeline.html',
    link:function(scope, element, attrs){
      scope.item = scope.data()
      scope.preview_as_student = $rootScope.preview_as_student
      scope.formattedTime = $filter('format','hh:mm:ss')(scope.item.time)
      scope.unsolved_msg = $translate.instant("lectures.tooltip.unsolved_quiz")
      scope.voteForReview=function(){
        $log.debug("vote review")
        OnlineQuiz.voteForReview(
        {online_quizzes_id:scope.item.data.id},{},
        function(res){
          if(res.done){
            if(!scope.item.data.reviewed){
              scope.item.data.reviewed = true
              scope.item.data.votes_count++
            }
          }
        })
      }

      scope.unvoteForReview=function(){
        $log.debug("unvote review")
        OnlineQuiz.unvoteForReview(
        {online_quizzes_id:scope.item.data.id},{},
        function(res){
          if(res.done){
            if(scope.item.data.reviewed){
                scope.item.data.reviewed = false
                scope.item.data.votes_count--
            }
          }
        })
      }
    }
  }
}]).directive('notesTimeline',['$log','Lecture','$state','$filter', function($log,Lecture,$state, $filter){
  return{
    restrict:"A",
    scope:{
      data:'&',
      seek:'&'
    },
    templateUrl:"/views/student/lectures/notes_timeline.html",
    link:function(scope,element,attrs){
      scope.item = scope.data()
      scope.formattedTime = $filter('format','hh:mm:ss')(scope.item.time)
      scope.deleteNote=function(){
        if(scope.item.data && scope.item.data.id){
          Lecture.deleteNote(
            {
              course_id: $state.params.course_id,
              lecture_id: scope.item.data.lecture_id || $state.params.lecture_id,
              note_id: scope.item.data.id
            },function(){
                scope.$emit('remove_from_timeline', scope.item)
            }
          )
        }
        else{
          scope.$emit('remove_from_timeline', scope.item)
        }
      }

      scope.saveNote=function(note_text){
        $log.debug(scope.item)
        Lecture.saveNote(
          {
            course_id: $state.params.course_id,
            lecture_id: scope.item.data.lecture_id || $state.params.lecture_id,
            note_id: scope.item.data.id || null
          },
          {
            data: note_text,
            time: scope.item.time
          },
          function(response){
            scope.item.data = response.note
          }
        );
      }
    }
  }
}]).directive('notesArea', ['$timeout',function($timeout){
  return{
    template: '<div  ng-click="noteAreaClick($event)" e-rich-textarea onshow="moveCursorToEnd()" e-rows="3" e-cols="100" blur="submit" editable-textarea="value" e-form="myform" buttons="no" onaftersave="saveData()" e-placeholder="Note..." ng-click="show()" e-style="width:95% !important; font-size: 13px;color: teal; height:80px" style="padding:0 9px">'+
                '<div class="note" style="word-break: break-word; margin: 0px;cursor: text;float:left">'+
                  '<span ng-bind-html="value"></span>'+
                '</div>'+
                '<div style="font-size: 10px; float: right; display: inline-block;">'+
                  '<delete_button size="small" action="delete()" vertical="false" text="false" ></delete_button>'+
                '</div>'+
              '</div>',
    restrict: 'E',
    scope: {
      value: "=",
      save: "&",
      delete:"&"
    },
    link: function(scope, element){
      scope.$on('$destroy', function() {
        shortcut.remove("enter");
        shortcut.remove("esc");
      });

      scope.moveCursorToEnd=function(){
        // $timeout(function() {
        //     var textarea = $('.editable-input');
        //     var strLength= textarea.val().length;
        //     textarea.focus();
        //     textarea[0].setSelectionRange(strLength, strLength);
        // });

        shortcut.add("enter", function(){
          $('form.editable-textarea').submit();
        }, {"disable_in_input" : false});
        shortcut.add("esc", function(){
          $('form.editable-textarea').submit();
        }, {"disable_in_input" : false});
      }

      scope.show=function(){
        scope.myform.$show()
        $('.medium-editor-textarea').focus()
      }

      if(!scope.value)
        scope.show()

     scope.noteAreaClick = function(e){  
        $timeout(function(){  
            $('.note').focus() 
           e.stopPropagation()  
        })      
      }        

      scope.saveData = function(){
        scope.$emit("note_updated")
        if(!scope.value)
          scope.delete()
        else
          $timeout(function(){
            scope.save()(scope.value)
          })
      }
    }
  };
}]).directive('markersTimeline',['$filter', function($filter){
  return{
    restrict:"A",
    scope:{
      data:'&',
      seek:'&'
    },
    templateUrl: '/views/student/lectures/markers_timeline.html',
    link:function(scope, element, attrs){
      scope.item = scope.data()
      scope.formattedTime = $filter('format','hh:mm:ss')(scope.item.time)

    }
  }
}]).directive('annotation',['$filter', function($filter){
  return{
    restrict:"E",
    scope:{
      annotation:'=text',
      close: '&',
      action:'&'
    },
    templateUrl: '/views/student/lectures/annotation.html',
    link:function(scope, element, attrs){
      scope.closeBtn = scope.close()
      scope.actionBtn = scope.action()
    }
  }
}])
