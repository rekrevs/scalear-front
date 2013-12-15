'use strict';

angular.module('scalearAngularApp')
.directive("controls",['$timeout','Lecture','$stateParams', '$window', function($timeout, Lecture, $stateParams, $window) {
  return {
    restrict:"E",
    templateUrl:"../views/student/lectures/controls.html",
    link: function(scope, element, attrs) {

    	element.css("width", "200px");
  		element.css("height", "26px");
  		element.css("position", "relative");
  		element.css("display", "inline-block");
  		element.css("z-index",10000);

		scope.$on('updatePosition',function(){
			setButtonsLocation()
		})
    	
      	scope.show_message=false;
      	scope.show_question=false;
      	scope.show_shortcuts=false;
      	
      	var setButtonsLocation=function(){
      		if(scope.fullscreen){
  	    		scope.pWidth=angular.element($window).width();
  	    		scope.pHeight=angular.element($window).height();
      		}
      		else{
  	    		scope.pHeight=480;
  	    		scope.pWidth= scope.lecture.aspect_ratio=='widescreen'? 800:600;
      		}

      		element.css("top", scope.pHeight-26+"px");
      		element.css("left", scope.pWidth-350+"px");
      	}
      	
      	scope.full = function(){   			
      		scope.fullscreen? scope.resize.small() : scope.resize.big();
      	};
      	scope.confused= function()
      	{
      		console.log(scope.$parent);
      		console.log("in confusde");
  			scope.show_message=true;
      		Lecture.confused({course_id:$stateParams.course_id, lecture_id:$stateParams.lecture_id},{time:scope.lecture_player.controls.getTime()}, function(data){
    			$timeout(function(){
             		scope.show_message=false;
             		console.log(data)
             		if(data.msg=="ask")
             		{
	             		scope.$parent.show_notification="If you're really confused, please use the question button to ask a question so the teacher can help you.";
	             		scope.$parent.notify_position={"left":(scope.pWidth - 300) + "px", "top":(scope.pHeight - 180) + "px" }
	             		$timeout(function(){
	             			scope.$parent.notify_position={"left":"180px"};
	             			scope.$parent.show_notification=false;
	             		}, 3000)
	             	}
         		}, 2000);	
    		});
      	};
      	scope.back= function()
      	{
      		Lecture.back({course_id:$stateParams.course_id, lecture_id:$stateParams.lecture_id},{time:scope.lecture_player.controls.getTime()}, function(data){
    		});
      	};
      	scope.pause= function()
      	{
      		Lecture.pause({course_id:$stateParams.course_id, lecture_id:$stateParams.lecture_id},{time:scope.lecture_player.controls.getTime()}, function(data){
    		});
      	};
      	scope.question= function()
      	{
      		console.log("in question");
      		scope.show_question=!scope.show_question;
      		if(scope.show_question==true)
      			scope.lecture_player.controls.pause();	
      		else
      			scope.lecture_player.controls.play();
      	};
      	scope.submit_question = function()
      	{
      		console.log("will submit "+scope.question_asked);
    		Lecture.confusedQuestion({course_id:$stateParams.course_id, lecture_id:$stateParams.lecture_id},{time:scope.lecture_player.controls.getTime(), ques: scope.question_asked}, function(data){
    			scope.question_asked="";
    			scope.show_question=false;
    			scope.lecture_player.controls.play();	
    		});
      		
      	};
      	scope.setShortcuts = function()
		{
				// adding shortcuts
				shortcut.add("c", scope.confused, {"disable_in_input" : true});
			
				shortcut.add("q", scope.question, {"disable_in_input" : true});
			
				shortcut.add("Space",function(){
					scope.lecture_player.controls.paused()? scope.lecture_player.controls.play(): scope.lecture_player.controls.pause();
				},{"disable_in_input" : true});
			
				shortcut.add("b",function(){
					var t=scope.lecture_player.controls.getTime();
					scope.lecture_player.controls.seek(t-10);
					scope.back();
				},{"disable_in_input" : true});
		};

		setButtonsLocation()
		scope.setShortcuts();
		
		scope.lecture_player.events.onPause= function(){
   			console.log("in here");
   			if(scope.display_mode!=true) //not a quiz
   				scope.pause();
   		}
   		
   		scope.$watch('lecture.aspect_ratio', function(){
   			setButtonsLocation()
   		})
		
    }
  };
}])
.directive("notification", ['$translate', '$window', function($translate, $window) {
  return {
    restrict:"E",
	template:'<div class="well" style="font-size:12px;padding:5px;"><div ng-show="show_notification==true"><center><b ng-class="{\'green_notification\':verdict== correct_notify , \'red_notification\':verdict==incorrect_notify }"><span>{{verdict}}</span></b><br/><p ng-hide="selected_quiz.quiz_type==\'html\' && selected_quiz.question_type.toUpperCase()==\'DRAG\'" translate="lectures.hover_for_details"></center></div><div ng-show="show_notification!=true">{{show_notification}}</div></div>',
	
    link: function(scope, element, attrs) {
    	scope.correct_notify=$translate("lectures.correct")
    	scope.incorrect_notify=$translate("lectures.incorrect")
    	
    	element.css("position", "relative");
		element.css("top", "330px");
		element.css("left","180px");
		element.css("padding","5px");
		element.css("font-size", "12px");
		element.children().css("width", "150px");
		element.css("z-index","10000");
		element.css("display","block");
		
		// // remove this?
		// angular.forEach(['pWidth', 'pHeight'], function (key) {
	      	// scope.$watch(key, function(){
	      			// element.css("top", scope.pHeight-180+"px");
	      			// console.log("playerHeight is "+scope.playerHeight);
	      			// if(!scope.fullscreen)
		    			// element.css("z-index",1000);
		    		// else	
		    			// element.css("z-index",10000);
			// });
		// });

      var setNotficationPosition=function(){
        console.log(scope.fullscreen)
        if(scope.fullscreen)
        {
         scope.pHeight=angular.element($window).height()- 140;
          element.css("z-index",10000);
        }else{
        scope.pHeight= 480-140;
        element.css("z-index",1000);
        }
      
      element.css("top", scope.pHeight+"px");
      }

      setNotficationPosition()
    }
  };
}])

