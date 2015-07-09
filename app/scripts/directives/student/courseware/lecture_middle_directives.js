'use strict';

angular.module('scalearAngularApp')
.directive("controls",['$interval', '$log', '$translate', function($interval, $log, $translate) {
  return {
    restrict:"E",
    // replace: true,
    templateUrl:"/views/student/lectures/controls.html",
    link: function(scope, element, attrs) {

     //  scope.screenfull = screenfull
     //  scope.$on('$destroy', function() {
     //      shortcut.remove("c");
     //      shortcut.remove("q");
     //      shortcut.remove("n");
     //      shortcut.remove("f");
     //  });
     //  var template = "<b>"+$translate('lectures.keyboard_controls')+"</b>"+
     //                  "<ul class='with-small-margin-top'>"+
     //                    "<li><kbd>B</kbd> <span translate>lectures.back_10s</span></li>"+
     //                    "<li><kbd>Space</kbd> <span translate>lectures.play_pause</span></li>"+
     //                    "<li><kbd>Q</kbd> <span translate>lectures.ask_question</span></li>"+
     //                    "<li><kbd>C</kbd> <span translate>lectures.confused</span></li>"+
     //                    "<li><kbd>N</kbd> <span translate>lectures.video_notes</span></li>"+
     //                  "</ul>";
     //  scope.popover_options={
     //    content: template,
     //    html:true,
     //    append_to_body: true,
     //    placement: 'top',
     //    disabletop: true,
     //    displayontop: true
     //  }
    	
    	// scope.show_message=false;
    	// scope.show_shortcuts=false;    	
     //  scope.notesBtn = function(){
     //    scope.$emit('take_note');
     //  }
     //  scope.questionsBtn = function(){
     //    scope.$emit('post_question');
     //  }
     //  scope.confusedBtn = function(){
     //    scope.show_message=true;
     //    scope.$emit('mark_confused');
     //    $interval(function(){
     //      scope.show_message=false;
     //    }, 2000, 1);
     //  }
     //  scope.shortCutsBtn = function(){
     //    scope.$emit('toggle_shortcuts');
     //  }
     //  scope.fullscreenBtn = function(){
     //    scope.$emit('toggle_fullscreen');
     //  }

     //  scope.showShortcuts=function(){
     //    scope.show_shortcuts=!scope.show_shortcuts;
     //    if(scope.show_shortcuts)
     //      $(document).on("click", function (e) {
     //        if(e.target.className != 'shortcutDiv'){
     //          scope.show_shortcuts = false
     //          scope.$apply()
     //          $(document).off("click")
     //        }         
     //      });
     //    else
     //      $(document).off("click")        
     //  }

    // 	scope.setShortcuts = function()
  		// {
  		// 		shortcut.add("c", function(){
    //         scope.confusedBtn()
    //         scope.$apply()
    //       }, {"disable_in_input" : true});  

  		// 		shortcut.add("q", function(){
    //         scope.questionsBtn()
    //         scope.$apply()
    //       }, {"disable_in_input" : true});
    //       shortcut.add("n", function(){
    //         scope.notesBtn()
    //         scope.$apply()
    //       }, {"disable_in_input" : true});
    //       shortcut.add("f", function(){
    //         scope.fullscreenBtn()
    //         scope.$apply()
    //       }, {"disable_in_input" : true});
  		// }
    //   scope.setShortcuts()

    }
  };

}])
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
      scope.correct_notify=$translate("lectures.correct")
      scope.incorrect_notify=$translate("lectures.incorrect")

    }
  };
}])
.directive("reviewInclass", ['$translate', '$log', function($translate, $log) {
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
}])
.directive("checkAnswer",['$log', function($log) {
  return {
    restrict:"E",
    replace: true,
    scope:{
      action:"&"
    },
  	template: '<button type="button" class="tiny success button with-small-padding no-margin" ng-click="action()">{{"youtube.check_answer" | translate}}</button>',
  	link: function(scope, element, attrs) {}
  }
}])
.directive('studentAnswerForm', ['Lecture','$stateParams','$log',function(Lecture, $stateParams, $log){
	return {
		scope: {
			quiz:"=",
			studentAnswers:"=",
			submitted: "=",
			explanation:"="
		},
		restrict: 'E',
		template: "<ng-form name='qform'><div style='text-align:left;margin:10px;'>"+
							"<label >{{quiz.question}}:</label>"+
							"<div class='answer_div'><div class='answer_div_before'>{{quiz.question_type.toUpperCase() == 'FREE TEXT QUESTION'? 'groups.answer' : 'groups.choices' | translate}}</div>"+
								"<student-html-answer />"+
							"</div>"+
					"</div></ng-form>",
		link: function(scope, iElm, iAttrs, controller) {
      // $('.answer_div:before').css("content", "hello")
			// $('.answer_div:before').css("width", "10px")
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
		
			scope.updateValues= function()
			{
				$log.debug("in value update")
				$log.debug(scope.studentAnswers);
				$log.debug(scope.quiz.question_type);
				$log.debug(scope.studentAnswers[scope.quiz.id]);
				scope.values=0
				if(scope.quiz.quiz_type=="html" && scope.quiz.question_type=="OCQ")
				{
					if(typeof(scope.studentAnswers[scope.quiz.id])=="string")
						scope.values+=1
				}
				else{
					
				
				for(var element in scope.studentAnswers[scope.quiz.id])
				{
					$log.debug(scope.studentAnswers[scope.quiz.id][element]);
					if(scope.studentAnswers[scope.quiz.id][element]==true)
					{
						$log.debug("in true");
						scope.values+=1
					}
				}
				
				}
			$log.debug(scope.values)
			}
			scope.$watch('quiz.question', function(){
				scope.updateValues();	
			})
			
		}
	};
}]).directive('studentHtmlMcq',['$translate','$log',function($translate, $log){	
	return{
		restrict:'E',
		template:"<ng-form name='aform'>"+
					"<input atleastone ng-model='studentAnswers[quiz.id][answer.id]' name='mcq_{{quiz.id}}' type='checkbox' ng-change='updateValues({{quiz.id}})' pop-over='mypop' unique='true'/>"+
					"<p style='display:inline;margin-left:10px'>{{answer.answer}}</p><br/><span class='errormessage' ng-show='submitted && aform.$error.atleastone' translate='lectures.please_choose_one_answer'></span><br/>"+
				"</ng-form>",
		link:function(scope){
			
			scope.$watch('explanation[answer.id]', function(newval){
				if(scope.explanation && scope.explanation[scope.answer.id])
				{
					$log.debug("exp changed!!!")
					scope.mypop={
						title:'<b ng-class="{\'green_notification\':explanation[answer.id][0]==true, \'red_notification\':explanation[answer.id][0]==false}">{{explanation[answer.id][0]==true?("lectures.correct"|translate) : ("lectures.incorrect"| translate)}}</b>',
						content:'<div>{{explanation[answer.id][1]}}</div>',
						html:true,
						trigger:'hover'
					}
				}	
			})
	}
		
	}
	
}]).directive('studentHtmlOcq',['$translate','$log',function($translate, $log){
	return {
		restrict:'E',
		template:"<ng-form name='aform'>"+
					"<input atleastone ng-model='studentAnswers[quiz.id]' value='{{answer.id}}'  name='ocq_{{quiz.id}}' type='radio' ng-change='updateValues({{quiz.id}})' pop-over='mypop' unique='true'/>"+
					"<p style='display:inline;margin-left:10px'>{{answer.answer}}</p><br/><span class='errormessage' ng-show='submitted && aform.$error.atleastone' translate='lectures.please_choose_one_answer'></span><br/>"+
							 	
				"</ng-form>",
		link: function(scope)
		{
			
			scope.$watch('explanation[answer.id]', function(newval){
				if(scope.explanation && scope.explanation[scope.answer.id])
				{
					$log.debug("exp changed!!!")
					scope.mypop={
						title:'<b ng-class="{\'green_notification\':explanation[answer.id][0]==true, \'red_notification\':explanation[answer.id][0]==false}">{{explanation[answer.id][0]==true?("lectures.correct"|translate) : ("lectures.incorrect"| translate)}}</b>',
						content:'<div>{{explanation[answer.id][1]}}</div>',
						html:true,
						trigger:'hover'
					}
				}	
			})
			if(scope.answer.correct)
			{
				scope.radioChange(scope.answer);
			}
			scope.getName= function()
			{
				return "ocq"+scope.index+scope.$index
			}
		}
	}
	
}]).directive('studentHtmlDrag',function(){
	return {
		restrict:'E',
		replace:true,
		templateUrl: '/views/student/lectures/html_drag.html'
	}
	
}).directive('studentHtmlFree',['$translate','$log',function($translate, $log){
        return{
            restrict:'E',
            template:"<ng-form name='aform'>"+
                "<textarea ng-model='studentAnswers[quiz.id]' style='width:500px;height:100px;' required></textarea>"+
                "<span class='errormessage' ng-show='submitted && aform.$error.required' translate='courses.required'></span><br/>"+
                "</ng-form>"
        }

    }])

