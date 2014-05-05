'use strict';

angular.module('scalearAngularApp')
.directive("controls",['$interval','Lecture','$stateParams', '$window', '$log','$translate','util', function($interval, Lecture, $stateParams, $window, $log, $translate,util) {
  return {
    restrict:"E",
    templateUrl:"/views/student/lectures/controls.html",
    link: function(scope, element, attrs) {

    // 	element.css("width", "200px");
  		// element.css("height", "26px");
  		// element.css("position", "absolute");
  		// element.css("display", "inline-block");
  		//element.css("z-index",10000);

  		scope.$on('updatePosition',function(){
  			setButtonsLocation()
  		})

        scope.$on('$destroy', function() {
            //alert("In destroy of:" + scope);
            shortcut.remove("c");
            shortcut.remove("q");
            shortcut.remove("b");
            shortcut.remove("Space");
            shortcut.remove("Enter");
        });
    	
    	scope.show_message=false;
    	scope.show_question=false;
    	scope.show_shortcuts=false;
      scope.quality=false;
      scope.chosen_quality='hd720';
      	
    	var setButtonsLocation=function(){
    		if(scope.fullscreen){
	    		scope.pWidth=angular.element($window).width();
	    		scope.pHeight=angular.element($window).height();
          element.css("z-index",1500);
    		}
    		else{
	    		scope.pHeight=490;
	    		scope.pWidth= 800;//scope.lecture.aspect_ratio=='widescreen'? 800:600;
           element.css("z-index",1000);
    		}
           // if(scope.ipad){
             //   element.css("top", scope.pHeight-15+"px");
               // element.css("left", scope.pWidth-200+"px");
            //}
            //else{
    		// element.css("top", scope.pHeight-60+"px");
    		// element.css("left", scope.pWidth-200+"px");
//            }
    	}
    	
    	scope.full = function(){   			
    		scope.fullscreen? scope.resize.small() : scope.resize.big();
    	};

    	scope.confusedBtn= function(){
        console.log("caosdnsakn")
        scope.show_message=true;
        var time=scope.lecture_player.controls.getTime()
    		Lecture.confused(
          {
            course_id:$stateParams.course_id, 
            lecture_id:$stateParams.lecture_id
          },
          {time:scope.lecture_player.controls.getTime()}, 
          function(data){
            $interval(function(){
              scope.show_message=false;
            }, 2000, 1);

         		$log.debug(data)
         		if(data.msg=="ask"){
           		scope.show_notification=$translate("controller_msg.really_confused_use_question");
           		scope.notify_position={"left":(scope.pWidth - 180) + "px"}
           		$interval(function(){
           			scope.notify_position={"left":"240px"};
           			scope.show_notification=false;
           		}, 6000, 1)
           	}
            if(!data.flag) //first time confused in these 15 seconds
            {
                //scope.progressEvents.push([((time/scope.total_duration)*100) + '%', 'red', 'courses.confused',data.id ]);
                scope.timeline['lecture'][$stateParams.lecture_id].add(time, "confused", data.item)
            }

            if(data.flag && data.msg!="ask") // confused before but not third time - very confused
            {
                var elem=scope.timeline['lecture'][$stateParams.lecture_id].search_by_id(data.id, "confused");
                scope.timeline['lecture'][$stateParams.lecture_id].items[elem].data.very=true;
                // for(var element in scope.timeline['lecture'])
                // {
                //     if(scope.timeline['lecture'][element]==data.id)
                //     {
                //         scope.progressEvents[element][2]='courses.really_confused'
                //         scope.progressEvents[element][1]='purple'
                //         return;
                //     }
                // }
            }
  		  });
    	}
    	scope.back= function()
    	{
    		Lecture.back({course_id:$stateParams.course_id, lecture_id:$stateParams.lecture_id},{time:scope.lecture_player.controls.getTime()}, function(data){
  		});
    	};
    	scope.questionBtn= function(){
    		scope.show_question=!scope.show_question;
            scope.$parent.current_question_time=scope.lecture_player.controls.getTime();
            util.safeApply();
    		if(scope.$parent.show_question==true)
            {
    			scope.lecture_player.controls.pause();
                scope.$parent.tabs[0].active = true;
            }
    		else
    			scope.lecture_player.controls.play();
    	};

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

    	scope.submitQuestion = function()
    	{
    		$log.debug("will submit "+scope.question_asked);
        var time=scope.lecture_player.controls.getTime()
        if(scope.question_asked!=""){
  		    Lecture.confusedQuestion(
            {
              course_id:$stateParams.course_id, 
              lecture_id:$stateParams.lecture_id
            },
            {
              time:time, 
              ques: scope.question_asked
            }, 
            function(data){
              scope.progressEvents.push([((time/scope.total_duration)*100) + '%', 'yellow', 'courses.you_asked',data.id, scope.question_asked ]);
              scope.question_asked="";
	            scope.show_question=false;
  			      scope.lecture_player.controls.play();	
  		      }
          );
        }
        else{
          scope.show_question=false;
          scope.lecture_player.controls.play(); 
        }
    		
    	};

        scope.showQuality = function(){
            scope.quality=!scope.quality
        }

        scope.setQuality = function(quality){
            var time = scope.lecture_player.controls.getTime()
            scope.lecture_player.controls.changeQuality(quality, time);
            scope.chosen_quality=quality;
            scope.quality=false;
        }
    	scope.setShortcuts = function()
  		{

  				shortcut.add("c", scope.confusedBtn, {"disable_in_input" : true});
  			
  				shortcut.add("q", scope.questionBtn, {"disable_in_input" : true});
  			
  				shortcut.add("Space",function(){
  					scope.lecture_player.controls.paused()? scope.lecture_player.controls.play(): scope.lecture_player.controls.pause();
  				},{"disable_in_input" : true});
  			
  				shortcut.add("b",function(){
              scope.back();
              var t=scope.lecture_player.controls.getTime();
              scope.lecture_player.controls.pause();
              scope.lecture_player.controls.seek(t-10)
              scope.lecture_player.controls.play();
  				},{"disable_in_input" : true});

          shortcut.add("Enter",function(){
            var elem_name=angular.element(document.activeElement).attr('name')
            if(elem_name =='ask')
              scope.submitQuestion()
              scope.$apply()
          },{"disable_in_input" : false, "disable_in_editable" :true});
  		};

  		setButtonsLocation()
      scope.setShortcuts();

   		scope.$watch('lecture.aspect_ratio', function(){
   			setButtonsLocation()
   		})

    }
  };
}])
.directive("notification", ['$translate', '$window', '$log','OnlineQuiz', function($translate, $window, $log, OnlineQuiz) {
  return {
    restrict:"E",
    templateUrl: '/views/student/lectures/notification.html',

    link: function(scope, element, attrs) {
      scope.correct_notify=$translate("lectures.correct")
      scope.incorrect_notify=$translate("lectures.incorrect")

      element.css("position", "relative");
      element.css("top", "305px");
      element.css("left","240px");
      element.css("padding","5px");
      element.css("font-size", "12px");
      element.children().css("width", "150px");
      element.css("z-index","10000");
      element.css("display","block");
      element.children().css("height","85px");
      element.children().css("display","table-cell");
      element.children().css("vertical-align","middle");
      element.children().css("overflow","auto");
      element.css("overflow","auto");

      var setNotficationPosition=function(){
        $log.debug(scope.fullscreen)
        if(scope.fullscreen){
          scope.pHeight=angular.element($window).height()- 210;
          element.css("z-index",10000);
        }
        else{
          scope.pHeight= angular.element('#main-video-container').height()-95;
          element.css("z-index",1000);
        }
        element.css("top", scope.pHeight+"px");
        element.css("position", "absolute");
      }

      scope.voteForReview=function(){
        OnlineQuiz.voteForReview(
          {online_quizzes_id:scope.selected_quiz.id},{},
          function(res){
            if(res.done)
              scope.closeReviewNotify()
          }
        )
      }

      scope.closeReviewNotify=function(){
        scope.review_inclass= false 
      }

      scope.retryQuiz=function(){
        scope.seek(scope.selected_quiz.time, scope.selected_quiz.lecture_id)
        scope.closeReviewNotify()
      }

      setNotficationPosition()

    }
  };
}])