.directive("check",['$timeout', 'Lecture', '$stateParams','$translate', '$window', function($timeout, Lecture, $stateParams, $translate, $window) {
  return {
    restrict:"E",
	template:'<input type="button" class="btn btn-primary" value="{{\'youtube.check_answer\'|translate}}" ng-click="check_answer()" />',
	link: function(scope, element, attrs) {
    
    element.css("position", "relative");
		element.css("z-index",10000);
		element.children().css("height", "25px");

		scope.$on('updatePosition',function(){
			console.log('updatePosition')
			setButtonsLocation()
		})

    var setButtonsLocation=function(){
      console.log(scope.fullscreen)
      if(scope.fullscreen)
        scope.pHeight=angular.element($window).height()- 36;
      else
        scope.pHeight=443;
      element.css("top", scope.pHeight+"px");
    }		
    	
  	setButtonsLocation()

		scope.check_answer = function()
		{			
			console.log("check answer "+scope.solution);
			if(scope.selected_quiz.quiz_type=="invideo"){
			 	sendAnswers()
    		}else{
    			console.log(scope.answer_form);
    			
    			if(scope.answer_form.$error.atleastone==false)
    			{
    				console.log("valid form")
    				scope.submitted=false;
	    			Lecture.saveHtml({course_id: $stateParams.course_id, lecture_id:$stateParams.lecture_id},{quiz:scope.selected_quiz.id, answer:scope.studentAnswers[scope.selected_quiz.id]}, function(data){
	    			 
	    			 displayResult(data);
	    			
    		 	});
    		 }else{
    		 	console.log("invalid form")
    		 	scope.submitted=true;
    		 }
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
          	console.log(scope.$parent);
          	// notify
          	scope.$parent.show_notification=$translate("groups.choose_correct_answer")//"You must choose atleast one answer";
   				$timeout(function(){
	             		 scope.$parent.show_notification=false;
	         	}, 2000);
          	return		
          }

          if(scope.selected_quiz.question_type == "OCQ" && selected_answers.length==1)
            selected_answers = selected_answers[0]
           
        }
        else
        {
          selected_answers={}
          selected_answers = scope.studentAnswers[scope.selected_quiz.id]
          var count = 0
          for (var el in selected_answers)
            if(selected_answers[el])
              count++
            
          if(count<scope.selected_quiz.online_answers.length)
          {
          	scope.$parent.show_notification=$translate("groups.must_place_items");
   				$timeout(function(){
	             		 scope.$parent.show_notification=false;
	         	}, 2000);
            return
           }
        }
        Lecture.saveOnline(
          {
            course_id:$stateParams.course_id,
            lecture_id:$stateParams.lecture_id,
          },
          {
            quiz: scope.selected_quiz.id,
            answer:selected_answers
          },
          function(data){
            console.log(data)
            displayResult(data)
          },
          function(){}
        )
      }

  		

      var displayResult=function(data){
        for(var el in data["detailed_exp"])
          scope.explanation[el]= data["detailed_exp"][el];

        scope.verdict=data["correct"]? $translate("lectures.correct"): $translate("lectures.incorrect")
        scope.$parent.show_notification=true;

		if(data["msg"]!="Empty") // he chose sthg
	    {
	    	scope.selected_quiz.is_quiz_solved=true;
	    	scope.$emit('accordianReload');
			scope.$emit('accordianUpdate',{g_id:scope.lecture.group_id, type:"lecture", id:scope.lecture.id});
	    }
        $timeout(function(){
          scope.$parent.show_notification=false;
        }, 2000);             
      }


    }
  }
}])
.directive('studentAnswerForm', ['Lecture','$stateParams','CourseEditor',function(Lecture, $stateParams, CourseEditor){
	return {
		scope: {
			quiz:"=",
			studentAnswers:"=",
			submitted: "=",
			explanation:"=",
		},
		restrict: 'E',
		template: "<ng-form name='qform'><div style='text-align:left;margin:10px;'>"+
							"<label class='q_label'>{{quiz.question}}:</label>"+
							"<div class='answer_div'>"+
								"<student-html-answer />"+
							"</div>"+
					"</div></ng-form>",
		link: function(scope, iElm, iAttrs, controller) {
			
		}
	};
}]).directive('studentHtmlAnswer',function(){
	return {
	 	restrict: 'E',
	 	template: "<div ng-switch on='quiz.question_type.toUpperCase()' style='/*overflow:auto*/' >"+
					"<div ng-switch-when='MCQ' ><student-html-mcq  ng-repeat='answer in quiz.online_answers' /></div>"+
					"<div ng-switch-when='OCQ' ><student-html-ocq  ng-repeat='answer in quiz.online_answers' /></div>"+	
					"<ul  ng-switch-when='DRAG' class='drag-sort sortable' ui-sortable ng-model='studentAnswers[quiz.id]'>"+
						"<student-html-drag ng-repeat='answer in studentAnswers[quiz.id]' />"+
					"</ul>"+
				"</div>",
		link:function(scope){
		
			scope.updateValues= function()
			{
				console.log("in value update")
				console.log(scope.studentAnswers);
				console.log(scope.quiz.question_type);
				console.log(scope.studentAnswers[scope.quiz.id]);
				scope.values=0
				if(scope.quiz.quiz_type=="html" && scope.quiz.question_type=="OCQ")
				{
					if(typeof(scope.studentAnswers[scope.quiz.id])=="string")
						scope.values+=1
				}
				else{
					
				
				for(var element in scope.studentAnswers[scope.quiz.id])
				{
					console.log(scope.studentAnswers[scope.quiz.id][element]);
					if(scope.studentAnswers[scope.quiz.id][element]==true)
					{
						console.log("in true");
						scope.values+=1
					}
				}
				
				}
			console.log(scope.values)
			}
			scope.$watch('quiz.question', function(){
				scope.updateValues();	
			})
			
		}
	};
}).directive('studentHtmlMcq',['$translate',function($translate){	
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
					console.log("exp changed!!!")
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
	
}]).directive('studentHtmlOcq',['$translate','$timeout',function($translate, $timeout){
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
					console.log("exp changed!!!")
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
							"<span class='ui-icon ui-icon-arrowthick-2-n-s'></span>"+
							"{{answer}}"+
					"</ng-form>"+
				"</li>"				 
	}
	
})
.directive("studentAnswerVideo",function(){
  return {
    restrict:"E",
    scope:{
      quiz:"=",
      data:"=",
      explanation:"=",
      studentAnswers:"="
    },
    template: "<div ng-switch on='quiz.question_type'>"+
                "<div ng-switch-when='MCQ'><student-answer /></div>"+
                "<div ng-switch-when='OCQ'><student-answer /></div>"+
                "<div ng-switch-when='drag'><student-drag /></div>"+
              "</div>",
      link: function(scope){
      	console.log("in student answer video!!!");
      }
  }
})
.directive('studentAnswer', ['$compile', '$rootScope', '$translate', function($compile, $rootScope, $translate){
  return {
     replace:true,
     restrict: 'E',
     template: "<input type='checkbox' name='student_answer' ng-model='data.selected' ng-change='radioChange(data)' ng-style='{left: xcoor, top: ycoor, position: \"absolute\"}' pop-over='explanation_pop'/>",

    link: function(scope, element, attrs, controller) {
      console.log("student answer link")

      //===FUNCTIONS===//
      var setType=function(){
          var type= scope.quiz.question_type =="MCQ"? "checkbox" :"radio"
          element.attr('type',type)
      }

      var setAnswerLocation=function(){
        console.log("setting answer location")
        var ontop=angular.element('.ontop');    
        var w = scope.data.width * ontop.width();
        var h = scope.data.height* (ontop.height());
        var add_left= (w-13)/2.0
        var add_top = (h-13)/2.0
        scope.xcoor = parseFloat(scope.data.xcoor * ontop.width()) + add_left;       
        scope.ycoor = parseFloat(scope.data.ycoor * (ontop.height())) + add_top;
        
         console.log(scope.xcoor)
        console.log(scope.ycoor)
      } 

      scope.radioChange=function(corr_ans){
        if(scope.quiz.question_type == "OCQ"){
          console.log("radioChange")
          scope.quiz.online_answers.forEach(function(ans){
            ans.selected=false
          })
          corr_ans.selected=true
        }
      }

      $rootScope.$on("updatePosition",function(){
        console.log("event emiited updated position")
        setAnswerLocation()
      })         
     
      scope.$watch('explanation[data.id]', function(newval){
        if(scope.explanation && scope.explanation[scope.data.id])
        {
          scope.explanation_pop={
            title:"<b ng-class='{green_notification: explanation[data.id][0], red_notification: !explanation[data.id][0]}'>{{explanation[data.id][0]?('lectures.correct'|translate):('lectures.incorrect'|translate)}}</b>",
            content:"<div>{{explanation[data.id][1]}}</div>",
            html:true,
            trigger:'hover'
          }
        } 
      })

      setType()
      setAnswerLocation()
    }
  };
}])