.directive("studentAnswerVideo",['$log',function($log){
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
              "</div>",
      link: function(scope){}
  }
}])
.directive('studentAnswer', ['$rootScope', '$translate','$log', function($rootScope, $translate, $log){
  return {
     replace:true,
     restrict: 'E',
     templateUrl: "/views/student/lectures/answer.html",

    link: function(scope, element, attrs, controller) {
      $log.debug("student answer link")
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
          var ontop=angular.element('.ontop');
          if(scope.explanation[scope.data.id][0]){
            scope.title_class = "green_notification"
            scope.exp_title = 'lectures.correct'
            if(scope.quiz.question_type =="MCQ"){
              scope.show_sub_title = true
            }
          }
          else{
            scope.title_class = "red_notification"
            scope.exp_title = 'lectures.incorrect'
          }
          scope.explanation_pop={
            title:"<b ng-class='title_class'>{{(exp_title|translate)}}</b><h6 class='subheader no-margin' style='font-size:12px' ng-show='show_sub_title' translate>lectures.other_correct_answers</h6>",
            content:"<div>{{explanation[data.id][1]}}</div>",
            html:true,
            trigger:$rootScope.is_mobile? 'click' : 'hover',
            placement:(scope.data.xcoor > 0.5)? "left":"right"
          }
          if(ontop.css('position') != 'fixed'){
             scope.explanation_pop["container"] = 'body'
          }

        } 
      })
      setup()
      
    }
  };
}])

