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
  		element.css("display", "inline-block");
  		element.css("z-index",10000);
		
    	angular.forEach(['pWidth', 'pHeight'], function (key) {
	      	scope.$watch(key, function(){
	      		console.log("inside the each fn..")
	      			console.log("playerHeight is "+scope.pHeight);
	      			console.log("playerWidth is "+scope.pWidth);
		    		element.css("top", scope.pHeight-26+"px");
		    		element.css("left", scope.pWidth-350+"px");
		    		if(scope.full_screen)
		    		{
		    			console.log("in fullscreen");
		    			element.css("z-index",10000);
		    		}
		    		else	
		    			element.css("z-index",1000);
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
      			//$("body").css("overflow","hidden").css("position","fixed");
      			scope.resizeBig();
      		else
      			scope.resizeSmall();
      			//$("body").css("overflow","").css("position","");
      		
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
.directive("notification", function($timeout, Lecture) {
  return {// doesnt work with ng-class - only if used from the very beginning..
    restrict:"E",
    // use replace?
	template:'<div class="well"><div ng-show="show_notification==true"><center><b ng-class="{\'green_notification\':verdict==\'Correct\', \'red_notification\':verdict==\'Incorrect\'}">{{verdict}}</b><br/><p ng-hide="selected_quiz.quiz_type==\'html\' && selected_quiz.question_type.toUpperCase()==\'DRAG\'">Hover for details...</center></div><div ng-show="show_notification!=true">{{show_notification}}</div></div>',
	
    link: function(scope, element, attrs) {
    	element.css("position", "relative");
		element.css("top", "350px");
		element.css("left","180px")
		//element.css("left", "200px");
		element.children().css("height", "40px");
		element.children().css("width", "150px");
		element.css("z-index","10000");
		element.css("display","block");
		
		angular.forEach(['pWidth', 'pHeight'], function (key) {
	      	scope.$watch(key, function(){
	      			element.css("top", scope.pHeight-150+"px");
	      			console.log("playerHeight is "+scope.playerHeight);
	      			if(!scope.full_screen)
		    			element.css("z-index",1000);
		    		else	
		    			element.css("z-index",10000);
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
		element.css("top", "440px");
		//element.css("left", "200px");
		element.css("z-index",10000);
		element.children().css("height", "25px");
		
    	
    	angular.forEach(['pWidth', 'pHeight'], function (key) {
	      	scope.$watch(key, function(){
	      		console.log("playerHeight is "+scope.pHeight);
		    	element.css("top", scope.pHeight-36+"px");
		    	
		    	if(!scope.full_screen)
		    			element.css("z-index",1000);
		    	else	
		    			element.css("z-index",10000);
		    	
			});
		});
		
		scope.check_answer = function()
		{
			
			console.log("check answer "+scope.solution);
			if(scope.selected_quiz.quiz_type=="invideo"){
			 Lecture.saveOnline({course_id: $stateParams.course_id, lecture_id:$stateParams.lecture_id},{quiz:scope.selected_quiz.id, answer:scope.solution}, function(data){
    			// scope.update_answers+=1;
    			 
    		 });
    		}else{
    			console.log(scope.answer_form);
    			
    			if(scope.answer_form.$error.atleastone==false)
    			{
    				console.log("valid form")
    				scope.submitted=false;
	    			Lecture.saveHtml({course_id: $stateParams.course_id, lecture_id:$stateParams.lecture_id},{quiz:scope.selected_quiz.id, answer:scope.studentAnswers[scope.selected_quiz.id]}, function(data){
	    			 for(var el in data["detailed_exp"])
	    			 	scope.explanation[el]= data["detailed_exp"][el];
	    			 scope.verdict=data["correct"]?"Correct":"Incorrect";
	    			 scope.show_notification=true;
	    			 if(data["msg"]!="Empty") // he chose sthg
	    			 {
	    			 	scope.selected_quiz.is_quiz_solved=true;
	    			 	scope.$emit('accordianReload');
						scope.$emit('accordianUpdate',{g_id:scope.lecture.group_id, type:"lecture", id:scope.lecture.id});
	    			 }
	    			 // here if choice wasn't empty.. want to set is_quiz_solved for that quiz to true.
	    			 
	    			 $timeout(function(){
	             		 scope.show_notification=false;
	         		 }, 2000);
	         	 
    		 	});
    		 }else{
    		 	console.log("invalid form")
    		 	scope.submitted=true;
    		 }
			};
    }
   }
  }
}]).directive('studentAnswerForm', ['Lecture','$stateParams','CourseEditor',function(Lecture, $stateParams, CourseEditor){
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
}).directive('studentHtmlMcq',function(){	
	return{
		restrict:'E',
		template:"<ng-form name='aform'>"+
					"<input atleastone ng-model='studentAnswers[quiz.id][answer.id]' name='mcq_{{quiz.id}}' type='checkbox' ng-change='updateValues({{quiz.id}})' pop-over='mypop' unique='true'/>"+
					"{{answer.answer}}<br/><span class='errormessage' ng-show='submitted && aform.$error.atleastone'>Must choose atleast one answer!</span><br/>"+
				"</ng-form>",
		link:function(scope){
			
			scope.$watch('explanation[answer.id]', function(newval){
				if(scope.explanation && scope.explanation[scope.answer.id])
				{
					console.log("exp changed!!!")
					scope.mypop={
						title:'<b ng-class="{\'green_notification\':explanation[answer.id][0]==true, \'red_notification\':explanation[answer.id][0]==false}">{{explanation[answer.id][0]==true?"Correct":"Incorrect"}}</b>',
						content:'<div>{{explanation[answer.id][1]}}</div>',
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
					"{{answer.answer}}<br/><span class='errormessage' ng-show='submitted && aform.$error.atleastone'>Must choose atleast one answer!</span><br/>"+
							 	
				"</ng-form>",
		link: function(scope)
		{
			
			scope.$watch('explanation[answer.id]', function(newval){
				if(scope.explanation && scope.explanation[scope.answer.id])
				{
					console.log("exp changed!!!")
					scope.mypop={
						title:'<b ng-class="{\'green_notification\':explanation[answer.id][0]==true, \'red_notification\':explanation[answer.id][0]==false}">{{explanation[answer.id][0]==true?"Correct":"Incorrect"}}</b>',
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
    template: "<div ng-switch on='quiz.question_type'>"+
                "<student-answer ng-switch-when='MCQ' />"+
                "<student-answer ng-switch-when='OCQ' />"+
                "<student-drag ng-switch-when='drag' />"+
              "</div>",
  }
})

