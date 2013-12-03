'use strict';

angular.module('scalearAngularApp')
.directive("controls",['$timeout','Lecture','$stateParams', function($timeout, Lecture, $stateParams) {
  return {// doesnt work with ng-class - only if used from the very beginning..
    restrict:"E",
    // no scope hence same as the controller scope.
    templateUrl:"../views/student/lectures/controls.html",
    link: function(scope, element, attrs) {
    	
    	console.log("scop in directive is ");
    	console.log(scope);
    	element.css("width", "200px");
  		element.css("height", "26px");
  		element.css("position", "relative");
  		element.css("left", "393px");
  		element.css("top", "-30px");
  		element.css("display", "inline-block");
		
    	angular.forEach(['playerWidth', 'playerHeight'], function (key) {
	      	scope.$watch(key, function(){
	      		console.log("playerHeight is "+scope.playerHeight);
		    	//element.css("top", scope.playerHeight-26+"px");
		    	element.css("left", scope.playerWidth-350+"px");
			});
		});
    	
      	scope.show_message=false;
      	scope.show_question=false;
      	scope.show_shortcuts=false;
      	scope.full_screen=false;
      	
      	
      	scope.full = function()
      	{
      		scope.safeApply(function(){
      			scope.full_screen= !scope.full_screen;	
      		});
      		
      		
      		if(scope.full_screen)
      			$("body").css("overflow","hidden").css("position","fixed");
      		else
      			$("body").css("overflow","").css("position","");
      		
      	};
      	scope.confused= function()
      	{
      		console.log("in confusde");
      		scope.safeApply(function(){
      			scope.show_message=true;
      		});
      		Lecture.confused({course_id:$stateParams.course_id, lecture_id:$stateParams.lecture_id},{time:scope.lecture_player.controls.getTime()}, function(data){
    			$timeout(function(){
             		scope.show_message=false;
         		}, 2000);	
    		});
      		
      	};
      	scope.back= function(time)
      	{
      		Lecture.back({course_id:$stateParams.course_id, lecture_id:$stateParams.lecture_id},{time:scope.lecture_player.controls.getTime()}, function(data){
    		});
      	};
      	scope.pause= function(time)
      	{
      		Lecture.pause({course_id:$stateParams.course_id, lecture_id:$stateParams.lecture_id},{time:scope.lecture_player.controls.getTime()}, function(data){
    		});
      	};
      	scope.question= function()
      	{
      		console.log("in question");
      		scope.safeApply(function(){
	      		scope.show_question=!scope.show_question;
	      	});
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
					scope.back(t);
				},{"disable_in_input" : true});
		};
		scope.setShortcuts();
		
    }
  };
}])
.directive("resizeontop", function() {
  return {// doesnt work with ng-class - only if used from the very beginning..
    restrict:"A",

    link: function(scope, element, attrs) {
    	console.log("in resize ontoppppp")
      	angular.forEach(['full_screen', 'wWidth', 'wHeight','playerWidth','playerHeight'], function (key) {
	      	scope.$watch(key, function(){
	      		console.log("in watch resize ontop");
	      		if(scope.full_screen){
	      			element.css("margin-left", "0px").css("margin-top","0px").css("z-index",1050).height(scope.wHeight-26).width((scope.wHeight-26)*scope.aspect_ratio); //-50 for control bar;
	      			
	      			if(element.width()>scope.wWidth)  // if width will get cut out.
					{
						console.log("bigger");
						element.width(scope.wWidth).height(scope.wWidth*1.0/scope.aspect_ratio);
						var lf= (scope.playerHeight -26 - element.height())/2.0;
						element.css("margin-top", lf+"px");
					}
					else{
						console.log("smaller")
						var lf= (scope.playerWidth - element.width())/2.0;
						element.css("margin-left", lf+"px");
					}
	      			
	      		}else{
	      			console.log("in smallscreen ontop");
	      			element.css("margin-left", "").css("margin-top", "").width(800).height(450).css("z-index",""); // back to original.
	      		}
	      		
	      		scope.safeApply(function(){
	      			scope.oWidth= element.width();
    				scope.oHeight=element.height();
	      		});
	      		
	      	});
      	});
      }	
    };  	
})
.directive("resize", function($timeout, Lecture) {
  return {// doesnt work with ng-class - only if used from the very beginning..
    restrict:"A",

    link: function(scope, element, attrs) {
    	
    	// scope.safeApply(function(){
    		// scope.playerWidth=800;
    		// scope.playerHeight=476;
    		// console.log("here "+scope.playerWidth);
    	// });
    	
      	angular.forEach(['full_screen', 'wWidth', 'wHeight'], function (key) {
			scope.$watch(key, function(){
	      		
	      		if(scope.full_screen){
	      			element.css("margin-left", "0px").css("margin-top", "0px").width(scope.wWidth).height(scope.wHeight);
	      		}else{
	      			element.css("margin-left", "").css("margin-top", "").width(800).height(476); // back to original.
	      		}
	      		
	      		scope.safeApply(function(){
	      			
	      			scope.playerWidth=element.width();
    				scope.playerHeight=element.height();
    				console.log("in here setting height to "+scope.playerHeight);
    			});
    	
	      	});
      	});
      }	
    };  	
})
.directive("position", function($timeout, Lecture,$parse) {
  return {
    restrict:"A",
    
    link: function(scope, element, attrs) {
    	
    	 element.droppable({    // not working yet ...
        				 accept:function(elem) {
    							console.log(elem);
    						  if (scope.list2.length >= 2) {
        							return false;
      						} else {
        							return true;
      							}
    
        				 }
        		});
        					// console.log(elem);
        					// if(elem.hasClass("list1")) // list1
        					// {
        						// console.log(scope.list2);
        						// console.log(scope.list1[elem.data("index")]); // what im dragging.
        						// var obj=scope.list1[elem.data("index")];
        						// for (var i = 0; i < scope.list2.length; i++) {
        							// console.log(scope.list2[i]);
        							// console.log(obj);
     							   // if (scope.list2[i] === obj) {
            							// return false;
        							// }
    							// }
        						// //if dragged one is x, then should not find it at all in list.
        					// }else{ // from list2
        						// console.log(scope.list2);
        						// console.log(scope.list2[elem.data("index")]); // what im dragging.
        						// var obj=scope.list2[elem.data("index")];
//         						
        						// var num=0;
        						// for (var i = 0; i < scope.list2.length; i++) {
        							// if(i== elem.data("index")) continue;
     							   // if (scope.list2[i] === obj) {
            							// return false;
        							// }
    							// }
//     							
        						// // if dragged one is x, then should find x only once in list.
        					// }
        					// return true;
          					// // var dragIndex = angular.element(ui.draggable).data('index'),
              						// // //reject = angular.element(ui.draggable).data('reject'),
              					// // dragEl = angular.element(ui.draggable).parent(),
// //               					
              					// // dropEl = angular.element(this);
              					// // scope.list2[attrs['index']]=scope.list1[dragIndex];
            					// // scope.list1[dragIndex]={};
          						// // console.log(dragEl);
          						// // console.log(dropEl);
          						// // console.log(dragIndex);
          						// // console.log(scope.list2);
          						// // console.log(scope.list1);
          						// // console.log(attrs['index']);
        						// }
      				// });
//     	
    	attrs.$observe('index', function(actual_value) {
			
			scope.$watch('list2', function(){
				console.log(scope.list2);
				// as soon as I change give 500 ms timeout so nothing else does?
				
			});
			
     	  	scope.$watch('explanation', function(){
     	  		
     	  			for(var e in scope.explanation)
     	  			{
						var objid=attrs.objid;
     	  				if(parseInt(objid)==parseInt(e))
     	  				{
     	  					scope.popoverContent=scope.explanation[e][1];
     	  					scope.popoverTitle=scope.explanation[e][0]? "Correct":"Incorrect";
     	  				}
     	  			}
     	  			
     	  	});
     	  
     	  	angular.forEach(['oWidth', 'oHeight'], function (key) {
	      	scope.$watch(key, function(){
	      		var add_left=0;
	      		var add_top=0;
	      		if(scope.question_type=="OCQ" || scope.question_type=="MCQ" )
	      		{
	      			console.log("choices are");
	      			console.log(scope.choices);
	      			add_left= (parseFloat(scope.choices[actual_value].width* scope.oWidth) -13) /2.0;
	      			add_top= (parseFloat(scope.choices[actual_value].height* scope.oHeight) - 13)/2.0;
	      		}else{ //drag
	      			element.css("position","absolute");
	      			element.css("padding","0px");
	      			element.width(parseFloat(scope.choices[actual_value].width* scope.oWidth));
	      			element.height(parseFloat(scope.choices[actual_value].height* scope.oHeight));
	      			element.children().width(element.width());
	      			element.children().height(element.height());
	      			element.children().css("padding","0px");
	      			
	      		}
     	  		element.css("top", parseFloat(scope.choices[actual_value].ycoor * scope.oHeight) + add_top);
    			element.css("left", parseFloat(scope.choices[actual_value].xcoor * scope.oWidth) + add_left);
    		});
    	});
    	
    	
    	
    	
    	scope.update_solution = function($event,answerid)
    	{
    		console.log(attrs.value);
    		console.log(answerid);
    		if(scope.question_type=="OCQ") //ocq
    		{
    			for(var e in scope.solution)
    			{
    				scope.solution[e]=false;  // turn all false.
    			}
    			scope.solution[answerid]=true;
    		}
    		else{ // mcq
    			
    			var checkbox = $event.target;
  				scope.solution[answerid] = (checkbox.checked ? true : false);
  				
    			
    			
    			// if mcq need to check first if it is selected or not! and in ocq need to change all others to false.
    			// also need to adjust the controller action to deal with objects dayman..
    		}
    		console.log(scope.solution);
    		
    	};
    	
    	});
    }
  };
})
.directive("notification", function($timeout, Lecture) {
  return {// doesnt work with ng-class - only if used from the very beginning..
    restrict:"E",
    // use replace?
	template:'<div class="well"><center><b ng-class="{\'green_notification\':verdict==\'Correct\', \'red_notification\':verdict==\'Incorrect\'}">{{verdict}}</b><br/>Hover for details...</center></div>',
	
    link: function(scope, element, attrs) {
    	element.css("position", "relative");
		element.css("top", "-150px");
		element.css("left","180px");
		element.css("z-index","100");
		element.css("display","block")
		//element.css("left", "200px");
		element.children().css("height", "40px");
		element.children().css("width", "150px");
		
		angular.forEach(['playerWidth', 'playerHeight'], function (key) {
	      	scope.$watch(key, function(){
	      		console.log("playerHeight is "+scope.playerHeight);
		    	element.css("top", scope.playerHeight-150+"px");
		    	
			});
		});
    }
  };
})