.directive('studentDrag',['$window', '$rootScope','$translate', function($window, $rootScope, $translate){
  return {
    restrict:'E',
    template:'<div ng-style="{left: xcoor, top: ycoor, width:width, height:height, position: \'absolute\',  marginTop:\'0px\'}" data-drop="true" jqyoui-droppable=\'{onDrop:"setDropped", onOver:"formatDropped", onOut:"clearDropped"}\' class="drop-div" ></div>'+
             '<b class="dragged" data-drag="true" data-jqyoui-options=\'{containment:".ontop"}\' jqyoui-draggable=\'{onStart:"formatDrag", onDrag:"adjustDrag"}\' pop-over="explanation_pop">{{data.answer}}</b>',
    link:function(scope,elem){
      console.log("student drag")
      console.log(scope.data)

      var setAnswerLocation=function(){
        console.log("setAnswerLocation")
        var ontop=angular.element('.ontop');
        scope.width  = scope.data.width * ontop.width();
        scope.height = scope.data.height* (ontop.height());
        scope.xcoor = (scope.data.xcoor * ontop.width())
        scope.ycoor = (scope.data.ycoor * (ontop.height()))
      }
      
      var setup=function(){
      	console.log("setup function")
      	var drag_elem = angular.element('#'+scope.data.id)
  		  destroyPopover(drag_elem)
      	scope.explanation_pop=null
      	scope.explanation[scope.data.id] = null
      }
      
      $rootScope.$on("updatePosition",function(){
        console.log("event emitted updated position")
        setAnswerLocation()
        var drop_elem = angular.element(elem[0]).find('div')
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
      
      var resizeAnswer= function(draggable, droppable){
        console.log('in resize answer')
        draggable.width(scope.width);
        draggable.height(scope.height);
        draggable.css('left', scope.xcoor+12)
        draggable.css('top', scope.ycoor+2)
      }
     
      scope.$watch('explanation[data.id]', function(newval){
        if(scope.explanation && scope.explanation[scope.data.id]){
          scope.selected_id= angular.element(elem[0]).find('b').attr('id')
          scope.explanation_pop={
            title:"<b ng-class='{green_notification: explanation[selected_id][0], red_notification: !explanation[selected_id][0]}'>{{explanation[data.id][0]?('lectures.correct'|translate):('lectures.incorrect'|translate)}}</b>",
            content:"<div>{{explanation[selected_id][1]}}</div>",
            html:true,
            trigger:'hover'
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