.directive('studentDrag',['$rootScope','$translate','$log', function($rootScope, $translate, $log){
  return {
    restrict:'E',
    templateUrl: '/views/student/lectures/answer_drag.html',
    link:function(scope,elem){
      $log.debug("student drag")
      $log.debug(scope.data)
      // var setAnswerLocation=function(){
      //   $log.debug("setAnswerLocation")
      //   var ontop=angular.element('.ontop');
      //   console.log(scope.data)
      //   scope.width  = scope.data.width * ontop.width();
      //   scope.height = scope.data.height* (ontop.height());
      //   scope.xcoor = (scope.data.xcoor * ontop.width())
      //   scope.ycoor = (scope.data.ycoor * (ontop.height()))
      //   scope.sub_xcoor = (scope.data.sub_xcoor * ontop.width())
      //   scope.sub_ycoor = (scope.data.sub_ycoor * ontop.height())
      //   scope.explanation_pop.rightcut =  (ontop.css('position') == 'fixed')
      // }
      
      var setup=function(){
      	$log.debug("setup function")
      	var drag_elem = angular.element('#'+scope.data.id)
  		  destroyPopover(drag_elem)
      	scope.explanation_pop={}
      	scope.explanation[scope.data.id] = null
      }
      
     //  $rootScope.$on("updatePosition",function(){
     //    $log.debug("event emitted updated position")
     //    setAnswerLocation()
     //   	var drag_elem = angular.element('#'+scope.data.id)
     //    resizeAnswer(drag_elem)
    	// }) 
      
      scope.formatDrag=function(event, ui){
        var drag_elem = angular.element(ui.helper[0])
        reverseSize(drag_elem)
      }

      scope.adjustDrag=function(event, ui){
        var drag_elem = angular.element(ui.helper[0])
        var ontop = angular.element('.ontop');        
        var left= event.pageX - ontop.offset().left
        var top = event.pageY - ontop.offset().top
        if((event.pageX - drag_elem.width())< ontop.offset().left){
        	ui.position.left = 0}
        else if(left> ontop.width()){

        	 ui.position.left = ontop.width() -  drag_elem.width()
          }
      	else{
      		ui.position.left = left - drag_elem.width()/2
        }

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
        var drop_elem = angular.element(elem[0]).find('div')
        if(!scope.studentAnswers[scope.quiz.id][scope.data.id]){
          ui.draggable.css('background-color', 'lightblue')          
          ui.draggable.css('width', (scope.data.width*100)+'%')          
          ui.draggable.css('height', (scope.data.height*100)+'%')
          
          ui.draggable.css('word-wrap', 'break-word')
          ui.draggable.css('overflow', 'hidden')
          console.log("ontop.width");
          var ontop_w = angular.element('#ontop').width();
          var ontop_h = angular.element('#ontop').height();
          var ui_w = ((scope.data.width)*ontop_w)
          var ui_h = ((scope.data.height)*ontop_h)

          var text_ratio = (ui_h*ui_w)/(ui.draggable.text().length)
          text_ratio = Math.min(Math.sqrt(text_ratio), 15)
          
          ui.draggable.css('font-size', text_ratio +'px')

          ui.draggable.css('left', (scope.data.xcoor*100)+'%')          
          ui.draggable.css('top', (scope.data.ycoor*100)+'%')          
          // ui.draggable.css('p', (scope.data.ycoor*100)+'%')          
          ui.draggable.addClass('dropped')
          // resizeAnswer(ui.draggable, drop_elem)
          scope.studentAnswers[scope.quiz.id][scope.data.id]=ui.draggable.text()
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
        ui.draggable.css('font-size', 15 +'px')
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
      
      var resizeAnswer= function(draggable){
        $log.debug('in resize answer')
        draggable.width(scope.width);
        draggable.height(scope.height);
        draggable.css('left', scope.xcoor+2)
        draggable.css('top', scope.ycoor+2)
      }
     
      scope.$watch('explanation[data.id]', function(newval){
        if(scope.explanation && scope.explanation[scope.data.id]){
          scope.selected_id= angular.element(elem.children()[1]).attr('id')
          var ontop=angular.element('.ontop');
          scope.explanation_pop={
            title:"<b ng-class='{green_notification: explanation[selected_id][0], red_notification: !explanation[selected_id][0]}'>{{explanation[selected_id][0]?('lectures.correct'|translate):('lectures.incorrect'|translate)}}</b>",
            content:"<div>{{explanation[selected_id][1]}}</div>",
            html:true,
            trigger:$rootScope.is_mobile? 'click' : 'hover',
            // rightcut: (ontop.css('position') == 'fixed')
            placement:(scope.data.xcoor > 0.5)? "left":"right"
            // container: 'body'
          }
          if(ontop.css('position') != 'fixed'){
            scope.explanation_pop["container"] = 'body'
          }
          var bg_color = scope.explanation[scope.data.id][0]? "darkseagreen": "orangered"
          angular.element('#'+scope.data.id).css('background-color', bg_color)
        } 
      })

  	  setup()
      // setAnswerLocation()
    }
  }
}])
// .directive('notes',["$stateParams", function( $stateParams) {
//   return {
//     restrict:"E",
//     scope:{
//       lectures:"=",
//       current_lecture:"=",
//       player:"="
//     },
//     templateUrl:'/views/forum/notes.html',
//     link: function(scope, elem, attrsß) {}
//   }
// }])
.directive('aceEditor',['editor','$interval', function (editor, $interval) {
  return {
      restrict: 'A',
      scope: {
          sync: "=",
          player: "=",
          lecture:"=",
          editors:"=",
          seek:"&"
      },
      link: function (scope, element) {
          scope.$on('$destroy', function() {
              //editor.destroy();
              $interval.cancel(scope.editor.autosave);
              scope.editor.doc.dirty=false;
              scope.editor.doc.lastSave = 0;
              scope.editor.doc.info=null;
              delete scope.editor;
          });

          scope.editor = new editor();
          scope.editor.rebind(element[0]);
          scope.editors[scope.lecture.id]=scope.editor;
          //scope.editor.resize();

          scope.$watch("lecture", function(val){
              if(scope.lecture){
                  //editor.create(scope.url);
                  console.log(scope.lecture.name)
                 scope.editor.create(scope.lecture.url, scope.player, scope.lecture.id, scope.lecture.cumulative_duration, scope.lecture.name, scope.lecture.note, scope.seek);
              }
          })

          scope.$watch('sync', function (newValue, oldValue) {
              if (newValue !== oldValue) {
                  var gutter = $(element).find('.ace_gutter');
                  newValue ? gutter.removeClass('inactive') : gutter.addClass('inactive');
              }
          }, true);
      }
  };
}]).directive('studentTimeline', ['$timeout', 'ContentNavigator',function($timeout, ContentNavigator) {
  return {
    replace: true,
    restrict:"E",
    scope:{
      timeline:'=',
      items:'=',
      lecture:'=current',
      seek:'&',
      open_timeline:'=open'
    },
    templateUrl:'/views/student/lectures/student_timeline.html',
    link: function(scope, element, attrs) {
      // scope.checkModel={quiz:true,confused:true, discussion:true};
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
          var condition=false;
          for(var e in scope.$parent.checkModel){
            if(scope.$parent.checkModel[e])
              condition = (condition || item.type==e)
          }
          var x = item.type!='' && condition
          return x;
        }
    }
  }
}]).directive('confusedTimeline',['Lecture','$filter', function(Lecture,$filter){
  return{
    restrict:"A",
    // replace:true,
    scope:{
      item:'=',
      seek:'&'
    },
    templateUrl:'/views/student/lectures/confused_timeline.html',
    link:function(scope, element, attrs){
      // var unwatch = scope.$watch('item.data.very',function(){
      //     scope.msg =scope.item.data.very? 'courses.really_confused': 'courses.confused'
      // })
      scope.formattedTime = $filter('format','hh:mm:ss')(scope.item.time)
      scope.deleteConfused = function(confused){
        Lecture.deleteConfused(
        {
          course_id: confused.data.course_id,
          lecture_id: confused.data.lecture_id, 
          confused_id: confused.data.id
        }, 
        function(response){
          // console.log("deleted");
          // unwatch()
          // delete scope.item
          scope.$emit('remove_from_timeline', confused)
          // now want to remove from list (both l.confuseds and $scope.timeline..)
          // var index=scope.timeline['lecture'][lecture_id].items.indexOf(confused);
          // scope.timeline['lecture'][lecture_id].items.splice(index, 1)
        });
      }

    }
  }
}])
.directive('quizTimeline',['OnlineQuiz','$filter','$rootScope','$translate', function(OnlineQuiz,$filter, $rootScope, $translate){
  return{
    restrict:"A",
    // replace:true,
    scope:{
      item:'=',
      seek:'&'
    },
    templateUrl: '/views/student/lectures/quiz_timeline.html',
    link:function(scope, element, attrs){
      scope.preview_as_student = $rootScope.preview_as_student
      scope.formattedTime = $filter('format','hh:mm:ss')(scope.item.time)
      scope.unsolved_msg = $translate("lectures.unsolved_quiz")
      scope.voteForReview=function(){
        console.log("vote review")
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
        console.log("unvote review")
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
}])
.directive('notesTimeline',['$log','Lecture','$state','$filter', function($log,Lecture,$state, $filter){
  return{
    restrict:"A",
    scope:{
      item:'=',
      seek:'&'
    },
    templateUrl:"/views/student/lectures/notes_timeline.html",
    link:function(scope,element,attrs){
      scope.formattedTime = $filter('format','hh:mm:ss')(scope.item.time)
      scope.deleteNote=function(){
        // console.log(scope.item)
        if(scope.item.data && scope.item.data.id){
          Lecture.deleteNote(
            {
              course_id: $state.params.course_id,
              lecture_id: scope.item.data.lecture_id || $state.params.lecture_id,
              note_id: scope.item.data.id
            },function(){
                scope.$emit('remove_from_timeline', scope.item)
                // scope.$emit("note_updated")
            }
          )
        }
        else{
          scope.$emit('remove_from_timeline', scope.item)
          scope.$emit("note_updated")
        }
      }

      scope.saveNote=function(note_text){
        console.log(scope.item)
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
            // scope.$emit("note_updated")
            scope.item.data = response.note
            //console.log(response.note)
          }, 
          function(response){}
        );
      }

    }
  }
}]).directive('notesArea', ['$timeout',
    function($timeout) {
        return {
            template: '<div onshow="moveCursorToEnd()" e-rows="3" e-cols="50" blur="submit" editable-textarea="value" e-form="myform" buttons="no" onaftersave="saveData()" e-placeholder="Note..." ng-click="show()" e-style="width:95% !important; font-size: 13px;color: teal;" style="padding:0 9px">'+
                        '<div style="word-break: break-word; padding: 3px; margin: 0px;width:85%; cursor: text;float:left">'+
                          '{{ value }}'+
                          // '<span ng-show="overclass" style="float: right;font-size: 9px;bottom: -8px;position: relative;">click to edit</span>'+
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
            link: function(scope, element) {

                scope.$on('$destroy', function() {
                  shortcut.remove("enter");
                  shortcut.remove("esc");
                });

                scope.moveCursorToEnd=function(){
                  $timeout(function() {
                      var textarea = $('.editable-input');
                      var strLength= textarea.val().length;
                      textarea.focus();
                      textarea[0].setSelectionRange(strLength, strLength);
                  });

                  shortcut.add("enter", function(){
                    $('form.editable-textarea').submit();
                  }, {"disable_in_input" : false});
                  shortcut.add("esc", function(){
                    $('form.editable-textarea').submit();
                  }, {"disable_in_input" : false});

                }
                scope.show=function(){
                  scope.myform.$show()
                  $('.editable-input').focus()
                }

                if(!scope.value)
                  scope.show()

                scope.saveData = function() {
                  scope.$emit("note_updated")
                  if(!scope.value)
                    scope.delete()
                  else
                    $timeout(function() {
                        scope.save()(scope.value)
                    })
                }
            }
        };
    }
])