.directive("check",['$timeout', 'Lecture', '$stateParams', function($timeout, Lecture, $stateParams) {
  return {// doesnt work with ng-class - only if used from the very beginning..
    restrict:"E",
    // use replace?
    template:'<input type="button" class="btn btn-primary" value="Check Answer" ng-click="check_answer()" />',	
    link: function(scope, element, attrs) {
    	element.css("position", "relative");
      element.css("top", "-40px");
  		element.css("padding", "8px");
      element.children().css("height", "25px");
  		element.children().css("padding-top", "2px");	
    	
    	angular.forEach(['playerWidth', 'playerHeight'], function (key){
        scope.$watch(key, function(){
          console.log("playerHeight is "+scope.playerHeight);
          element.css("top", scope.playerHeight-36+"px");		    	
		    });
		  });
		
      var sendAnswers=function(){
        var selected_answers
        if(scope.selected_quiz.question_type == "OCQ" || scope.selected_quiz.question_type == "MCQ"){
          selected_answers=[]
          scope.selected_quiz.online_answers.forEach(function(answer){
            if(answer.selected)
              selected_answers.push(answer.id)
          })
          if(selected_answers.length ==0)
            return

          if(scope.selected_quiz.question_type == "OCQ" && selected_answers.length==1)
            selected_answers = selected_answers[0]
        }
        else
        {
          selected_answers={}
          selected_answers = scope.studentAnswers[scope.selected_quiz.id]
          var count = 0
          for (var el in selected_answers)
            count++
          if(count<scope.selected_quiz.online_answers.length)
            return
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

  		scope.check_answer = function()
  		{
  			console.log("check answer "+scope.solution);
  			if(scope.selected_quiz.quiz_type=="invideo"){
  		    sendAnswers()
    		}
        else{
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
          			// scope.update_answers+=1;
          			// scope.explanation= data["detailed_exp"];
          			// scope.verdict=data["correct"]?"Correct":"Incorrect";
                displayResult(data)
      		    }
            );
  			};
      }

      var displayResult=function(data){
        for(var el in data["detailed_exp"])
          scope.explanation[el]= data["detailed_exp"][el];

        scope.verdict=data["correct"]?"Correct":"Incorrect";
        scope.show_notification=true;

        $timeout(function(){
          scope.show_notification=false;
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
				console.log(scope.quiz);
				console.log(scope.quiz.answers);
				scope.values=0
				for(var element in scope.quiz.answers)
				{
					console.log(scope.quiz.answers[element].correct)
					if(scope.quiz.answers[element].correct==true)
					{
						console.log("in true");
						scope.values+=1
					}
				}
				console.log(scope.values)
			}
			
			
			scope.radioChange=function(corr_ans){
				scope.quiz.answers.forEach(function(ans){
					ans.correct=false
				})
				corr_ans.correct=true
				
				scope.updateValues();
			}
			
			scope.show = function()
			{
				 return !("content" in scope.quiz)
			}
			
			scope.$watch('quiz.answers', function(){
				scope.updateValues();	
			},true)
			
		}
	};
}).directive('studentHtmlMcq',function(){	
	return{
		restrict:'E',
		template:"{{explanation[answer.id]}}<ng-form name='aform'>"+
					"<input atleastone ng-model='studentAnswers[quiz.id][answer.id]' name='mcq_{{quiz.id}}' type='checkbox' ng-change='updateValues({{quiz.id}})' pop-over='mypop' unique='true'/>"+
					"{{answer.answer}}<br/><span class='errormessage' ng-show='submitted && !valid(question.id)'>Must choose atleast one answer!</span>"+
				"</ng-form>",
		link:function(scope){
			
			scope.$watch('explanation[answer.id]', function(newval){
				if(scope.explanation && scope.explanation[scope.answer.id])
				{
					console.log("exp changed!!!")
					scope.mypop={
						content:"<div>{{explanation[answer.id]}}</div>",
						html:true,
						trigger:'hover'
					}
				}	
			})
	}
		
	}
	
}).directive('studentHtmlOcq',['$timeout',function($timeout){
	return {
		restrict:'E',
		template:"<ng-form name='aform'>"+
					"<input atleastone ng-model='studentAnswers[quiz.id]' value='{{answer.id}}'  name='ocq_{{quiz.id}}' type='radio' ng-change='updateValues({{quiz.id}})' pop-over='mypop' unique='true'/>"+
					"{{answer.answer}}<br/><span class='errormessage' ng-show='submitted && !valid(question.id)'>Must choose atleast one answer!</span>"+
							 	
				"</ng-form>",
		link: function(scope)
		{
			
			scope.$watch('explanation[answer.id]', function(newval){
				if(scope.explanation && scope.explanation[scope.answer.id])
				{
					console.log("exp changed!!!")
					scope.mypop={
						content:"<div>{{explanation[answer.id]}}</div>",
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
  }
})
.directive('studentAnswer', ['$compile', '$rootScope', function($compile, $rootScope){
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
        scope.xcoor = (scope.data.xcoor * ontop.width()) - add_left;       
        scope.ycoor = (scope.data.ycoor * (ontop.height())) + add_top;
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
          scope.verdict = scope.explanation[scope.data.id][0]? "Correct": "Incorrect"
          scope.explanation_pop={
            title:"<b ng-class='{green_notification: explanation[data.id][0], red_notification: !explanation[data.id][0]}'>{{verdict}}</b>",
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
.directive('studentDrag',function(){
  return {
    restrict:'E',
    template:'<div ng-style="{left: xcoor, top: ycoor, width:width, height:height, position: \'absolute\',  marginTop:\'0px\'}" data-drop="true" jqyoui-droppable=\'{onDrop:"setDropped", onOver:"formatDropped", onOut:"clearDropped"}\' class="drop-div" ></div>'+
             '<b class="dragged" data-drag="true" data-jqyoui-options=\'{containment:".widescreen"}\' jqyoui-draggable=\'{onStart:"formatDrag", onDrag:"adjustDrag"}\' pop-over="explanation_pop">{{data.answer}}</b>',
    link:function(scope,elem){
      console.log("student drag")
      console.log(scope.data)
      var setAnswerLocation=function(){
        var ontop=angular.element('.ontop');
        scope.width  = scope.data.width * ontop.width();
        scope.height = scope.data.height* (ontop.height() - 26);
        scope.xcoor = (scope.data.xcoor * ontop.width())
        scope.ycoor = (scope.data.ycoor * (ontop.height() - 26))
      }

      scope.formatDrag=function(event, ui){
        var drag_elem = angular.element(ui.helper[0])
        reverseSize(drag_elem)
      }

      scope.adjustDrag=function(event, ui){
        var drag_elem = angular.element(ui.helper[0])
        var ontop = angular.element('.ontop');
        var left= event.pageX - ontop.offset().left
        var top = event.pageY - ontop.offset().top
        ui.position.left = left - (drag_elem.width())
        ui.position.top = top - (drag_elem.height())
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
          ui.draggable.width(drop_elem.css('width'));
          ui.draggable.height(drop_elem.css('height'));
          ui.draggable.addClass('dropped')
          ui.draggable.css('left', drop_elem.position().left+12)
          ui.draggable.css('top', drop_elem.position().top+2)
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
     
      scope.$watch('explanation[data.id]', function(newval){
        if(scope.explanation && scope.explanation[scope.data.id]){
          scope.verdict = scope.explanation[scope.data.id][0]? "Correct": "Incorrect"
          scope.explanation_pop={
            title:"<b ng-class='{green_notification: explanation[data.id][0], red_notification: !explanation[data.id][0]}'>{{verdict}}</b>",
            content:"<div>{{explanation[data.id][1]}}</div>",
            html:true,
            trigger:'hover'
          }
          var bg_color = scope.explanation[scope.data.id][0]? "lightgreen": "orangered"
          angular.element('#'+scope.data.id).css('background-color', bg_color)
        } 
      })

      setAnswerLocation()
    }
  }
})