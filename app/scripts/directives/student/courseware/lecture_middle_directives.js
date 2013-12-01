'use strict';

angular.module('scalearAngularApp')
.directive("controls", function($timeout, Lecture) {
  return {// doesnt work with ng-class - only if used from the very beginning..
    restrict:"E",
    // no scope hence same as the controller scope.
    templateUrl:"../views/student/lectures/controls.html",
    link: function(scope, element, attrs) {
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
      		Lecture.get(scope.path+"/confused",{time:scope.pop.currentTime()}, function(data){
    			$timeout(function(){
             		scope.show_message=false;
         		}, 2000);	
    		});
      		
      	};
      	scope.back= function(time)
      	{
      		Lecture.get(scope.path+"/back",{time:time}, function(){});
      	};
      	scope.pause= function(time)
      	{
      		Lecture.get(scope.path+"/pause",{time:time}, function(){});
      	};
      	scope.question= function()
      	{
      		console.log("in question");
      		scope.safeApply(function(){
	      		scope.show_question=!scope.show_question;
	      	});
	      		if(scope.show_question==true)
	      			scope.pop.pause();
	      		else
	      			scope.pop.play();
	      	
      	};
      	scope.submit_question = function()
      	{
      		console.log("will submit "+scope.question_asked);
      		// Lecture.get(scope.path+"/confused_question",{time:scope.pop.currentTime(), ques: scope.question_asked}, function(data){
    				// scope.question_asked="";
    				// scope.show_question=false;
    				// scope.pop.play();
    		// });
      		
      	};
      	scope.setShortcuts = function()
    		{
    				// adding shortcuts
    				shortcut.add("c", scope.confused, {"disable_in_input" : true});
    			
    				shortcut.add("q", scope.question, {"disable_in_input" : true});
    			
    				shortcut.add("Space",function(){
    					scope.pop.paused()? scope.pop.play(): scope.pop.pause();
    				},{"disable_in_input" : true});
    			
    				shortcut.add("b",function(){
    					var t=scope.pop.currentTime();
    					scope.seekTo(t-10);
    					scope.back(t);
    				},{"disable_in_input" : true});
    		};
      	
    }
  };
})
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
	template:'<div class="well"><center><b ng-class="{\'green\':verdict==\'Correct\', \'red\':verdict==\'Incorrect\'}">{{verdict}}</b><br/>Hover for details...</center></div>',
	
    link: function(scope, element, attrs) {
    	element.css("position", "relative");
		element.css("top", "350px");
		element.css("left","180px")
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
.directive("check", function($timeout, Lecture) {
  return {// doesnt work with ng-class - only if used from the very beginning..
    restrict:"E",
    // use replace?
	template:'<input type="button" class="btn btn-primary" value="Check Answer" ng-click="check_answer()" />',
	
    link: function(scope, element, attrs) {
    	
    	element.css("position", "relative");
		element.css("top", "440px");
		//element.css("left", "200px");
		element.children().css("height", "25px");
		
    	
    	angular.forEach(['playerWidth', 'playerHeight'], function (key) {
	      	scope.$watch(key, function(){
	      		console.log("playerHeight is "+scope.playerHeight);
		    	element.css("top", scope.playerHeight-36+"px");
		    	
			});
		});
		
		scope.check_answer = function()
		{
			
			console.log("check answer "+scope.solution);
			// Lecture.get(scope.path+"/save_online",{quiz:scope.current_quiz.id, answer:scope.solution}, function(data){
    			// scope.update_answers+=1;
    			// scope.explanation= data["detailed_exp"];
    			// scope.verdict=data["correct"]?"Correct":"Incorrect";
    			// scope.show_notification=true;
    			// $timeout(function(){
             		// scope.show_notification=false;
         		// }, 2000);
    		// });
		};
    }
  };
})    			
.directive("studentQuiz", function($timeout, Lecture) {
  return {// doesnt work with ng-class - only if used from the very beginning..
    restrict:"E",
    // use replace?
	template:'<div ng-include="getTemplateUrl()"></div>',
	
    link: function(scope, element, attrs) {
    	
    	scope.solution={};
    	scope.explanation={};
    	
    	scope.getTemplateUrl = function()
    	{
    		if(scope.answers!=null)
    		{
    			console.log("in get_template")
    			scope.choices= scope.answers["answers"];
    			
    		}
    		//console.log("in template url")
    		//console.log(scope.quiz_type);
    		if(scope.quiz_type == 'invideo')
    		{
    			if(scope.question_type=='OCQ')
    				return '../views/invideo_ocq.html';
    			else if(scope.question_type=='MCQ')
    				return '../views/invideo_mcq.html';
    			else
    			{
    				return '../views/invideo_drag.html';
    			}
    		}
    		else{
    		
    			if(scope.question_type=='OCQ')
    				return '../views/html_ocq.html';
    			else if(scope.question_type=='MCQ')
    				return '../views/html_mcq.html';
    			else
    				return '../views/html_drag.html';
    			}
    	};
    	
      	
	}
};
})
.directive("studentAnswerVideo",function(){
  return {
    restrict:"E",
    template: "<div ng-switch on='quiz.question_type'>"+
                "<student-answer ng-switch-when='MCQ' />"+
                "<student-answer ng-switch-when='OCQ' />"+
                "<student-drag ng-switch-when='drag' />"+
              "</div>",
  }
})
