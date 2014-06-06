'use strict';

angular.module('scalearAngularApp')
.directive("controls",['$interval', '$log', function($interval, $log) {
  return {
    restrict:"E",
    templateUrl:"/views/student/lectures/controls.html",
    scope:{
      confused:"&",
      fullscreen:"&",
      ask:"&",
      note:"&"
    },
    link: function(scope, element, attrs) {

      scope.screenfull = screenfull
      scope.$on('$destroy', function() {
          shortcut.remove("c");
          shortcut.remove("q");
      });
    	
    	scope.show_message=false;
    	scope.show_shortcuts=false;    	

    	scope.fullBtn = function(){  
        scope.fullscreen()
    	};

      scope.confusedBtn=function(){
        scope.show_message=true;
        scope.confused()
        $interval(function(){
          scope.show_message=false;
        }, 2000, 1);
      }

      scope.questionBtn=function(){
        scope.ask()
      }

      scope.notesBtn=function(){
        scope.note()
      }

      scope.showShortcuts=function(){
        scope.show_shortcuts=!scope.show_shortcuts;
        if(scope.show_shortcuts)
          $(document).on("click", function (e) {
            if(e.target.className != 'shortcutDiv'){
              scope.show_shortcuts = false
              scope.$apply()
              $(document).off("click")
            }         
          });
        else
          $(document).off("click")        
      }

    	scope.setShortcuts = function()
  		{
  				shortcut.add("c", function(){
            scope.confusedBtn()
            scope.$apply()
          }, {"disable_in_input" : true});  

  				shortcut.add("q", function(){
            scope.questionBtn()
            scope.$apply()
          }, {"disable_in_input" : true});
          shortcut.add("n", function(){
            scope.notesBtn()
            scope.$apply()
          }, {"disable_in_input" : true});
  		}
      scope.setShortcuts()

    }
  };

}])
.directive("notification", ['$translate', '$log', function($translate, $log) {
  return {
    restrict:"E",
    scope:{
      message:'=',
      submessage:'='
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
    scope:{
      action:"&"
    },
  	template: '<div style="position: absolute;z-index: 1000;top: 9px;left: 47%;width: 0px;">'+
                '<input type="button" class="btn btn-success" value="{{\'youtube.check_answer\'|translate}}" ng-click="action()" style="height: 25px; vertical-align: -webkit-baseline-middle; padding: 0px 10px; background-image: initial;" />'+
              '</div>',
  	link: function(scope, element, attrs) {}
  }
}])
.directive('studentAnswerForm', ['Lecture','$stateParams','CourseEditor','$log',function(Lecture, $stateParams, CourseEditor, $log){
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
		template:"<li class='ui-state-default'>"+
					"<ng-form name='aform'>"+
							"<span class='ui-icon ui-icon-arrowthick-2-n-s handle'></span>"+
							"{{answer}}"+
					"</ng-form>"+
				"</li>"				 
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
      link: function(scope){
      	$log.debug("in student answer video!!!");
      }
  }
}])
.directive('studentAnswer', ['$rootScope', '$translate','$log', function($rootScope, $translate, $log){
  return {
     replace:true,
     restrict: 'E',
     template: "<input type='checkbox' name='student_answer' ng-model='data.selected' ng-change='radioChange(data)' ng-style='{left: xcoor, top: ycoor, position: \"absolute\"}' pop-over='explanation_pop'/>",

    link: function(scope, element, attrs, controller) {
      $log.debug("student answer link")
      element.css('z-index', 5)
      //==FUNCTIONS==//
      var setup=function(){
        scope.explanation_pop ={}
        var type= scope.quiz.question_type =="MCQ"? "checkbox" :"radio"
        element.attr('type',type)
      }

      var setAnswerLocation=function(){
        $log.debug("setting answer location")
        var ontop=angular.element('.ontop');    
        var w = scope.data.width * ontop.width();
        var h = scope.data.height* (ontop.height());
        var add_left= (w-13)/4.0
        var add_top = (h-13)/4.0
        scope.xcoor = parseFloat(scope.data.xcoor * ontop.width())// - add_left;       
        scope.ycoor = parseFloat(scope.data.ycoor * (ontop.height())) //- add_top;
        scope.explanation_pop.rightcut =  (ontop.css('position') == 'fixed')
        $log.debug(scope.xcoor)
        $log.debug(scope.ycoor)
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

      $rootScope.$on("updatePosition",function(){
        $log.debug("event emiited updated position")
        setAnswerLocation()
      })         
     
      scope.$watch('explanation[data.id]', function(newval){
        if(scope.explanation && scope.explanation[scope.data.id])
        {
          var ontop=angular.element('.ontop');  
          scope.explanation_pop={
            title:"<b ng-class='{green_notification: explanation[data.id][0], red_notification: !explanation[data.id][0]}'>{{explanation[data.id][0]?('lectures.correct'|translate):('lectures.incorrect'|translate)}}</b>",
            content:"<div>{{explanation[data.id][1]}}</div>",
            html:true,
            trigger:'hover',
            rightcut: (ontop.css('position') == 'fixed')
          }
        } 
      })

      setup()
      setAnswerLocation()
      
    }
  };
}])

.directive('studentDrag',['$rootScope','$translate','$log', function($rootScope, $translate, $log){
  return {
    restrict:'E',
    template:'<div ng-style="{left: xcoor, top: ycoor, width:width, height:height, position: \'absolute\',  marginTop:\'0px\'}" data-drop="true" jqyoui-droppable=\'{onDrop:"setDropped", onOver:"formatDropped", onOut:"clearDropped"}\' class="drop-div" ></div>'+
             '<b class="dragged handle" data-drag="true" data-jqyoui-options=\'{containment:".ontop"}\' jqyoui-draggable=\'{onStart:"formatDrag", onDrag:"adjustDrag"}\' pop-over="explanation_pop">{{data.answer}}</b>',
    link:function(scope,elem){
      $log.debug("student drag")
      $log.debug(scope.data)
      var setAnswerLocation=function(){
        $log.debug("setAnswerLocation")
        var ontop=angular.element('.ontop');
        scope.width  = scope.data.width * ontop.width() -27;
        scope.height = scope.data.height* (ontop.height());
        scope.xcoor = (scope.data.xcoor * ontop.width())+27
        scope.ycoor = (scope.data.ycoor * (ontop.height()))
        scope.explanation_pop.rightcut =  (ontop.css('position') == 'fixed')
      }
      
      var setup=function(){
      	$log.debug("setup function")
      	var drag_elem = angular.element('#'+scope.data.id)
  		  destroyPopover(drag_elem)
      	scope.explanation_pop={}
      	scope.explanation[scope.data.id] = null
      }
      
      $rootScope.$on("updatePosition",function(){
        $log.debug("event emitted updated position")
        setAnswerLocation()
       	var drag_elem = angular.element('#'+scope.data.id)
        resizeAnswer(drag_elem)
    	}) 
      
      scope.formatDrag=function(event, ui){
        var drag_elem = angular.element(ui.helper[0])
        reverseSize(drag_elem)
      }

      scope.adjustDrag=function(event, ui){
        var drag_elem = angular.element(ui.helper[0])
        var ontop = angular.element('.ontop');
        var left= event.pageX - ontop.offset().left
        var top = event.pageY - ontop.offset().top
        
        if((event.pageX - drag_elem.width())< ontop.offset().left)
        	ui.position.left = 0
        else if(left> ontop.width())
        	 ui.position.left = ontop.width() -  drag_elem.width()
      	else
      		ui.position.left = left - drag_elem.width()

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
          ui.draggable.addClass('dropped')
          resizeAnswer(ui.draggable, drop_elem)
          scope.studentAnswers[scope.quiz.id][scope.data.id]=ui.draggable.text()
          ui.draggable.attr('id', scope.data.id)
          scope.$apply()
        }
        else{   
          var drag_elem = angular.element('#'+scope.data.id)
          reverseSize(drag_elem)
          clear(drag_elem)
          scope.setDropped(event, ui)
        }
      }
	
       scope.clearDropped=function(event, ui){
       	destroyPopover(ui.draggable)
        clear(ui.draggable)
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
          scope.selected_id= angular.element(elem[0]).find('b').attr('id')
          var ontop=angular.element('.ontop');
          scope.explanation_pop={
            title:"<b ng-class='{green_notification: explanation[selected_id][0], red_notification: !explanation[selected_id][0]}'>{{explanation[selected_id][0]?('lectures.correct'|translate):('lectures.incorrect'|translate)}}</b>",
            content:"<div>{{explanation[selected_id][1]}}</div>",
            html:true,
            trigger:'hover',
            rightcut: (ontop.css('position') == 'fixed')
          }
          var bg_color = scope.explanation[scope.data.id][0]? "darkseagreen": "orangered"
          angular.element('#'+scope.data.id).css('background-color', bg_color)
        } 
      })

  	  setup()
      setAnswerLocation()
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
}]).directive('studentTimeline', function() {
  return {
    restrict:"E",
    scope:{
      timeline:'=',
      lectures:'=',
      lecture:'=current',
      seek:'&'
    },
    templateUrl:'/views/student/lectures/student_timeline.html',
    link: function(scope, element, attrs) {
      // scope.checkModel={quiz:true,confused:true, discussion:true};
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
}).directive('confusedTimeline',['Lecture', function(Lecture){
  return{
    restrict:"A",
    // replace:true,
    scope:{
      item:'=',
      seek:'&'
    },
    templateUrl:'/views/student/lectures/confused_timeline.html',
    link:function(scope, element, attrs){
      var unwatch = scope.$watch('item.data.very',function(){
          scope.msg =scope.item.data.very? 'courses.really_confused': 'courses.confused'
      })

      scope.deleteConfused = function(confused){
        Lecture.deleteConfused(
        {
          lecture_id: confused.data.lecture_id, 
          confused_id: confused.data.id
        }, 
        function(response){
          console.log("deleted");
          unwatch()
          // delete scope.item
          scope.$emit('update_timeline', confused)
          // now want to remove from list (both l.confuseds and $scope.timeline..)
          // var index=scope.timeline['lecture'][lecture_id].items.indexOf(confused);
          // scope.timeline['lecture'][lecture_id].items.splice(index, 1)
        });
      }

    }
  }
}])
.directive('quizTimeline',function(){
  return{
    restrict:"A",
    // replace:true,
    scope:{
      item:'=',
      seek:'&',
    },
    templateUrl: '/views/student/lectures/quiz_timeline.html',
    link:function(scope, element, attrs){}
  }
})
.directive('notesTimeline',['$log','Lecture','$state', function($log,Lecture,$state){
  return{
    restrict:"A",
    scope:{
      item:'=',
      seek:'&'
    },
    templateUrl:"/views/student/lectures/notes_timeline.html",
    link:function(scope,element,attrs){

      scope.deleteNote=function(){
        scope.$emit('update_timeline', scope.item)
      }

      scope.saveNote=function(data){
        Lecture.saveNote(
          {lecture_id:$state.params.lecture_id}, 
          {
            data: data,
            time: scope.item.time
          }, 
          function(response){}, 
          function(response){}
        );
      }

    }
  }
}]).directive('notesArea', ['$timeout',
    function($timeout) {
        return {
            template: '<div onshow="moveCursorToEnd()" ng-mouseover="overclass = true" ng-mouseleave="overclass= false"  e-rows="8" e-cols="50" blur="submit" editable-textarea="value" e-form="myform" buttons="no" onaftersave="saveData()" e-placeholder="Note..." ng-click="show()">'+
                        '<pre style="color: teal;">'+
                          '{{ value || ("empty"|translate)  }}'+
                          '<span ng-show="overclass" style="float: right;font-size: 9px;bottom: -8px;position: relative;">click to edit</span>'+
                        '</pre>'+
                      '</div>',
            restrict: 'E',
            scope: {
                value: "=",
                save: "&",
                delete:"&"
            },
            link: function(scope, element) {

                scope.moveCursorToEnd=function(){
                  $timeout(function() {
                      // element.find('.editable-input').select();
                      var SearchInput = $('.editable-input');
                      var strLength= SearchInput.val().length;
                      SearchInput.focus();
                      SearchInput[0].setSelectionRange(strLength, strLength);
                  });
                }
                scope.show=function(){
                  scope.myform.$show()
                }

                if(!scope.value)
                  scope.show()

                scope.saveData = function() {
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