.directive("check",['$interval', 'Lecture', '$stateParams','$translate', '$window', '$log','CourseEditor', function($interval, Lecture, $stateParams, $translate, $window, $log, CourseEditor) {
  return {
    restrict:"E",
	template:'<input type="button" class="btn btn-success" value="{{\'youtube.check_answer\'|translate}}" ng-click="check_answer()" style="height: 25px; vertical-align: -webkit-baseline-middle; padding: 0px 10px; background-image: initial;" />',
	link: function(scope, element, attrs) {

    var setButtonsLocation=function(){
      $log.debug(scope.fullscreen)
      if(scope.fullscreen){
        scope.pHeight=angular.element($window).height()- 68;
        element.css("z-index",10000);
      }
      else{
        scope.pHeight=423;
        element.css("z-index",1000);
      }
     // if(scope.ipad)
       // element.css("top", scope.pHeight+15+"px");
      //else
        // element.css("top", scope.pHeight+"px");

    }		
    	
  	setButtonsLocation()

		scope.check_answer = function(){			
			$log.debug("check answer "+scope.solution);
			if(scope.selected_quiz.quiz_type=="html"){			 	
        $log.debug(scope.answer_form);
        if((!scope.answer_form.$error.atleastone || scope.answer_form.$error.atleastone==false) && !(scope.selected_quiz.question_type=='Free Text Question' && scope.answer_form.$error.required)){
          $log.debug("valid form")
          scope.submitted=false;
          Lecture.saveHtml(
            {
              course_id: $stateParams.course_id, 
              lecture_id:$stateParams.lecture_id
            },
            {
              quiz:scope.selected_quiz.id, 
              answer:scope.studentAnswers[scope.selected_quiz.id]
            }, 
            function(data){
              displayResult(data);
            });
        }
        else{
          $log.debug("invalid form")
          scope.submitted=true;
        }
  		}
      else{
       sendAnswers()
			};
		}
    	
      var sendAnswers=function(){
        var selected_answers
        if(scope.selected_quiz.question_type == "OCQ" || scope.selected_quiz.question_type == "MCQ"){
          selected_answers=[]
          scope.selected_quiz.online_answers.forEach(function(answer){
            if(answer.selected)
              selected_answers.push(answer.id)
          })

          if(selected_answers.length == 0)
          {
          	$log.debug(scope.$parent);
          	// notify
          	scope.show_notification=$translate("groups.choose_correct_answer")//"You must choose atleast one answer";
   				  $interval(function(){
	             		 scope.show_notification=false;
	         	}, 2000, 1);
          	return		
          }

          if(scope.selected_quiz.question_type == "OCQ" && selected_answers.length==1)
            selected_answers = selected_answers[0]
           
        }
        else //DRAG
        {
          selected_answers={}
          selected_answers = scope.studentAnswers[scope.selected_quiz.id]
          var count = 0
          for (var el in selected_answers)
            if(selected_answers[el])
              count++
            
          if(count<scope.selected_quiz.online_answers.length)
          {
          	scope.show_notification=$translate("groups.must_place_items");
   				$interval(function(){
	             		 scope.show_notification=false;
	         	}, 2000, 1);
            return
           }
        }
        Lecture.saveOnline(
          {
            course_id:$stateParams.course_id,
            lecture_id:$stateParams.lecture_id
          },
          {
            quiz: scope.selected_quiz.id,
            answer:selected_answers
          },
          function(data){
              displayResult(data)
          },
          function(){}
        )
      }

  		

      var displayResult=function(data, done){
        for(var el in data.detailed_exp)
          scope.explanation[el]= data.detailed_exp[el];

        // scope.verdict=data.correct? $translate("lectures.correct"): $translate("lectures.incorrect")
        // scope.show_notification=true;

        if(scope.selected_quiz.quiz_type == 'survey' || scope.selected_quiz.question_type.toUpperCase() == 'FREE TEXT QUESTION'){
           if(data.msg!="Empty"){
                scope.selected_quiz.is_quiz_solved=true;
                scope.show_notification='Thank you for your answer';
            }
        }
        else{
          if(data.review)
            scope.verdict= $translate("lectures.reviewed");
          else
            scope.verdict=data.correct? $translate("lectures.correct"): $translate("lectures.incorrect")
   
          scope.show_notification=true;

          if(data.msg!="Empty") // he chose sthg
          {
            // here need to update scope.$parent.$parent
            var group_index= CourseEditor.get_index_by_id(scope.$parent.$parent.course.groups, data.done[1])
            var lecture_index= CourseEditor.get_index_by_id(scope.$parent.$parent.course.groups[group_index].lectures, data.done[0])
            if(lecture_index!=-1 && group_index!=-1)
              scope.$parent.$parent.course.groups[group_index].lectures[lecture_index].is_done= data.done[2]
            scope.selected_quiz.is_quiz_solved=true;

          }
        }
        
        var removeNotification = function(){
          scope.show_notification=false;
          window.onmousemove = null
          reviewInclass()          
          scope.$apply()
         
        }

        $interval(function(){
          window.onmousemove = removeNotification
        }, 600, 1);

      }

      var reviewInclass =function(){
        //if()
        if(!scope.selected_quiz.reviewed)
          scope.review_inclass= true 
      }

    }
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
							"<div class='answer_div'>"+
								"<student-html-answer />"+
							"</div>"+
					"</div></ng-form>",
		link: function(scope, iElm, iAttrs, controller) {
			
		}
	};
}]).directive('studentHtmlAnswer',['$log',function($log){
	return {
	 	restrict: 'E',
	 	template: "<div ng-switch on='quiz.question_type.toUpperCase()' style='/*overflow:auto*/' >"+
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
        var add_left= (w-13)/2.0
        var add_top = (h-13)/2.0
        scope.xcoor = parseFloat(scope.data.xcoor * ontop.width()) + add_left;       
        scope.ycoor = parseFloat(scope.data.ycoor * (ontop.height())) + add_top;
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
.directive('aceEditor',
    ['editor','$interval', function (editor, $interval) {
        return {
            restrict: 'A',
            scope: {
                sync: "=",
                player: "=",
                lecture: "=",
                editors:"="
            },
            link: function (scope, element) {

                scope.$on('$destroy', function() {
                    //alert("In destroy of:" + scope);
                    //editor.destroy();
                    $interval.cancel(scope.editor.autosave);

                    scope.editor.doc.dirty=false;
                    scope.editor.doc.lastSave = 0;
                    scope.editor.doc.info=null;
                    delete scope.editor;
                    //console.log("killing editor");

                });
                //console.log("elment issss ");
                //console.log(element[0]);

                scope.editor = new editor();
                scope.editor.rebind(element[0]);
                scope.editors[scope.lecture.id]=scope.editor;
                //scope.editor.resize();

                scope.$watch("url", function(val){

                    if(scope.lecture)
                    {
                        //console.log(scope.lecture);
                        //editor.create(scope.url);
                       scope.editor.create(scope.lecture.url, scope.player, scope.lecture.id, scope.lecture.cumulative_duration, scope.lecture.name, scope.lecture.note);
                        //console.log(scope.player.controls.getUrl());
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
    }]);
